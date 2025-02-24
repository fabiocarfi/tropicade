"use client";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { signUpDefaultValues } from "@/lib/constants";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SignInCard = ({
  onAuthDialog,
  onAuthStateChange,
}: {
  onAuthDialog: Dispatch<SetStateAction<boolean>>;
  onAuthStateChange: (a: string) => void;
}) => {
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      setFormError("");
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const values = Object.fromEntries(formData.entries());
      const data = {
        email: values.email as string,
        password: values.password as string,
      };
      const res = await signInWithCredentials(data);

      if (res && res.success) {
        await update();
        onAuthDialog(false);
      } else if (res && !res.success) {
        setFormError(res.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-center text-xl font-medium text-black">Sign In</h2>
        <div className="text-center">Please sign in to continue</div>
      </div>
      <div className="space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="capitalize mb-2 inline-block">
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
              <Button disabled={isPending} className="w-full" variant="default">
                {isPending ? "Submitting..." : "Sign In"}
              </Button>
            </div>

            {formError && (
              <div className="text-center text-destructive">{formError}</div>
            )}
          </div>
        </form>
        <div className="text-sm text-center text-muted-foreground flex gap-2 items-center justify-center">
          Don&apos;t have an account?
          <button onClick={() => onAuthStateChange("SIGNUP")}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};
export default SignInCard;
