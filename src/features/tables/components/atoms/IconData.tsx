import { ComponentPropsWithoutRef, ReactNode } from "react";

interface IconDataProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
}

export default function IconData({ children, ...props }: IconDataProps) {
  return (
    <button type="button" {...props} className={`flex items-center justify-center ${props.className ?? ""}`}>
      {children}
    </button>
  );
}
