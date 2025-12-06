"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/login-modal";
import { SignupModal } from "@/components/auth/signup-modal";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeCustomizer } from "@/components/theme-customizer";

export function Navbar() {
	const { user, logout } = useAuth();
	const [showLogin, setShowLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);

	return (
		<>
			<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					{/* Logo with Animation */}
					<Link href="/" className="flex items-center gap-3 group">
						<div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
							<Image
								src="/images/mr5-logo.png"
								alt="MR5 School Logo"
								fill
								sizes="48px"
								className="object-contain drop-shadow-lg"
								priority
							/>
							{/* Glow effect on hover */}
							<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</div>
						<div className="flex flex-col">
							<span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
								MR5 School
							</span>
							<span className="text-xs text-muted-foreground italic">
								The Smart Way to Grow
							</span>
						</div>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-6">
						<Link
							href="/courses"
							className="text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4"
						>
							Courses
						</Link>
						<Link
							href="/about"
							className="text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4"
						>
							About
						</Link>
						<Link
							href="/contact"
							className="text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4"
						>
							Contact
						</Link>
						<Link
							href="/solver"
							className="text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4"
						>
							Solver
						</Link>
					</div>

					{/* Auth Buttons */}
					<div className="flex items-center gap-4">
						<ThemeCustomizer />
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-10 w-10 rounded-full"
									>
										<div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
											<User className="h-5 w-5" />
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{user.name}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href={`/${user.role}`}>Dashboard</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/profile">Profile</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={logout} className="text-red-600">
										<LogOut className="mr-2 h-4 w-4" />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<>
								<Button variant="ghost" onClick={() => setShowLogin(true)}>
									Sign In
								</Button>
								<Button onClick={() => setShowSignup(true)}>Get Started</Button>
							</>
						)}
					</div>
				</div>
			</nav >

			<LoginModal open={showLogin} onOpenChange={setShowLogin} />
			<SignupModal open={showSignup} onOpenChange={setShowSignup} />
		</>
	);
}
