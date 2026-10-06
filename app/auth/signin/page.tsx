"use client";

/**
 * app/auth/signin/page.tsx
 * Sign In Page using Better Auth React Client.
 * 
 * Includes 1-Click Quick Demo Login credentials for:
 * 1. ADMIN (admin@campusflow.edu)
 * 2. MEMBER (student@campusflow.edu)
 * 3. GUEST (guest@campusflow.edu)
 */

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, Loader2, LogIn, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import { signIn } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import { Suspense } from "react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Invalid credentials. Please verify your email and password.");
        toast.error("Sign in failed");
      } else {
        toast.success("Welcome back to CampusFlow!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      toast.error("Sign in error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Compass className="w-6 h-6" />
            </div>
            <span>
              Campus<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your campus credentials to access the service desk and planner.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Credentials</CardTitle>
            <CardDescription className="text-xs">
              Powered by Better Auth with secure HTTP-only session cookies.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@campusflow.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Fill Helpers for Evaluator */}
            <div className="pt-4 border-t border-border/40 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Demo Accounts (Evaluation Viva)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoFill("admin@campusflow.dev", "Admin@1234")}
                  className="text-[11px] h-8 px-2 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoFill("member@campusflow.dev", "Member@1234")}
                  className="text-[11px] h-8 px-2 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  Member
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoFill("guest@campusflow.dev", "Guest@1234")}
                  className="text-[11px] h-8 px-2 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  Guest
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/auth/signup"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign Up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <SignInContent />
    </Suspense>
  );
}
