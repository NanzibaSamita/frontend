<<<<<<< HEAD
import "./global.css";

export const metadata = {
  title: "PAMS",
  description: "Postgraduate Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
=======
import PgcLayout from "@/components/pgc/layout/PgcLayout";
import "./globals.css";
export const metadata = { title: "PAMS • PGC" };

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <PgcLayout>{children}</PgcLayout>
      </body>
>>>>>>> 7804120966a7f994b0787f831a4c5e5b0edb70a1
    </html>
  );
}
