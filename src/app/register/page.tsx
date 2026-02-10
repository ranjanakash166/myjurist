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
import MyJuristLogoWithWordmark from "@/components/landing/MyJuristLogoWithWordmark";

type RegistrationStep = "basic" | "otp" | "password";

export default function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>("basic");
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [otpInfo, setOtpInfo] = useState<{
    email: string;
    expires_in_minutes: number;
    otp_length: number;
  } | null>(null);
  
  const router = useRouter();
  const { sendOtp, verifyOtp } = useAuth();
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!captchaValid) {
      setError("Please complete the security verification");
      setLoading(false);
      return;
    }

    try {
      const result = await sendOtp(formData.email, formData.full_name);
      
      if (result.success) {
        setOtpInfo(result.data);
        setStep("otp");
      } else {
        setError(result.error || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyOtp(formData.email, formData.otp, formData.password, formData.full_name);
      
      if (result.success) {
        router.push("/app/home");
      } else {
        setError(result.error || "OTP verification failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during OTP verification");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!captchaValid) {
      setError("Please complete the security verification");
      return;
    }

    setStep("otp");
  };

  const renderBasicInfoStep = () => (
    <form onSubmit={handleSendOtp} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <Captcha onValidated={setCaptchaValid} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading || !captchaValid}
        className="w-full"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Verify Your Email
        </h3>
        <p className="text-muted-foreground">
          We've sent a {otpInfo?.otp_length || 6}-digit code to <strong>{formData.email}</strong>
        </p>
        {otpInfo && (
          <p className="text-sm text-muted-foreground mt-2">
            Code expires in {otpInfo.expires_in_minutes} minutes
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">OTP Code</Label>
        <Input
          type="text"
          id="otp"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          className="text-center text-lg tracking-widest"
          placeholder="Enter OTP code"
          maxLength={otpInfo?.otp_length || 6}
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
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
        disabled={loading}
        className="w-full"
      >
        {loading ? "Verifying..." : "Verify & Create Account"}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Company Info */}
      <div className="hidden lg:block lg:w-1/2">
        <CompanyInfo />
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <MyJuristLogoWithWordmark variant="light" size={32} href="/" className="justify-center" />
              </div>
              <p className="text-muted-foreground text-sm">
                Next Generation AI-Powered Legal Intelligence
              </p>
            </div>

            <div className="text-center">
              <CardTitle className="text-3xl font-bold mb-2 text-foreground">
                Create Account
              </CardTitle>
              <p className="text-muted-foreground">
                Join My Jurist and transform your legal due diligence
              </p>
            </div>
          </CardHeader>

          <CardContent>
            {step === "basic" && renderBasicInfoStep()}
            {step === "otp" && renderOtpStep()}

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
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