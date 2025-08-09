"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "next-themes";
import CompanyInfo from "../../components/CompanyInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Extract token from URL query parameters
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid reset link. Token is missing. Please check your email for the correct reset link.");
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link. Token is missing.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token, formData.password);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(result.error || "Password reset failed. Please try again or contact support.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* Left Side - Company Info */}
        <div className="hidden lg:block lg:w-1/2">
          <CompanyInfo />
        </div>

        {/* Right Side - Success Message */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src="/images/myjurist-logo.png" 
                      alt="My Jurist" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-bold text-foreground">My Jurist</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Next Generation AI-Powered Legal Intelligence
                </p>
              </div>

              <div className="text-center">
                <CardTitle className="text-3xl font-bold mb-2 text-foreground">
                  Password Reset Successful
                </CardTitle>
                <p className="text-muted-foreground">
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Redirecting to login page...
                </p>
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Company Info */}
      <div className="hidden lg:block lg:w-1/2">
        <CompanyInfo />
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/images/myjurist-logo.png" 
                    alt="My Jurist" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-foreground">My Jurist</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Next Generation AI-Powered Legal Intelligence
              </p>
            </div>

            <div className="text-center">
              <CardTitle className="text-3xl font-bold mb-2 text-foreground">
                Reset Password
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your new password below
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading || !token}
                className="w-full"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
