import PgcLayout from "@/components/pgc/layout/PgcLayout";
import "./globals.css";
export const metadata = { title: "PAMS • PGC" };

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <PgcLayout>{children}</PgcLayout>
      </body>
    </html>
  );
}
