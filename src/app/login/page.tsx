"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import CompanyInfo from "../../components/CompanyInfo";
import Captcha from "../../components/Captcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import MyJuristLogoWithWordmark from "@/components/landing/MyJuristLogoWithWordmark";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!captchaValid) {
      setError("Please complete the security verification");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        router.push("/app/home");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col lg:flex-row">
      {/* Left Side - Company Info (dark panel) */}
      <div className="hidden lg:block lg:w-1/2 lg:h-[100dvh]">
        <CompanyInfo />
      </div>

      {/* Right Side - Login Form (gradient background + card) */}
      <div
        className="flex-1 lg:w-1/2 h-[100dvh] flex items-center justify-center p-4 sm:p-6 lg:p-6"
        style={{
          background: "linear-gradient(90deg, #eff6ff 0%, #f5f3ff 50%, #fce7f3 100%)",
        }}
      >
        <Card className="w-full max-w-md bg-white border border-slate-200/80 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-2">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <MyJuristLogoWithWordmark variant="light" size={32} href="/" className="justify-center" />
              </div>
              <p className="text-[#475569] text-sm">
                Next Generation AI-Powered Legal Intelligence
              </p>
            </div>

            <div className="text-center">
              <CardTitle className="text-3xl font-bold mb-2 text-[#0f172a]">
                Welcome back
              </CardTitle>
              <p className="text-[#475569] text-sm">
                Sign in to your My Jurist account
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-[#0f172a]">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. admin@mail.com"
                  required
                  autoFocus
                  className="border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#2F80ED] focus-visible:border-[#2F80ED] h-11 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-[#0f172a]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#2F80ED] focus-visible:border-[#2F80ED] h-11 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium transition-colors text-[#2F80ED] hover:text-[#2563EB]"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                className="w-full h-11 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-70"
                style={{
                  backgroundColor: "#2F80ED",
                }}
              >
                {loading ? "Signing In..." : "Login"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#475569]">
                Don't have an account?{" "}
                <Link
                  href="/contact"
                  className="font-medium transition-colors text-[#2F80ED] hover:text-[#2563EB]"
                >
                  Contact Us
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
