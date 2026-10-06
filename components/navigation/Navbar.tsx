"use client";

/**
 * components/navigation/Navbar.tsx
 * Top Navigation bar with responsive menu, theme switcher, cart trigger, and auth state.
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Calendar,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Activity,
  Menu,
  X,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ActivityCartSheet } from "@/components/activities/ActivityCartSheet";
import { useSession, signOut } from "@/lib/auth/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { data: session, isPending } = useSession();

  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  const isAdmin = user?.role === "ADMIN";

  const navLinks = [
    { href: "/activities", label: "Activities", icon: Calendar },
    { href: "/requests", label: "My Requests", icon: FileText },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(isAdmin ? [{ href: "/admin", label: "Admin Portal", icon: ShieldCheck }] : []),
    { href: "/performance", label: "Vitals", icon: Activity },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-black text-xl tracking-tight text-foreground group"
          aria-label="CampusFlow Homepage"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text">
            Campus<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions (Cart + Theme + Auth) */}
        <div className="flex items-center gap-2">
          {/* Activity Cart Drawer */}
          <ActivityCartSheet />

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Auth Menu */}
          {!isPending && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative flex items-center gap-2 rounded-full pl-2 pr-3 border border-border/50"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-medium max-w-[90px] truncate hidden sm:inline">
                    {user.name || "Account"}
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 uppercase">
                    {user.role || "MEMBER"}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Student Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/requests" className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    My Requests
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Admin Control Center
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isPending ? (
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="ghost" asChild className="text-xs font-medium">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          ) : null}

          {/* Mobile menu hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
