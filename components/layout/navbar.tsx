"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/login-modal";
import { SignupModal } from "@/components/auth/signup-modal";
import Image from "next/image";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { RealTimeNotifications } from "@/components/notifications/RealTimeNotifications";
import { LogOut, Sparkles } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
	const { user, logout } = useEnhancedUser();
	const [showLogin, setShowLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);

	return (
		<>
			<nav className="border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					{/* Logo with Animation */}
					<Link href="/" className="flex items-center gap-3 group relative ml-1">
						<div className="absolute -inset-2 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
							<Image
								src="/images/mr5-logo.png"
								alt="MR5 School Logo"
								fill
								sizes="48px"
								className="object-contain drop-shadow-[0_0_10px_rgba(var(--primary-channel),0.5)]"
								priority
							/>
						</div>
						<div className="flex flex-col relative">
							<span className="text-xl font-bold bg-gradient-to-r from-primary via-white to-primary/80 bg-clip-text text-transparent tracking-tight">
								MR5 School
							</span>
							<span className="text-[10px] text-muted-foreground/80 tracking-widest font-mono uppercase">
								Smart Way to Grow
							</span>
						</div>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 shadow-inner">
						<Link
							href="/courses"
							className="px-4 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
						>
							Library
						</Link>
						<Link
							href="/about"
							className="px-4 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
						>
							Manifesto
						</Link>
						<Link
							href="/contact"
							className="px-4 py-1.5 text-sm text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
						>
							Connect
						</Link>
						{user?.role === 'student' && (
							<Link
								href="/apps/avatar-creator"
								className="px-4 py-1.5 text-sm text-primary font-bold hover:text-white hover:bg-primary/20 rounded-full transition-all duration-300 flex items-center gap-1.5 group"
							>
								<Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
								Avatar Studio
							</Link>
						)}
					</div>

					{/* Auth Buttons */}
					<div className="flex items-center gap-3">
						<ThemeCustomizer />
						<RealTimeNotifications />
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-9 w-9 rounded-full ring-2 ring-white/10 hover:ring-primary/50 transition-all duration-300 p-0 overflow-hidden"
									>
										<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 opacity-50" />
										<div className="flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm">
											<span className="text-sm font-bold text-primary">{user.name?.[0]?.toUpperCase() || "U"}</span>
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56 bg-surface/90 backdrop-blur-xl border border-white/10 text-foreground" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none text-white">
												{user.name}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator className="bg-white/10" />
									<DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-white cursor-pointer">
										<Link href={`/${user.role}`}>{user.role}</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild className="focus:bg-primary/20 focus:text-white cursor-pointer">
										<Link href="/profile">Profile settings</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator className="bg-white/10" />
									<DropdownMenuItem onClick={logout} className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer">
										<LogOut className="mr-2 h-4 w-4" />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									onClick={() => setShowLogin(true)}
									className="text-muted-foreground hover:text-white hover:bg-white/5"
								>
									Sign In
								</Button>
								<Button
									onClick={() => setShowSignup(true)}
									className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-channel),0.4)] transition-all duration-300 hover:scale-105"
								>
									Start Learning
								</Button>
							</div>
						)}
					</div>

					{/* Mobile Menu */}
					<div className="md:hidden flex items-center ml-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
									<Menu className="w-6 h-6" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-white/10 w-[300px]">
								<SheetHeader>
									<SheetTitle className="text-left text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Menu</SheetTitle>
								</SheetHeader>
								<div className="flex flex-col gap-6 mt-10">
									<div className="flex flex-col gap-2">
										<h3 className="text-sm font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">Navigation</h3>
										<Link
											href="/courses"
											className="px-4 py-3 text-lg font-medium hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between group"
										>
											Library
											<span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
										</Link>
										<Link
											href="/about"
											className="px-4 py-3 text-lg font-medium hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between group"
										>
											Manifesto
											<span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
										</Link>
										<Link
											href="/contact"
											className="px-4 py-3 text-lg font-medium hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between group"
										>
											Connect
											<span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
										</Link>
									</div>

									{!user && (
										<div className="flex flex-col gap-3 mt-4 px-2">
											<Button onClick={() => setShowLogin(true)} variant="secondary" className="w-full justify-center">
												Sign In
											</Button>
											<Button onClick={() => setShowSignup(true)} className="w-full justify-center">
												Start Learning
											</Button>
										</div>
									)}
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</nav>

			<LoginModal _open={showLogin} onOpenChange={setShowLogin} />
			<SignupModal _open={showSignup} onOpenChange={setShowSignup} />
		</>
	);
}

