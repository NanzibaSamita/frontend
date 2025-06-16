"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    alert(`Logging in as ${id}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* IUT Logo */}
      <Image
        src="/iut-logo.png" // 🔁 Make sure you add this logo to public/iut-logo.png
        alt="IUT Logo"
        width={180}
        height={180}
        className="mb-6"
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Sign In To SIS</h1>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white flex flex-col space-y-4"
      >
        <input
          type="text"
          placeholder="Student ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="px-4 py-2 bg-blue-50 border border-blue-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 bg-blue-50 border border-blue-100 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        {/* Remember me + Forgot password */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-blue-600"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link href="#" className="text-blue-600 hover:underline">
            Forgot Your Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
        >
          Sign In
        </button>
      </form>

      {/* Footer text */}
      <p className="mt-8 text-sm text-center text-blue-600">
        For any technical difficulties, send mail to{" "}
        <a href="mailto:ict.sis@iut-dhaka.edu" className="underline">
          ict.sis@iut-dhaka.edu
        </a>
      </p>
    </div>
  )
}
