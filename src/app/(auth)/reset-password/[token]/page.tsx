"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { resetPassword } from "@/lib/actions/user.action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleResetPassword = async (e: React.FormEvent) => {
    startTransition(async () => {
      setFormError("");
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const values = Object.fromEntries(formData.entries());
      const data = {
        password: values.password as string,
        confirmPassword: values.confirmPassword as string,
      };
      const res = await resetPassword(token || "", data);
      if (res && !res.success) {
        setFormError(res.message);
      }
    });
  };

  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-center min-h-screen py-4">
        <div className="p-4 md:p-6 shadow-lg max-w-[450px] w-full bg-white border-gray-200 rounded-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-center text-xl font-medium text-black">
                Reset password
              </h2>
              <div className="text-center">Please enter a new password</div>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleResetPassword}>
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="password"
                      className="capitalize mb-2 inline-block"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="capitalize mb-2 inline-block"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      autoComplete="confirmPassword"
                    />
                  </div>
                  <div>
                    <Button
                      disabled={isPending}
                      className="w-full"
                      variant="default"
                    >
                      {isPending ? "Reseting..." : "Reset"}
                    </Button>
                  </div>

                  {formError && (
                    <div className="text-center text-destructive">
                      {formError}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
