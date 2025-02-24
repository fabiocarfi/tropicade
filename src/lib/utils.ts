import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//
// export function formatError(error: unknown): string {
//   if (error instanceof ZodError) {
//     return error.errors
//       .map((e) => ("message" in e ? e.message : JSON.stringify(e)))
//       .join(". ");
//   } else if (
//     error instanceof PrismaClientKnownRequestError &&
//     error.code === "P2002"
//   ) {
//     // Handle Prisma error
//     const target = error.meta?.target as string[] | undefined;
//     const field = target?.[0] ?? "Field";
//     return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
//   } else if (error instanceof Error) {
//     // Handle other errors
//     return error.message;
//   } else {
//     return "An unknown error occured";
//   }
// }
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}
