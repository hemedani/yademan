import { redirect } from "next/navigation";

export default function AdminDashboardPage() {
  // Redirect to the main admin page since that's where the dashboard content is
  redirect("/admin");
}
