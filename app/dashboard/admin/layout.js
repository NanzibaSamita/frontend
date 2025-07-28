// app/dashboard/student/layout.jsx
import "./global.css"               // Global styles
import AdminLayout from "@/components/AdminLayout"
export default function AdminPageLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
