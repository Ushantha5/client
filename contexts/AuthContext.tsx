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
	register: (name: string, email: string, password: string, role?: "student" | "teacher") => Promise<void>;
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
		} catch (error) {
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
				} catch (error) {
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
				const { token, user: userData } = response.data;

				// Store token in cookie
				Cookies.set("token", token, {
					expires: 7, // 7 days
					sameSite: "strict",
					secure: process.env.NODE_ENV === "production",
				});

				setUser(userData);

				// Redirect based on role
				switch (userData.role) {
					case "admin":
						router.push("/admin");
						break;
					case "teacher":
						router.push("/teacher");
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
		role?: "student" | "teacher",
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
		} catch (error) {
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
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
