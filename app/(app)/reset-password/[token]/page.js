"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token: resetToken } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [checking, setChecking] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check token expiry on mount
  useEffect(() => {
    try {
      if (!resetToken) {
        setIsExpired(true);
        setErrorMsg("Invalid link.");
        return;
      }

      const decoded = jwtDecode(resetToken);
      // exp is in seconds; Date.now() is ms
      const expMs = (decoded?.exp ?? 0) * 1000;

      if (!decoded?.exp || Date.now() >= expMs) {
        setIsExpired(true);
        setErrorMsg("This reset link has expired.");
      } else {
        setIsExpired(false);
      }
    } catch {
      // If token can't be decoded, treat as invalid/expired.
      setIsExpired(true);
      setErrorMsg("This reset link is invalid or has expired.");
    } finally {
      setChecking(false);
    }
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isExpired) return; // hard block just in case

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/reset-password/${resetToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      // If the server says expired, reflect that too.
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Password changed successfully!");
        router.push("/");
      } else {
        // If backend returns “expired”, switch UI state
        if (
          (data?.message || "").toLowerCase().includes("expired") ||
          response.status === 410
        ) {
          setIsExpired(true);
          setErrorMsg("This reset link has expired.");
        }
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      alert("An error occurred, please try again!");
      console.error("Error resetting password", error);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="text-gray-700">Checking link…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-start px-4 pt-10 md:pt-16 space-y-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col items-center space-y-4">
        <div className="w-full flex justify-between items-center px-4">
          <div className="w-[100px] md:w-[140px]">
            <Image src="/iut-left.png" alt="IUT Left Logo" width={140} height={140} />
          </div>
          <h1 className="text-xl md:text-4xl font-extrabold text-center flex-1 text-gray-800 leading-tight">
            Postgraduate Academic <br /> Management System
          </h1>
          <div className="w-[100px] md:w-[140px]">
            <Image src="/iut-right.png" alt="IUT Right Logo" width={140} height={140} />
          </div>
        </div>
      </div>

      {/* Expired state */}
      {isExpired ? (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Link Expired</h2>
          <p className="text-gray-700 mb-6">
            {errorMsg || "This password reset link has expired. Please request a new one."}
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
          >
            Request New Link
          </button>
        </div>
      ) : (
        // Valid token → show form
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-5 mt-[-40px] md:mt-[-60px]"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">Change Password</h2>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="accent-green-600"
            />
            <span>Show Password</span>
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}
