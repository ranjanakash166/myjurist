"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "next-themes";
import CompanyInfo from "../../components/CompanyInfo";
import Captcha from "../../components/Captcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captchaValid) {
      setError("Please complete the security verification");
      return;
    }

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to send password reset email");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while requesting password reset");
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
                  Check Your Email
                </CardTitle>
                <p className="text-muted-foreground">
                  If an account with this email exists, we've sent a password reset link to your inbox.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The password reset link will expire in 24 hours.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Don't see the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      try again
                    </button>
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
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

      {/* Right Side - Forgot Password Form */}
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
                Forgot Password
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Captcha onValidated={setCaptchaValid} />

              <Button
                type="submit"
                disabled={loading || !captchaValid}
                className="w-full"
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
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
