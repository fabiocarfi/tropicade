import { redirect } from "next/navigation";
import SignInForm from "./sign-in-form";
import { auth } from "@/auth";

const SignInPage = async () => {
  const session = await auth();
  if (session) redirect("/");

  return <SignInForm />;
};
export default SignInPage;
