"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { UserIcon, DocumentTextIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline"

const navigation = [
  { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  { name: "Thesis", href: "/dashboard/thesis", icon: DocumentTextIcon },
  { name: "Supervisor", href: "/dashboard/supervisor", icon: UserGroupIcon },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpenIcon },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <div className="bg-gray-700 px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <h1 className="text-white text-2xl font-bold">PAMS</h1>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-gray-300">
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="bg-gray-700 px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors
                  ${isActive ? "bg-gray-600 text-white" : "text-gray-300 hover:bg-gray-600 hover:text-white"}
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
