// app/dashboard/student/layout.jsx
import "./global.css"               // Global styles
import Layout from "@/components/Layout"
import AdminLayout from "@/components/AdminLayout"
export default function StudentLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  )
}
