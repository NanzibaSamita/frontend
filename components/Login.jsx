"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("") // ✅ for inline error message

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("") // reset error

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      })

      const token = response.data.token
      localStorage.setItem("token", token)

      // Decode role
      const decoded = jwtDecode(token)
      const role = decoded?.role

      if (role === "Admin") {
        router.push("/dashboard/admin/profile")
      } else if (role === "Student") {
        router.push("/dashboard/student/profile")
      } else if (role === "Faculty") {
        router.push("/dashboard/faculty/profile")
      } else if (role === "PGC" || role === "CASR") {
        router.push("/dashboard/pgc/profile")
      } else {
        router.push("/")
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed"
      setError(errorMsg) // ✅ show error inline
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      {/* Header with logos */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-4 py-6">
        <Image
          src="/iut-left.png"
          alt="IUT Left Logo"
          width={140}
          height={140}
          className="w-[90px] md:w-[140px] h-auto"
        />

        <h1 className="text-base md:text-3xl font-extrabold text-gray-800 text-center leading-tight">
          Postgraduate Academic <br /> Management System
        </h1>

        <Image
          src="/iut-right.png"
          alt="IUT Right Logo"
          width={140}
          height={140}
          className="w-[90px] md:w-[140px] h-auto"
        />
      </div>

      {/* Form centered in remaining space */}
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-5"
        >
          <h2 className="text-center text-2xl font-semibold text-gray-800">
            Login
          </h2>

          {/* ✅ Inline error message */}
          {error && (
            <div className="text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <label className="flex items-center text-sm space-x-2 text-gray-600">
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
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
          >
            Log in
          </button>

          <button
            type="button"
            className="w-full text-sm text-blue-600 hover:underline mt-2"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  )
}