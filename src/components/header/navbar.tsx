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
import { Button, buttonVariants } from "../ui/button";
import { NAVLINKS } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { signOutUser } from "@/lib/actions/user.action";
import UserButton from "./user-button";
import { cn } from "@/lib/utils";

const Navbar = ({
  onOpenModel,
}: {
  openModel: boolean;
  onOpenModel: (value: SetStateAction<boolean>) => void;
}) => {
  const { data } = useSession();

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
            {NAVLINKS.map((navlink) => (
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
                      {NAVLINKS.map((navlink) => (
                        <Link
                          href={navlink.href}
                          key={navlink.slug}
                          className="text-primary"
                        >
                          {navlink.title}
                        </Link>
                      ))}
                    </div>
                    <div className="w-full h-[1px] bg-gray-100  mb-4"></div>
                    <div className=" gap-2 flex flex-col lg:hidden">
                      {data?.user && (
                        <>
                          <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium leading-none">
                              {data?.user?.name}
                            </div>
                            <div className="text-sm text-muted-foreground leading-none">
                              {data?.user?.email}
                            </div>
                          </div>
                        </>
                      )}

                      {data?.user ? (
                        <Button
                          className="w-full py-2 px-2"
                          variant="ghost"
                          onClick={() => signOutUser()}
                        >
                          Sign Out
                        </Button>
                      ) : (
                        <Link
                          href="/sign-in"
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full py-2 px-2"
                          )}
                        >
                          Sign in
                        </Link>
                      )}

                      {!data?.user && (
                        <Link
                          href="/sign-up"
                          className={cn(
                            buttonVariants({ variant: "default" }),
                            "w-full py-2 px-2"
                          )}
                        >
                          Register
                        </Link>
                      )}

                      {data?.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className={buttonVariants({ variant: "ghost" })}
                        >
                          Admin
                        </Link>
                      )}
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex gap-4  items-center justify-between">
            {/* <div className=" flex gap-4">
              {status === "authenticated" ? (
                <Button variant={"outline"} onClick={() => signOutUser()}>
                  Sign out
                </Button>
              ) : (
                <Link
                  href={"/sign-in"}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Sign In
                </Link>
              )}

              {status !== "authenticated" && (
                <Link
                  href={"/sign-up"}
                  className={buttonVariants({ variant: "default" })}
                >
                  Register
                </Link>
              )}
            </div> */}

            <button
              className="hidden lg:block w-full py-4 min-h-[52px] bg-[#B6F074]  px-8 rounded-full"
              onClick={() => onOpenModel(true)}
            >
              <div className="flex items-center justify-center gap-2">
                Confirm Design
              </div>
            </button>
            <UserButton />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
