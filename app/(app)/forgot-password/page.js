"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json();

      console.log("Response from forgot-password:", data); // ✅ Debug log

      if (response.ok) {
        alert(data.message || "Password reset instructions sent to your email!");
      } else {
        alert(data.message || "Something went wrong while requesting password reset.");
      }
    } catch (error) {
      console.error("Frontend fetch error:", error);
      alert("An error occurred while sending the request. Check the console for details.");
    }
  };

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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-5 mt-[-40px] md:mt-[-60px]"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Forgot Password?</h2>

        <div className="space-y-1">
          <label className="block text-sm text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
        >
          Send Reset Link
        </button>
      </form>

      <div className="mt-6">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-green-600 flex items-center justify-center space-x-2"
        >
          <span>&larr;</span>
          <span>Back to log in</span>
        </Link>
      </div>
    </div>
  );
}
