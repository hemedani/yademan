import { redirect } from "next/navigation";

export default function RootPage() {
  // Immediately redirect to Persian locale at server-side
  redirect("/fa");
}
