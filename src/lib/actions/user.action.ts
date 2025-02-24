"use server";
import { signIn } from "@/auth";
import prisma from "@/db";
import { signInFormSchema, signUpFormSchema } from "@/lib/validators";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { SignInForm, SignUpForm } from "@/types";

export async function signInWithCredentials(formData: SignInForm) {
  try {
    const validatedData = signInFormSchema.parse(formData);

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function signUpUser(formData: SignUpForm) {
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
      redirect: false,
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

// export async function signUpUser(prevState: unknown, formData: FormData) {
//   try {
//     const user = signUpFormSchema.parse({
//       name: formData.get("name"),
//       email: formData.get("email"),
//       password: formData.get("password"),
//     });

//     const plainPassword = user.password;
//     user.password = hashSync(user.password, 10);
//     await prisma.user.create({
//       data: {
//         name: user.name,
//         email: user.email,
//         password: user.password,
//       },
//     });

//     await signIn("credentials", {
//       email: user.email,
//       password: plainPassword,
//     });

//     return { success: true, message: "User created successfully" };
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error;
//     }
//     return {
//       success: false,
//       message: formatError(error),
//     };
//   }
// }
