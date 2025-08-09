// Purpose: User login page with authentication form and redirect logic

import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Login - Yademan",
  description: "Sign in to your Yademan account",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  // Redirect if already authenticated
  if (user) {
    redirect("/");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
