import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-[1650px] px-4 md:px-16",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
