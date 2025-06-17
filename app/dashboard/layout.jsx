import StudentSidebar from "@/components/student-sidebar"

export default function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 bg-[#f8faf9] p-6">{children}</main>
    </div>
  )
}
