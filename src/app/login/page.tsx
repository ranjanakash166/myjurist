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
import CtaArrowIcon from "@/components/landing/CtaArrowIcon";
import MyJuristLogoWithWordmark from "@/components/landing/MyJuristLogoWithWordmark";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
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
    <div className="min-h-screen flex flex-col lg:flex-row font-[var(--Label-Label-1-fontFamily,Inter)]">
      {/* Left Side - Company Info (landing dark panel) */}
      <div className="hidden lg:block lg:w-1/2">
        <CompanyInfo />
      </div>

      {/* Right Side - Login Form (landing gradient + card) */}
      <div
        className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen"
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
              <CardTitle
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                Welcome Back
              </CardTitle>
              <p style={{ color: "var(--text-secondary, #475569)" }}>
                Sign in to your My Jurist account
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-medium"
                  style={{ color: "var(--text-primary, #0f172a)" }}
                >
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoFocus
                  className="border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-500 focus-visible:ring-[#2563eb] focus-visible:border-[#2563eb]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-medium"
                  style={{ color: "var(--text-primary, #0f172a)" }}
                >
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="border-slate-200 bg-white text-[#0f172a] placeholder:text-slate-500 focus-visible:ring-[#2563eb] focus-visible:border-[#2563eb]"
                />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium transition-colors text-[#2563eb] hover:text-[#1d4ed8]"
                  >
                    Forgot Password?
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
                className="w-full rounded-full font-medium gap-3 px-10 py-5 text-white transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-100 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:brightness-100"
                style={{
                  padding: "20px 44px",
                  borderRadius: 100,
                  background: "var(--bg-black-solid, #0f172a)",
                  color: "var(--text-on-dark-color, #fff)",
                  fontFamily: "var(--Label-Label-1-fontFamily, Inter)",
                  fontSize: "22px",
                  fontWeight: 500,
                  lineHeight: "28px",
                }}
              >
                <span className="inline-flex items-center justify-center gap-3">
                  {loading ? "Signing In..." : "Sign In"}
                  {!loading && <CtaArrowIcon size={36} className="shrink-0" />}
                </span>
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p style={{ color: "var(--text-secondary, #475569)" }}>
                Don't have an account?{" "}
                <Link
                  href="/contact"
                  className="font-medium transition-colors text-[#2563eb] hover:text-[#1d4ed8]"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 