"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ⬅️ Make sure this is installed: `npm install jwt-decode`

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      // Save token
      localStorage.setItem("token", token);

      // Decode token to get user role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      alert("Login successful!");

      // Redirect based on role
      if (role === "Student") {
        router.push("/dashboard/student/profile");
      } else if (role === "Admin") {
        router.push("/dashboard/admin");
      } else if (role === "Faculty") {
        router.push("/dashboard/faculty");
      } else if (role === "PGC") {
        router.push("/dashboard/pgc");
      } else if (role === "CASR") {
        router.push("/dashboard/casr");
      } else {
        alert("Unknown role. Please contact support.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col items-center justify-start px-4 pt-10 md:pt-16 space-y-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col items-center space-y-4">
        <div className="w-full flex justify-between items-center px-4">
          <div className="w-[100px] md:w-[140px]">
            <Image
              src="/iut-left.png"
              alt="IUT Left Logo"
              width={140}
              height={140}
              className="w-full h-auto"
            />
          </div>

          <h1 className="text-xl md:text-4xl font-extrabold text-center flex-1 text-gray-800 leading-tight">
            Postgraduate Academic <br /> Management System
          </h1>

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

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-md border border-gray-300 space-y-5 mt-[-40px] md:mt-[-60px]"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Login
        </h2>

        <div className="space-y-1">
          <label className="block text-sm text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
        </div>

        <label className="flex items-center text-sm text-gray-600 space-x-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="accent-green-600"
          />
          <span>Remember me</span>
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-sm font-semibold"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
