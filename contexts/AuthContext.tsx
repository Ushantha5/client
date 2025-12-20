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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const isAuthenticated = !!user;

	/**
	 * Refresh user data from the server
	 */
	const refreshUser = async () => {
		try {
			const response = await authService.getCurrentUser();
			if (response.success && response.data) {
				setUser(response.data);
			}
		} catch (_error) {
			// If refresh fails (e.g., 401), clear user state
			setUser(null);
			Cookies.remove("token");
		}
	};

	// Initialize auth state on mount
	useEffect(() => {
		const initAuth = async () => {
			const token = Cookies.get("token");
			if (token) {
				try {
					await refreshUser();
				} catch (_error) {
					// Token exists but is invalid - clear it
					Cookies.remove("token");
					setUser(null);
				}
			}
			setLoading(false);
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
				const { accessToken, user: userData } = response.data;

				// Store token in cookie (backend sets httpOnly cookies, but we also set a JS-accessible one for client checks)
				if (accessToken) {
					Cookies.set("token", accessToken, {
						expires: 7, // 7 days
						sameSite: "strict",
						secure: process.env.NODE_ENV === "production",
					});
				}

				setUser(userData);

				// Redirect based on role
				switch (userData.role) {
					case "admin":
						router.push("/admin");
						break;
					case "AI-TEACHER":
						router.push("/AI-TEACHER");
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
				// After successful registration, log the user in
				// The backend might return a token, or we need to login separately
				// For now, let's redirect to login
				router.push("/");
			}
		} catch (error) {
			const errorMessage = handleApiError(error, "Registration");
			throw new Error(errorMessage);
		}
	};

	/**
	 * Logout user
	 */
	const logout = () => {
		setUser(null);
		Cookies.remove("token");
		router.push("/");

		// Optionally call backend logout endpoint
		try {
			authService.logout();
		} catch (_error) {
			// Ignore logout errors - user is already logged out on client
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, isAuthenticated, login, register, logout, refreshUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	// During SSR/build, the context may be undefined. Return a default value to prevent build failures.
	if (context === undefined) {
		// Return a default auth state for SSR/build
		return {
			user: null,
			loading: true,
			isAuthenticated: false,
			login: async () => { console.warn("useAuth called outside of AuthProvider"); },
			register: async () => { console.warn("useAuth called outside of AuthProvider"); },
			logout: () => { console.warn("useAuth called outside of AuthProvider"); },
			refreshUser: async () => { console.warn("useAuth called outside of AuthProvider"); },
		} as AuthContextType;
	}
	return context;
}
