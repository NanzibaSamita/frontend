// app/dashboard/student/layout.jsx
import "./global.css"               // Global styles
import AdminLayout from "@/components/AdminLayout"
export default function AdminPageLayout({ children }) {
  return (
    <html lang="en">

      <body ><AdminLayout>{children}
        </AdminLayout></body>
    </html>
  )
}
