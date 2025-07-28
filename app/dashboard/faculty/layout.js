import "./globals.css";
import FacultyLayout from "@/components/faculty/layout/FacultyLayout";
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <FacultyLayout>{children}</FacultyLayout>
      </body>
    </html>
  );
}
