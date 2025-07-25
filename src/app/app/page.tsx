"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/dashboard");
  }, [router]);
  return null;
} 