    import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
    import IconData from "../atoms/IconData";

export default function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-4 text-sm text-zinc-500">
      <p>Page 1 of 30000 (300,000 items)</p>

      <div className="flex items-center gap-2">
        <IconData className="cursor-pointer hover:text-[#09090B]">
          <ChevronLeft size={16} />
        </IconData>

        <button className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500 text-white">
          1
        </button>
        <button className="px-2 text-zinc-700">2</button>
        <button className="px-2 text-zinc-700">3</button>
        <button className="px-2 text-zinc-700">4</button>
        <button className="px-2 text-zinc-700">5</button>
        <span className="px-1 text-zinc-400">...</span>
        <button className="px-2 text-zinc-700">30000</button>

        <IconData className="cursor-pointer hover:text-[#09090B]">
          <ChevronRight size={16} />
        </IconData>
      </div>

      <div className="flex items-center gap-2">
        <span>Page size:</span>
        <div className="flex h-9 w-16 items-center justify-end rounded-md border pr-2 border-zinc-200 bg-white text-zinc-400">
          <ChevronDown size={16} className="cursor-pointer hover:text-[#09090B]"/>
        </div>
      </div>
    </div>
  );
}