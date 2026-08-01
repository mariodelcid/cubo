import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4 py-12">
          <p className="text-sm text-gray-500">Loading sign in...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
