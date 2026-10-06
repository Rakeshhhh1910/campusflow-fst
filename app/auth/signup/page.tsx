"use client";

/**
 * app/auth/signup/page.tsx
 * Student Sign Up Page using Better Auth React Client.
 */

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Loader2, UserPlus, ShieldAlert } from "lucide-react";
import { signUp } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signUp.email({
        email,
        password,
        name,
      });

      if (res.error) {
        setError(res.error.message || "Failed to create account.");
        toast.error("Registration error");
      } else {
        toast.success("Account created successfully! Welcome to CampusFlow.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      toast.error("Sign up error");
    } finally {
      setLoading(false);
    }
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
            Create Your Student Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Join the university service network and start registering for campus activities.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Registration</CardTitle>
            <CardDescription className="text-xs">
              All accounts default to verified MEMBER status.
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
                <Label htmlFor="name" className="text-xs font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Campus Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex.morgan@campusflow.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password (8+ characters)
                </Label>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span>Already have an account?</span>
            <Link
              href="/auth/signin"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
