import { ComponentPropsWithoutRef, ReactNode } from "react";

interface IconDataProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
}

export default function IconData({ children, ...props }: IconDataProps) {
  return (
    <button
      type="button"
      {...props}
      className={`icon-button ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
