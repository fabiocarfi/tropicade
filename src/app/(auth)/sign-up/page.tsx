import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignUpForm from "./sign-up-form";

const SignUpPage = async () => {
  const session = await auth();
  if (session) redirect("/");

  return <SignUpForm />;
};
export default SignUpPage;
