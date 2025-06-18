"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, FileText, Users, BookText } from "lucide-react"

export default function StudentSidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Profile", href: "/dashboard/student/profile", icon: <Users size={18} /> },
    { name: "Courses", href: "/dashboard/student/courses", icon: <BookText size={18} /> },
    { name: "Thesis", href: "/dashboard/student/thesis", icon: <FileText size={18} /> },
    { name: "Supervisor", href: "/dashboard/student/supervisor", icon: <GraduationCap size={18} /> },
  ]

  return (
    <aside className="bg-gray-800 text-white min-h-screen w-56 p-4">
      <h2 className="text-2xl font-bold mb-8">PAMS</h2>
      <nav className="flex flex-col space-y-2">
        {links.map(({ name, href, icon }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition ${
              pathname.startsWith(href) ? "bg-gray-700" : ""
            }`}
          >
            {icon}
            <span>{name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
