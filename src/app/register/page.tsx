"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
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
        <label className="block text-sm font-medium mb-2 text-black dark:text-slate-300">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:border-blue-500 dark:focus:border-ai-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-ai-blue-500/20 focus:outline-none transition-colors shadow-sm placeholder-gray-500 dark:placeholder-slate-400 text-base"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black dark:text-slate-300">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:border-blue-500 dark:focus:border-ai-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-ai-blue-500/20 focus:outline-none transition-colors shadow-sm placeholder-gray-500 dark:placeholder-slate-400 text-base"
          placeholder="Enter your email"
          required
        />
      </div>

      <Captcha onValidated={setCaptchaValid} />

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !captchaValid}
        className="w-full py-3 sm:py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          Verify Your Email
        </h3>
        <p className="text-gray-600 dark:text-slate-400">
          We've sent a {otpInfo?.otp_length || 6}-digit code to <strong>{formData.email}</strong>
        </p>
        {otpInfo && (
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
            Code expires in {otpInfo.expires_in_minutes} minutes
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black dark:text-slate-300">
          OTP Code
        </label>
        <input
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:border-blue-500 dark:focus:border-ai-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-ai-blue-500/20 focus:outline-none transition-colors text-center text-lg tracking-widest shadow-sm placeholder-gray-500 dark:placeholder-slate-400"
          placeholder="Enter OTP code"
          maxLength={otpInfo?.otp_length || 6}
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black dark:text-slate-300">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:border-blue-500 dark:focus:border-ai-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-ai-blue-500/20 focus:outline-none transition-colors shadow-sm placeholder-gray-500 dark:placeholder-slate-400 text-base"
          placeholder="Enter your password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black dark:text-slate-300">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-3 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white focus:border-blue-500 dark:focus:border-ai-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-ai-blue-500/20 focus:outline-none transition-colors shadow-sm placeholder-gray-500 dark:placeholder-slate-400 text-base"
          placeholder="Confirm your password"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 sm:py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
      >
        {loading ? "Verifying..." : "Verify & Create Account"}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-900">
      {/* Left Side - Company Info */}
      <div className="hidden lg:block">
        <CompanyInfo />
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
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
              <span className="text-2xl font-bold gradient-text-animate">My Jurist</span>
            </div>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Next Generation AI-Powered Legal Intelligence
            </p>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">
              {step === "basic" ? "Create Account" : "Verify Email"}
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              {step === "basic" 
                ? "Join My Jurist and unlock AI-powered legal intelligence"
                : "Enter the verification code sent to your email"
              }
            </p>
          </div>

          {step === "basic" && renderBasicInfoStep()}
          {step === "otp" && renderOtpStep()}

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-ai-blue-400 dark:hover:text-ai-blue-300 font-medium transition-colors"
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