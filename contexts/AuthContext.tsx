"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import { User } from "@/types/user";
import { handleApiError } from "@/lib/errorHandler";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string, role?: "student" | "AI-TEACHER") => Promise<void>;
	logout: () => void;
	refreshUser: () => Promise<void>;
	clearUserCache: () => void;
}

const defaultAuthContext: AuthContextType = {
    user: null,
    loading: false,
    isAuthenticated: false,
    login: async () => { console.warn("Login function called outside of AuthProvider."); },
    register: async () => { console.warn("Register function called outside of AuthProvider."); },
    logout: () => { console.warn("Logout function called outside of AuthProvider."); },
    refreshUser: async () => { console.warn("refreshUser function called outside of AuthProvider."); },
    clearUserCache: () => { console.warn("clearUserCache function called outside of AuthProvider."); },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Cache for user data to prevent excessive API calls
let userCache: User | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Debounce flag to prevent multiple simultaneous requests
let isFetching = false;

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const isAuthenticated = !!user;

	/**
	 * Refresh user data from the server
	 */
	const refreshUser = async () => {
		// Prevent multiple simultaneous requests
		if (isFetching) {
			return;
		}
		
		try {
			isFetching = true;
			
			// Check if we have valid cached data
			const now = Date.now();
			if (userCache && (now - lastFetchTime) < CACHE_DURATION) {
				setUser(userCache);
				isFetching = false;
				return;
			}
			
			const response = await authService.getCurrentUser();
			if (response.success && response.data) {
				// Update cache
				userCache = response.data;
				lastFetchTime = Date.now();
				setUser(response.data);
			}
		} catch (_error) {
			// If refresh fails (e.g., 401), clear user state
			setUser(null);
			userCache = null;
			Cookies.remove("token");
		} finally {
			isFetching = false;
		}
	};

	// Initialize auth state on mount
	useEffect(() => {
		const initAuth = async () => {
			try {
				// We rely on the httpOnly cookie. If it exists and is valid, this returns the user.
				// If it's expired/invalid, refreshUser -> API -> might auto-refresh via interceptor
				await refreshUser();
			} catch (_error) {
				// Not logged in or session expired
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, []);

	/**
	 * Login with email and password
	 */
	const login = async (email: string, password: string) => {
		try {
			const response = await authService.login({ email, password });

			if (response.success && response.data) {
				const { user: userData } = response.data;
				// Note: accessToken/refreshToken are set as httpOnly cookies by the server

				setUser(userData);
				// Update cache
				userCache = userData;
				lastFetchTime = Date.now();

				// Redirect based on role
				switch (userData.role) {
					case "admin":
						router.push("/admin");
						break;
					case "AI-TEACHER":
						router.push("/dashboard");
						break;
					case "student":
						router.push("/student");
						break;
					default:
						router.push("/");
				}
			}
		} catch (error) {
			const errorMessage = handleApiError(error, "Login");
			throw new Error(errorMessage);
		}
	};

	/**
	 * Register a new user
	 */
	const register = async (
		name: string,
		email: string,
		password: string,
		role?: "student" | "AI-TEACHER",
	) => {
		try {
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
		} catch (error) {
			const errorMessage = handleApiError(error, "Registration");
			throw new Error(errorMessage);
		}
	};

	/**
	 * Logout user
	 */
	const logout = async () => {
		try {
			await authService.logout();
		} catch (_error) {
			// Ignore errors
		} finally {
			setUser(null);
			// Clear cache
			userCache = null;
			lastFetchTime = 0;
			// Cookies are cleared by the backend response
			// We can also clear local state/storage if we used any
			router.push("/login");
		}
	};
	
	/**
	 * Clear user cache (useful after profile updates)
	 */
	const clearUserCache = () => {
		userCache = null;
		lastFetchTime = 0;
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, isAuthenticated, login, register, logout, refreshUser, clearUserCache }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}