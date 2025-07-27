"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, Users, FileCheck, FileText, User, ChevronUp, LogOut } from "lucide-react"

export default function FacultySidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = [
    {
      name: "Course Content",
      href: "/dashboard/faculty/course",
      icon: <BookOpen size={18} />,
    },
    {
      name: "Supervision Requests",
      href: "/dashboard/faculty/supervision",
      icon: <Users size={18} />,
    },
    {
      name: "Thesis Proposal Approvals",
      href: "/dashboard/faculty/thesis-proposals",
      icon: <FileCheck size={18} />,
    },
    {
      name: "Thesis Approvals",
      href: "/dashboard/faculty/thesis-approvals",
      icon: <FileText size={18} />,
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <div className="w-80 bg-gray-900 text-white relative">
      {/* PAMS Header */}
      <div className="p-8 pt-12">
        <h1 className="text-4xl font-bold text-white">PAMS</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8 px-4">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-4 py-4 hover:bg-gray-800 cursor-pointer flex items-center text-white rounded mb-2 transition-colors ${
              pathname === item.href ? "bg-gray-800" : ""
            }`}
          >
            <span className="mr-4">{item.icon}</span>
            <span className="text-lg">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Profile Section at Bottom */}
      <div className="absolute bottom-16 left-4 right-4">
        <Link
          href="/dashboard/faculty/profile"
          className={`block px-4 py-3 cursor-pointer flex items-center text-white rounded transition-colors ${
            pathname === "/dashboard/faculty/profile" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <span className="mr-4">
            <User size={18} />
          </span>
          <span className="text-lg">Profile</span>
          <span className="ml-auto">
            <ChevronUp size={16} />
          </span>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-md hover:bg-red-600 transition bg-red-500 text-white font-semibold"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
