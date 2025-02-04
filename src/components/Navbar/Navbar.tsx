import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Link from "next/link";
import Logo from "./Logo";
import { Button } from "../ui/button";

const Navbar = () => {
  type NavlinkType = {
    title: string;
    slug: string;
    href: string;
  };

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
    <nav className="py-10">
      <MaxWidthWrapper>
        <div className="flex justify-between align-middle">
          <Link href={"/"}>
            <Logo fill="#283841" />
          </Link>
          <div className="hidden lg:flex gap-12 font-[15px] items-center justify-center">
            {navlinks.map((navlink) => (
              <Link href={navlink.href} key={navlink.slug} className="">
                {navlink.title}
              </Link>
            ))}
          </div>
          <Button>Confirm Design</Button>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
