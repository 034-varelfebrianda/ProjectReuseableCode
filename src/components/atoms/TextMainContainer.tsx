import { Sparkles } from "lucide-react";

export default function TextMainContainer() {
  return (
    <div className="w-full max-w-3xl px-8 py-8 space-y-6">
      
      <div className="flex items-center p-1 px-3 rounded-3xl w-70 gap-2 bg-[#27272A]">
        <Sparkles size={18} className="text-[#0EA5E9]" />
        <p className="text-[#A1A1AA] text-[13px]">
          shadcn x DevExpress Component Library
        </p>
      </div>

      <div>
        <h1 className="font-extrabold text-[#FAFAFA] text-5xl leading-tight">
          Build enterprise interfaces faster.
        </h1>
      </div>

      <div>
        <p className="text-[#A1A1AA] text-[15px] leading-7">
          A complete design system with 27 production-ready components. From
          DataGrid to Charts — all built on shadcn/ui foundations with dark mode
          support.
        </p>
      </div>

<div className="flex items-center gap-8 pt-2">
  <div className="flex items-center gap-2">
    <p className="text-2xl font-bold text-[#FAFAFA]">27</p>
    <p className="text-[13px] text-[#71717A]">Components</p>
  </div>

  <div className="h-6 w-px bg-zinc-700" />

  <div className="flex items-center gap-2">
    <p className="text-2xl font-bold text-[#FAFAFA]">2</p>
    <p className="text-[13px] text-[#71717A]">Themes</p>
  </div>

  <div className="h-6 w-px bg-zinc-700" />

  <div className="flex items-center gap-2">
    <p className="text-2xl font-bold text-[#FAFAFA]">4</p>
    <p className="text-[13px] text-[#71717A]">Phases</p>
  </div>
</div>
    </div>
  );
}