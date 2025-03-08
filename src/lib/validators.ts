import z from "zod";
export const signInFormSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 6 characters"),
});

export const addConfigurationSchema = z.object({
  image: z.string().min(3, "Image url is required"),
  shirtSize: z.string().min(1, "Size is required"),
  shirtColor: z.string().min(1, "Color is required"),
});

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(3, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    token: z.string().min(1, "Token is required"),
  })
  .refine(
    (data) => data.password !== data.confirmPassword,
    "Password and Confirm password must match"
  );
