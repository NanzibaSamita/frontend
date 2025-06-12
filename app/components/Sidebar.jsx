"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  UserIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline"

const navigation = [
  { name: "Profile", href: "/student/profile", icon: UserIcon },
  { name: "Thesis", href: "/student/thesis", icon: DocumentTextIcon },
  { name: "Supervisor", href: "/student/supervisor", icon: UserGroupIcon },
  { name: "Courses", href: "/student/courses", icon: BookOpenIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gray-900 text-white">
      <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center justify-center px-6 mb-12">
          <Link href="/student">
            <div className="bg-white rounded-md px-4 py-2">
              <h1 className="text-gray-800 text-2xl font-bold tracking-wide">PAMS</h1>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
