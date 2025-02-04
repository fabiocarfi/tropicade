import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const VerticalPaddingWrapper = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("py-16 md:py-20  lg:py-24", className)}>{children}</div>
  );
};

export default VerticalPaddingWrapper;
