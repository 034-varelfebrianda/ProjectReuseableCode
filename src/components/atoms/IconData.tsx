import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function IconData({
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}