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
  shirtColor: z.string().min(3, "Color is required"),
});
