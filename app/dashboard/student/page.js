"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudentDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect the student to their profile page
    router.replace("/dashboard/student/profile")
  }, [router])

  return null
}
