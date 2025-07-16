"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import CompanyInfo from "../../components/CompanyInfo";
import Captcha from "../../components/Captcha";

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
        router.push("/app");
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
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ai-blue-500 focus:ring-2 focus:ring-ai-blue-500/20 focus:outline-none transition-colors"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ai-blue-500 focus:ring-2 focus:ring-ai-blue-500/20 focus:outline-none transition-colors"
          placeholder="Enter your email"
          required
        />
      </div>

      <Captcha onValidated={setCaptchaValid} />

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !captchaValid}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Verify Your Email
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          We've sent a {otpInfo?.otp_length || 6}-digit code to <strong>{formData.email}</strong>
        </p>
        {otpInfo && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Code expires in {otpInfo.expires_in_minutes} minutes
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          OTP Code
        </label>
        <input
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ai-blue-500 focus:ring-2 focus:ring-ai-blue-500/20 focus:outline-none transition-colors text-center text-lg tracking-widest"
          placeholder="Enter OTP code"
          maxLength={otpInfo?.otp_length || 6}
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ai-blue-500 focus:ring-2 focus:ring-ai-blue-500/20 focus:outline-none transition-colors"
          placeholder="Create a password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-ai-blue-500 focus:ring-2 focus:ring-ai-blue-500/20 focus:outline-none transition-colors"
          placeholder="Confirm your password"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep("basic")}
          className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Verifying..." : "Create Account"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Company Info */}
      <CompanyInfo />

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
              {step === "basic" ? "Create Account" : "Verify Email"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {step === "basic" 
                ? "Join My Jurist and unlock AI-powered legal intelligence"
                : "Enter the verification code sent to your email"
              }
            </p>
          </div>

          {step === "basic" && renderBasicInfoStep()}
          {step === "otp" && renderOtpStep()}

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-ai-blue-500 hover:text-ai-blue-600 dark:text-ai-blue-400 dark:hover:text-ai-blue-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 