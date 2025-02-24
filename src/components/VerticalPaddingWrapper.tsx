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
    <div className={cn("py-10 md:py-14  lg:py-16", className)}>{children}</div>
  );
};

export default VerticalPaddingWrapper;
