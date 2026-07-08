import { Settings2 } from "lucide-react";

interface GridTopBarProps {
  title?: string;
}

export default function GridTopBar({ title = "Large DataBase (Server Mode)" }: GridTopBarProps) {
  return (
    <div className="flex justify-between pb-5">
      <p className="font-bold justify-start text-[24px] ">{title}</p>

      <div className="flex border cursor-pointer gap-2 items-center px-2 bg-[#FFFFFF] border-zinc-300 rounded-md">
        <Settings2 className="size-4" />
        <p className="text-[#09090B]">Change Theme Settings</p>
      </div>
    </div>
  );
}