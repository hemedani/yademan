// Purpose: User registration page with sign-up form and validation

import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Sign Up - Yademan",
  description: "Create your Yademan account",
};

export default async function SignupPage() {
  const user = await getCurrentUser();

  // Redirect if already authenticated
  if (user) {
    redirect("/");
  }

  return (
    <AuthLayout
      title="Join Yademan"
      subtitle="Create an account to save your favorite locations"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
