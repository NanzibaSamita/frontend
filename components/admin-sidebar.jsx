"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, Database } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Profile", href: "/dashboard/admin", icon: <Users size={18} /> },  // Home link should lead to the profile
    { name: "Add Student", href: "/dashboard/admin/student/register", icon: <Database size={18} /> },
    { name: "Add Faculty", href: "/dashboard/admin/faculty/register", icon: <Database size={18} /> },
    { name: "Add PGC Member", href: "/dashboard/admin/pgc/register", icon: <Database size={18} /> },
    { name: "View Students", href: "/dashboard/admin/student/list", icon: <FileText size={18} /> },
    { name: "View Faculties", href: "/dashboard/admin/faculty/list", icon: <FileText size={18} /> },
    { name: "View PGC", href: "/dashboard/admin/pgc/list", icon: <FileText size={18} /> },
  ];

  return (
    <aside className="bg-gray-800 text-white min-h-screen w-56 p-4">
      <h2 className="text-2xl font-bold mb-8">PAMS Admin</h2>
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
  );
}
