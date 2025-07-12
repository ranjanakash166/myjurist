"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, FileText, FileSearch } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <Home className="w-5 h-5 mr-2" />, key: "dashboard", path: "/dashboard" },
  { label: "Patent Analysis", icon: <FileSearch className="w-5 h-5 mr-2" />, key: "patent", path: "/dashboard/patent" },
  { label: "Document Analysis", icon: <FileText className="w-5 h-5 mr-2" />, key: "document", path: "/dashboard/document" },
];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("dashboard");

  // Route protection
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("isLoggedIn") !== "true") {
      router.replace("/login");
    }
  }, [router]);

  // Set active section based on URL
  useEffect(() => {
    if (pathname.endsWith("/patent")) setActive("patent");
    else if (pathname.endsWith("/document")) setActive("document");
    else setActive("dashboard");
  }, [pathname]);

  const handleNav = (item: typeof navItems[0]) => {
    setActive(item.key);
    router.push(item.path);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 p-6 flex flex-col gap-4 glass-effect border-r border-ai-blue-500/20 min-h-screen">
        <div className="flex items-center mb-8">
          <span className="text-2xl font-bold gradient-text-animate">My Jurist</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item)}
              className={`flex items-center px-4 py-2 rounded-lg text-left font-medium transition-all duration-300 hover:scale-105 hover:bg-ai-blue-500/10 focus:outline-none ${
                active === item.key
                  ? "bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white shadow-lg ai-shadow"
                  : "text-slate-300 hover:text-ai-blue-400"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        {active === "dashboard" && (
          <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 gradient-text-animate">Dashboard</h2>
            <p className="text-slate-300">Welcome to your dashboard! (UI as per your requirements will go here.)</p>
          </div>
        )}
        {active === "patent" && (
          <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 gradient-text-animate">Patent Analysis</h2>
            <p className="text-slate-300">Patent Analysis content coming soon.</p>
          </div>
        )}
        {active === "document" && (
          <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 gradient-text-animate">Document Analysis</h2>
            <p className="text-slate-300">Document Analysis content coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
} 