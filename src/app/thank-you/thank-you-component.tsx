"use client";
import { buttonVariants } from "@/components/ui/button";
import { getConfiguration } from "@/lib/actions/configuration.actions";
import { TSHIRT_COLORS } from "@/lib/constants";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserData = {
  image: string;
  shirtSize: string;
  shirtColor: string;
};

const ThankYouComponent = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") router.push("/");
  const [userData, setUserData] = useState<UserData | null>();
  useEffect(() => {
    (async function () {
      const res = await getConfiguration(session?.user?.email || "");
      const config = res.user?.config;
      if (config) {
        const { image, shirtSize, shirtColor } = config;
        const color =
          TSHIRT_COLORS.filter((x) => x.label === shirtColor) ||
          "/tshirts/white.png";
        setUserData({
          image,
          shirtSize,
          shirtColor: color[0].imgUrl,
        });
      }
    })();
  }, [session]);

  return (
    <section className="min-h-[100vh] min-w-[100vw] flex items-center justify-center">
      <div className="p-6 md:p-10 rounded-lg shadow-lg bg-white flex flex-col gap-4 text-center">
        <div className="flex items-center justify-center relative">
          {userData && userData.image && userData.shirtColor ? (
            <div className="relative flex items-top justify-center">
              <Image
                src={userData?.shirtColor}
                height={370}
                width={330}
                alt="Your design"
                className="h-[225px] md:h-[370px] w-auto object-contain"
              />
              <Image
                src={userData?.image}
                height={170}
                width={370}
                alt="Your design"
                className="absolute z-50 w-auto h-[120px] md:h-[170px] top-[50px]  md:top-[75px] object-contain"
              />
            </div>
          ) : (
            <Loader className="animate-spin" />
          )}
        </div>
        <h1 className="text-xl md:text-2xl font-medium">
          Thanks for submitting!
        </h1>
        <p className="max-w-[350px] text-center">
          We have received your design. We will review it and get back to you
          soon.
        </p>
        <div className="flex-center">
          <Link href={"/"} className={buttonVariants({ variant: "default" })}>
            submit New Design
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ThankYouComponent;
