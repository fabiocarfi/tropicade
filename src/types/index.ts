import {
  addConfigurationSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/lib/validators";
import { Canvas, FabricImage, FabricObject, Textbox } from "fabric";
import { z } from "zod";
import { DefaultSession } from "next-auth";

export type TshirtColorsType = {
  label: string;
  slug: string;
  value: string;
  imgUrl: string;
};

export type TshirtSizesType = {
  label: string;
  size: string;
};

export type ColorType = {
  id: string;
  options: {
    fill: string;
    stroke: string;
  };
};

export type FontStylesType = {
  id: string;
  options: {
    fontStyle: string;
    fontWeight: string;
    fontFamily: string;
  };
};

export type CustomTextBox = {
  styleId: string;
  colorId: string;
} & Textbox;

export interface CustomCanvas extends Canvas {
  updateZIndices?: () => void;
}

export type Layer = {
  id?: string;
  zIndex?: number;
  type?: string | undefined;
  thumbnailUrl?: string;
};

export interface CustomFabricObject extends FabricObject {
  id?: string;
  zIndex?: number;
  imgUrl?: string;
  styleId?: string;
  colorId?: string;
}

export class FabricImageWithImgUrl extends FabricImage {
  imgUrl?: string;
}

export type AddConfigurationType = z.infer<typeof addConfigurationSchema>;
export type SignInForm = z.infer<typeof signInFormSchema>;
export type SignUpForm = z.infer<typeof signUpFormSchema>;
export type NavLink = {
  title: string;
  slug: string;
  href: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}
