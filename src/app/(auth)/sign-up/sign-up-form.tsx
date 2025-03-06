"use client";
import { signUpUser } from "@/lib/actions/user.action";
import { signUpDefaultValues } from "@/lib/constants";
import { FormEvent, useState, useTransition } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const SignUpForm = () => {
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      setFormError("");
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const values = Object.fromEntries(formData.entries());
      const data = {
        name: values.name as string,
        email: values.email as string,
        password: values.password as string,
      };
      const res = await signUpUser(data, true, "/");

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
                Sign Up
              </h2>
              <div className="text-center">Please sign up to continue</div>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="capitalize mb-2 inline-block"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      defaultValue={signUpDefaultValues.name}
                    />
                  </div>
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
                      type="text"
                      autoComplete="email"
                      defaultValue={signUpDefaultValues.email}
                    />
                  </div>
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
                      required
                      autoComplete="password"
                      defaultValue={signUpDefaultValues.password}
                    />
                  </div>
                  <div>
                    <Button
                      disabled={isPending}
                      className="w-full"
                      variant="default"
                    >
                      {isPending ? "Submitting..." : "Sign Up"}
                    </Button>
                  </div>

                  {formError && (
                    <div className="text-center text-destructive">
                      {formError}
                    </div>
                  )}
                  <div className="text-sm text-center text-muted-foreground flex gap-2 items-center justify-center">
                    Already have an account?
                    <Link href="/sign-in">Sign In</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
export default SignUpForm;
