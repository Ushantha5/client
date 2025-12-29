"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { authService } from "@/services/auth.service";
import { useAdvancedCache } from "@/hooks/useAdvancedCache";

interface EnhancedUserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "student" | "AI-TEACHER") => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearUserCache: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  // Enhanced features
  userPreferences: UserPreferences;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  userStats: UserStats;
  refreshUserStats: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  userRoles: string[];
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    profileVisibility: "public" | "friends" | "private";
    activityStatus: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: "small" | "medium" | "large";
  };
}

interface UserStats {
  totalCourses: number;
  completedLessons: number;
  streakDays: number;
  achievements: string[];
  lastActive: Date | null;
}

const defaultUserContext: EnhancedUserContextType = {
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => { console.warn("Login function called outside of EnhancedUserProvider."); },
  register: async () => { console.warn("Register function called outside of EnhancedUserProvider."); },
  logout: () => { console.warn("Logout function called outside of EnhancedUserProvider."); },
  refreshUser: async () => { console.warn("refreshUser function called outside of EnhancedUserProvider."); },
  clearUserCache: () => { console.warn("clearUserCache function called outside of EnhancedUserProvider."); },
  updateUserProfile: async () => { console.warn("updateUserProfile function called outside of EnhancedUserProvider."); },
  // Enhanced features
  userPreferences: {
    theme: "system",
    language: "en",
    notifications: {
      email: true,
      push: true,
      inApp: true
    },
    privacy: {
      profileVisibility: "public",
      activityStatus: true
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      fontSize: "medium"
    }
  },
  updateUserPreferences: () => { console.warn("updateUserPreferences function called outside of EnhancedUserProvider."); },
  userStats: {
    totalCourses: 0,
    completedLessons: 0,
    streakDays: 0,
    achievements: [],
    lastActive: null
  },
  refreshUserStats: async () => { console.warn("refreshUserStats function called outside of EnhancedUserProvider."); },
  hasPermission: () => false,
  userRoles: []
};

const EnhancedUserContext = createContext<EnhancedUserContextType>(defaultUserContext);

export function EnhancedUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultUserContext.userPreferences);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserContext.userStats);
  const router = useRouter();

  // Use advanced caching for user data
  const userCache = useAdvancedCache({ ttl: 5 * 60 * 1000 }); // 5 minutes cache

  const isAuthenticated = !!user;
  const userRoles = useMemo(() => user ? [user.role] : [], [user]);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error("Failed to parse user preferences", e);
      }
    }
  }, []);

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

  /**
   * Refresh user data from the server
   */
  const refreshUser = useCallback(async () => {
    try {
      // Check cache first
      const cachedUser = userCache.get("currentUser");
      if (cachedUser) {
        setUser(cachedUser as User | null);
        return;
      }

      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        // Update cache
        userCache.set("currentUser", response.data);
        setUser(response.data);
      }
    } catch (error) {
      // If refresh fails (e.g., 401), clear user state
      setUser(null);
      userCache.clear();
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [userCache]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // Note: HttpOnly cookies are not visible in document.cookie, so we must rely on the API call
      // to determine if the user is authenticated. We attempted to check document.cookie here
      // but it causes false negatives when using secure cookies.

      try {
        await refreshUser();
      } catch (error) {
        // Not logged in or session expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshUser]);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const { user: userData } = response.data;
      // Note: accessToken/refreshToken are set as httpOnly cookies by the server

      setUser(userData);
      // Update cache
      userCache.set("currentUser", userData);

      // Redirect based on role using router.push for SPA navigation
      switch (userData.role) {
        case "admin":
          router.push("/admin");
          break;
        case "AI-TEACHER":
          router.push("/dashboard");
          break;
        case "student":
          router.push("/student/portal");
          break;
        default:
          router.push("/");
      }
    }
  }, [userCache, router]);

  /**
   * Register a new user
   */
  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    role?: "student" | "AI-TEACHER",
  ) => {
    const response = await authService.register({
      name,
      email,
      password,
      role,
    });

    if (response.success && response.data) {
      // Backend now auto-logs in after register (sets cookies)
      await refreshUser(); // Fetch user data
      router.push("/dashboard"); // Redirect to dashboard
    }
  }, [refreshUser, router]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore errors
    } finally {
      setUser(null);
      // Clear cache
      userCache.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("userPreferences");
      router.push("/login");
    }
  }, [userCache, router]);

  /**
   * Clear user cache (useful after profile updates)
   */
  const clearUserCache = useCallback(() => {
    userCache.clear();
  }, [userCache]);

  /**
   * Update user profile
   */
  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    const response = await authService.updateProfile(data);
    if (response.success && response.data) {
      setUser(prev => prev ? { ...prev, ...response.data } : null);
      userCache.set("currentUser", response.data);
    }
  }, [userCache]);

  /**
   * Update user preferences
   */
  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...preferences
    }));
  }, []);

  /**
   * Refresh user stats
   */
  const refreshUserStats = useCallback(async () => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate with mock data
    const mockStats: UserStats = {
      totalCourses: Math.floor(Math.random() * 20) + 5,
      completedLessons: Math.floor(Math.random() * 100) + 20,
      streakDays: Math.floor(Math.random() * 30) + 1,
      achievements: ["First Course", "Quick Learner", "Streak Master"],
      lastActive: new Date()
    };

    setUserStats(mockStats);
  }, []);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;

    // Simple permission checking based on role
    const permissions: Record<string, string[]> = {
      "admin": ["manage_users", "manage_courses", "view_analytics", "manage_payments"],
      "AI-TEACHER": ["create_courses", "manage_students", "view_progress"],
      "student": ["enroll_courses", "complete_lessons", "track_progress"]
    };

    return permissions[user.role]?.includes(permission) || false;
  }, [user]);

  // Refresh stats on user change
  useEffect(() => {
    if (user) {
      refreshUserStats();
    }
  }, [user, refreshUserStats]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    clearUserCache,
    updateUserProfile,
    // Enhanced features
    userPreferences,
    updateUserPreferences,
    userStats,
    refreshUserStats,
    hasPermission,
    userRoles
  }), [
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    clearUserCache,
    updateUserProfile,
    userPreferences,
    updateUserPreferences,
    userStats,
    refreshUserStats,
    hasPermission,
    userRoles
  ]);

  return (
    <EnhancedUserContext.Provider value={contextValue}>
      {children}
    </EnhancedUserContext.Provider>
  );
}

export function useEnhancedUser() {
  return useContext(EnhancedUserContext);
}