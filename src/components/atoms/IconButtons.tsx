import type { ReactNode } from "react";

interface IconButtonProps {
    icon: ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function IconButton({
    icon,
onClick,
className = "",
}: IconButtonProps) {
return (
    <button
    onClick={onClick}
    className={`flex items-center justify-center rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white hover:cursor-pointer${className}`}
    >
    {icon}
    </button>
);
}