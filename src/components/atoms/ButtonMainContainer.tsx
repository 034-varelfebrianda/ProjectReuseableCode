import { MoveRight } from "lucide-react";

export default function ButtonMainContainer() {
  return (
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 rounded-lg border border-[#0EA5E9] bg-[#0EA5E9] px-5 py-3 text-[14px] font-medium text-white hover:bg-sky-500 hover:cursor-pointer transition">
        Browse Components
        <MoveRight size={16} />
      </button>

      <button className="rounded-lg border border-[#3F3F46] px-5 py-3 text-[14px] font-medium text-white hover:bg-zinc-800 hover:cursor-pointer transition">
        View Documentation
      </button>
    </div>
  );
}