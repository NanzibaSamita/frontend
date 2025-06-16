"use client"

import { User, FileText, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Profile",
    url: "/dashboard/student/profile",
    icon: User,
  },
  {
    title: "Thesis",
    url: "/dashboard/student/thesis",
    icon: FileText,
  },
  {
    title: "Supervisor",
    url: "/dashboard/student/supervisor",
    icon: Users,
  },
  {
    title: "Courses",
    url: "/dashboard/student/courses",
    icon: BookOpen,
  },
]

export function StudentSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-slate-200" collapsible="icon">
      <SidebarHeader className="bg-slate-800 text-white p-6">
        <div className="text-2xl font-bold">PAMS</div>
      </SidebarHeader>
      <SidebarContent className="bg-slate-800 text-white">
        <SidebarMenu className="space-y-2 p-4">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="text-white hover:bg-slate-700 data-[active=true]:bg-slate-700"
              >
                <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
