"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HARDCODED_USERNAME = "admin";
const HARDCODED_PASSWORD = "password123";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      // Store login state (for demo, use localStorage)
      localStorage.setItem("isLoggedIn", "true");
      router.push("/app");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center gradient-text-animate">Login to My Jurist</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-200">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-200">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 