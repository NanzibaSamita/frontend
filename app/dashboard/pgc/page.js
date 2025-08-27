import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect root to PGC profile page
  redirect("/dashboard/pgc/supervisor-request");
}
