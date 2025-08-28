import { redirect } from "next/navigation";

export default function PgcDashboardRedirect() {
  // Server component redirect (safe)
  redirect("/dashboard/pgc/profile");
}
