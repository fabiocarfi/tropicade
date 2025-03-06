"use client";

import { signOutUser } from "@/lib/actions/user.action";
import { Button } from "../ui/button";

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <Button variant={"outline"} onClick={handleSignOut}>
      Sign out
    </Button>
  );
};
export default SignOutButton;
