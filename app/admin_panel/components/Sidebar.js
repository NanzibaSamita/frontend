"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserIcon, DocumentTextIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline"

const navigation = [
  { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  { name: "Thesis", href: "/dashboard/thesis", icon: DocumentTextIcon },
  { name: "Supervisor", href: "/dashboard/supervisor", icon: UserGroupIcon },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpenIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-700">
        <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
          {/* PAMS Logo - Centered and Clickable */}
          <div className="flex items-center justify-center flex-shrink-0 px-6 mb-12">
            <Link href="/dashboard">
              <div className="bg-white rounded-lg px-4 py-2">
                <h1 className="text-gray-800 text-2xl font-bold">PAMS</h1>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-4 text-base font-medium rounded-lg transition-colors
                    ${isActive ? "bg-gray-600 text-white" : "text-gray-300 hover:bg-gray-600 hover:text-white"}
                  `}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
