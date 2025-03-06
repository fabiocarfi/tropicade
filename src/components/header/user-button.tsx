import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.action";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const UserButton = () => {
  const { data } = useSession();

  const firstInitial = data?.user?.name?.charAt(0).toUpperCase() ?? "U";
  const email = data?.user?.email?.split("@")[0] || "hellopakistan2134";
  const emailDomain = data?.user?.email?.split("@")[1] || "example.com";

  return (
    <div className=" gap-2 hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relativee w-12 h-12 rounded-full ml-2 flex items-center justify-center bg-gray-100 border-solid border-[1px] border-gray-300"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-54 p-2" align="end" forceMount>
          {data?.user && (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="text-sm font-medium leading-none">
                    {data?.user?.name}
                  </div>
                  <div className="text-sm text-muted-foreground leading-none">
                    {email?.length < 8
                      ? email
                      : email?.slice(0, 8).concat("...", "@", emailDomain)}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          {data?.user ? (
            <DropdownMenuItem className="p-0 mb-1">
              <Button
                className="w-full py-2 px-2"
                variant="ghost"
                onClick={() => signOutUser()}
              >
                Sign Out
              </Button>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="p-0 mb-1">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full py-2 px-2"
                )}
              >
                Sign in
              </Link>
            </DropdownMenuItem>
          )}

          {!data?.user && (
            <DropdownMenuItem className="p-0 mb-1">
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full py-2 px-2"
                )}
              >
                Register
              </Link>
            </DropdownMenuItem>
          )}

          {data?.user?.role === "admin" && (
            <DropdownMenuItem className="p-0 mb-1">
              <Link
                href="/admin"
                className={buttonVariants({ variant: "ghost" })}
              >
                Admin
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
