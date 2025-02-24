"use server";
import prisma from "@/db";
import { addConfigurationSchema } from "@/lib/validators";
import { AddConfigurationType } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";

export async function addNewConfiguration(
  data: AddConfigurationType,
  userEmail: string | undefined
) {
  try {
    const configuration = addConfigurationSchema.parse({
      image: data.image,
      shirtSize: data.shirtSize,
      shirtColor: data.shirtColor,
    });

    if (!userEmail) throw new Error("Please provide user email");
    if (!configuration) throw new Error("Please provide valid data");

    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
      select: { id: true },
    });

    if (!user) throw new Error("User not found");

    const config = await prisma.config.upsert({
      where: {
        userId: user.id,
      },
      update: {
        image: configuration.image,
        shirtColor: configuration.shirtColor,
        shirtSize: configuration.shirtSize,
      },
      create: {
        userId: user.id,
        image: configuration.image,
        shirtColor: configuration.shirtColor,
        shirtSize: configuration.shirtSize,
      },
    });
    if (!config) throw new Error("Failed to create a config");
    return { success: true, message: "Configuration created successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function getConfiguration(email: string) {
  try {
    if (!email) throw new Error("Please provide an email");
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        name: true,
        email: true,
        config: true,
      },
    });
    if (!user) throw new Error("User not found");

    return { success: true, message: "User found", user: user };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
