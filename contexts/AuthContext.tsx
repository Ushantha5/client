"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
	id: string;
	name: string;
	email: string;
	role: "student" | "teacher" | "admin";
	status: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Try to get current user from API (preferred when using cookies)
		(async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
					{ credentials: "include" },
					// Note: no CORS headers here; `app.js` allows credentials from 3000
				);
				if (res.ok) {
					const data = await res.json();
					if (data && data.success && data.data) {
						setUser(data.data);
						localStorage.setItem("user", JSON.stringify(data.data));
					}
				} else {
					// Expected 401 when not logged in - clear localStorage
					localStorage.removeItem("user");
					localStorage.removeItem("token");
				}
			} catch (err) {
				// Network error - check localStorage as fallback
				const storedUser = localStorage.getItem("user");
				if (storedUser) {
					try {
						setUser(JSON.parse(storedUser));
					} catch (parseErr) {
						// Invalid stored user - clear it
						localStorage.removeItem("user");
						localStorage.removeItem("token");
					}
				}
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ email, password }),
				},
			);

			const data = await response.json();

			if (data.success) {
				const userData = data.data.user;
				setUser(userData);
				localStorage.setItem("user", JSON.stringify(userData));
				localStorage.setItem("token", data.data.token);

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
			} else {
				throw new Error(data.message || "Login failed");
			}
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		router.push("/");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
