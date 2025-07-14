"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudentDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      router.replace("/dashboard/student/profile")
    } else {
      router.replace("/")  // Redirect to login if not authenticated
    }
  }, [router])

  return null
}
