// components/Layout.jsx
"use client"

import StudentSidebar from "@/components/student-sidebar"

export default function Layout({ children }) {
  return (
    <div className="flex max-h-screen">
      {/* Sidebar - visible on all dashboard pages */}
      <StudentSidebar />

      {/* Main content area */}
      <main className="flex-1 bg-[#f8faf9] p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
