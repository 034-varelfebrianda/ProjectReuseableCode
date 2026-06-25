import type { LucideIcon } from "lucide-react";

type ComponentIconProps = {
    icon: LucideIcon;
};

export default function ComponentIcon({
    icon: Icon,
}: ComponentIconProps) {
    return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100">
        <Icon className="h-6 w-6 text-sky-500" strokeWidth={2} />
    </div>
);
}