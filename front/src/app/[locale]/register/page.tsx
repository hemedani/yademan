// Purpose: User registration page with signup form and redirect logic

import { Suspense } from "react";
import RegisterForm from "../../../components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Register - Yademan",
  description: "Create your Yademan account",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  // Redirect if already authenticated
  if (user) {
    redirect("/");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to start exploring amazing places"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
