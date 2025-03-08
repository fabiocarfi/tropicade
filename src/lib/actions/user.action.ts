"use server";
import { auth, signIn, signOut } from "@/auth";
import prisma from "@/db";
import {
  resetPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/lib/validators";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { ResetPasswordForm, SignInForm, SignUpForm } from "@/types";
import { revalidatePath } from "next/cache";

export async function signInWithCredentials(
  formData: SignInForm,
  redirect = false,
  redirectUrl: string | undefined = undefined
) {
  try {
    const validatedData = signInFormSchema.parse(formData);

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: redirect,
      redirectTo: redirectUrl,
    });
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

export async function signUpUser(
  formData: SignUpForm,
  redirect = false,
  redirectUrl: string | undefined = undefined
) {
  try {
    const validatedData = signUpFormSchema.parse(formData);
    const plainPassword = validatedData.password;
    const hashedPassword = hashSync(validatedData.password, 10);
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: plainPassword,
      redirect: redirect,
      redirectTo: redirectUrl,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function signOutUser() {
  const res = await signOut({ redirectTo: "/sign-in" });
  if (res) {
    return { success: true, res: res };
  }
}

export async function updateUserRole(
  userId: string,
  newRole: "user" | "admin"
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can update roles.");
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    if (user) {
      revalidatePath("/admin/user");
      return { success: true, message: "User role udpated", res: user };
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return { error: "User not found" };
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000);

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    // await sendResetEmail(email, token);
    return { success: true, message: "Password reset link sent." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//reset password

export async function resetPassword(data: ResetPasswordForm) {
  const validatedData = resetPasswordFormSchema.parse(data);
  if (!validatedData) throw new Error("Invalid data");

  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token: data.token,
    },
  });

  if (!verificationToken || verificationToken.expires < new Date())
    throw new Error("Invalid or expired token");

  const user = await prisma.user.findFirst({
    where: { email: verificationToken.identifier },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const hashedPassword = await hashSync(data.password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: user.email,
        token: verificationToken.token,
      },
    },
  });

  return { success: true, message: "Password reset successfully" };
}
