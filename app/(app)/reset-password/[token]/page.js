"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router"; // To get the token from URL

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState(null); // To store the reset token from URL
  const router = useRouter(); // For accessing the URL params

  useEffect(() => {
    // Extract the reset token from the URL
    const { token } = router.query;
    if (token) {
      setResetToken(token);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Password changed successfully!");
        router.push("/login"); // Redirect to login page after successful reset
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      alert("An error occurred, please try again!");
      console.error("Error resetting password", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-start px-4 pt-10 md:pt-16 space-y-10">
      <div className="w-full max-w-5xl flex flex-col items-center space-y-4">
        <div className="w-full flex justify-between items-center px-4">
          {/* Left Logo */}
          <div className="w-[100px] md:w-[140px]">
            <Image
              src="/iut-left.png"
              alt="IUT Left Logo"
              width={140}
              height={140}
              className="w-full h-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-4xl font-extrabold text-center flex-1 text-gray-800 leading-tight">
            Postgraduate Academic <br /> Management System
          </h1>

          {/* Right Logo */}
          <div className="w-[100px] md:w-[140px]">
            <Image
              src="/iut-right.png"
              alt="IUT Right Logo"
              width={140}
              height={140}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Change Password Form */}
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
    </div>
  );
}
