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
        "h-full max-w-[1650px] mx-auto w-full px-4 md:px-100 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
