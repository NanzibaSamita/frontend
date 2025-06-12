"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/Sidebar"
import MobileNav from "../components/MobileNav"

export default function DashboardLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden md:ml-80">
        <MobileNav />
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
