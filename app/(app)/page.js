"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import LoginPage from "@/components/Login";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const role = decoded?.role;

      // Redirect based on role
      switch (role) {
        case "Admin":
          router.push("/dashboard/admin");
          break;
        case "Student":
          router.push("/dashboard/student");
          break;
        case "Faculty":
          router.push("/dashboard/faculty");
          break;
        case "PGC":
          router.push("/dashboard/pgc");
          break;
        case "CASR":
          router.push("/dashboard/pgc"); // update if CASR has own route
          break;
        default:
          localStorage.removeItem("token"); // Invalid role, logout
          break;
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token"); // Invalid token, remove it
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <LoginPage />
    </div>
  );
}
