"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { SetStateAction } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Logo from "./logo";
import { MenuIcon } from "lucide-react";

type NavlinkType = {
  title: string;
  slug: string;
  href: string;
};

const Navbar = ({
  onOpenModel,
}: {
  openModel: boolean;
  onOpenModel: (value: SetStateAction<boolean>) => void;
}) => {
  const navlinks: NavlinkType[] = [
    {
      title: "Services",
      slug: "services",
      href: "/",
    },
    {
      title: "Experience",
      slug: "experience",
      href: "/",
    },
    {
      title: "Purchase",
      slug: "purchase",
      href: "/",
    },
    {
      title: "Configurate",
      slug: "configurate",
      href: "/",
    },
  ];

  return (
    <nav className="py-5 md:py-4">
      <MaxWidthWrapper>
        <div className="flex justify-between align-middle">
          <Link href={"/"} className="hidden xs:block">
            <Logo height="32" fill="#283841" />
          </Link>
          <Link href={"/"} className="block xs:hidden">
            <Logo height="28" fill="#283841" />
          </Link>
          <div className="hidden lg:flex gap-12 font-[15px] items-center justify-center">
            {navlinks.map((navlink) => (
              <Link href={navlink.href} key={navlink.slug} className="">
                {navlink.title}
              </Link>
            ))}
          </div>
          <div className="flex lg:hidden items-center justify-end w-full">
            <Sheet>
              <SheetTrigger>
                <MenuIcon className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                  <SheetDescription>
                    <div className="flex flex-col  gap-6 font-[15px] items-center justify-center py-8">
                      {navlinks.map((navlink) => (
                        <Link
                          href={navlink.href}
                          key={navlink.slug}
                          className="text-primary"
                        >
                          {navlink.title}
                        </Link>
                      ))}
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div>
            <button
              className="hidden lg:block w-full py-4 min-h-[52px] bg-[#B6F074]  px-8 rounded-full"
              onClick={() => onOpenModel(true)}
            >
              <div className="flex items-center justify-center gap-2">
                Confirm Design
              </div>
            </button>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
