"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Database, Users, GraduationCap, UserCheck, User, LogOut, Plus } from "lucide-react"

export default function AdminSidebar() {
  const [dataEntryExpanded, setDataEntryExpanded] = useState(true)
  const [profileExpanded, setProfileExpanded] = useState(false)
  const pathname = usePathname()

  const isActive = (path) => pathname.includes(path)

  return (
    <div className="w-80 bg-slate-800 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-4xl font-bold">PAMS</h1>
      </div>

      <nav className="flex-1 px-4">
        <div className="mb-4">
          <button
            onClick={() => setDataEntryExpanded(!dataEntryExpanded)}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5" />
              <span className="text-lg">Data Entry</span>
            </div>
            {dataEntryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {dataEntryExpanded && (
            <div className="ml-8 mt-2 space-y-1">
              <Link
                href="/dashboard/admin/student"
                className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-700 transition-colors ${
                  isActive("/student") && !pathname.includes("/list") ? "bg-slate-700" : ""
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </Link>
              <Link
                href="/dashboard/admin/faculty"
                className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-700 transition-colors ${
                  isActive("/faculty") && !pathname.includes("/list") ? "bg-slate-700" : ""
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty</span>
              </Link>
              <Link
                href="/dashboard/admin/pgc"
                className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-700 transition-colors ${
                  isActive("/pgc") && !pathname.includes("/list") ? "bg-slate-700" : ""
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add PGC Member</span>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Link
            href="/dashboard/admin/student/list"
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700 transition-colors ${
              pathname.includes("/student/list") ? "bg-slate-700" : ""
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-lg">View All Students</span>
          </Link>

          <Link
            href="/dashboard/admin/faculty/list"
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700 transition-colors ${
              pathname.includes("/faculty/list") ? "bg-slate-700" : ""
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-lg">View All Faculty</span>
          </Link>

          <Link
            href="/dashboard/admin/pgc/list"
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700 transition-colors ${
              pathname.includes("/pgc/list") ? "bg-slate-700" : ""
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-lg">View All PGC Members</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700 mb-2">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <Link
          href="/dashboard/admin/profile"
          className={`flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-700 transition-colors ${
            pathname.includes("/profile") ? "bg-slate-700" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </div>
          {profileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  )
}
