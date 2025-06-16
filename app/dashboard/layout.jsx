"use client"

// import { SidebarProvider } from "../components/ui/sidebar"
// import { StudentSidebar } from "../components/student-sidebar"
import { StudentSidebar } from "@/components/student-sidebar"
export default function StudentDashboardLayout({ children }) {
  return (
    // <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1 bg-slate-50">{children}</main>
      </div>
    // </SidebarProvider>
  )
}
