"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/actions/user.action";
import { useState, useTransition } from "react";

export default function ResetPasswordRequest() {
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    startTransition(async () => {
      setFormError("");
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const values = Object.fromEntries(formData.entries());
      const data = {
        email: values.email as string,
      };
      const res = await requestPasswordReset(data.email);
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
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="capitalize mb-2 inline-block"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <Button
                      disabled={isPending}
                      className="w-full"
                      variant="default"
                    >
                      {isPending ? "Sending..." : "Send Reset Link"}
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
