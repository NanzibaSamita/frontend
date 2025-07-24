"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

// Helper to decode JWT and extract role
const getUserRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded?.role || null;
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
};

export default function AdminAuth({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    const role = getUserRoleFromToken();

    // Redirect to correct dashboard
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
        router.push("/dashboard/pgc"); // adjust if CASR has own route
        break;
      default:
        router.push("/");
    }
  }, [router]);

  return <>{children}</>; // since we're redirecting, nothing is rendered
}
