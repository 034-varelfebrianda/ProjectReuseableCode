import { ChangeEvent, useState } from "react";
import { ChevronDown, ChevronsUpDown, Funnel } from "lucide-react";

interface FilterBoxProps {
  attachmentBox?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showSort?: boolean;
  activeSort?: boolean;
  sortDirection?: "asc" | "desc";
  onSort?: (direction: "asc" | "desc") => void;
  sortAscLabel?: string;
  sortDescLabel?: string;
}

export default function FilterBox({
  attachmentBox = false,
  value,
  onChange,
  placeholder = "",
  showSort = false,
  activeSort = false,
  sortDirection = "asc",
  onSort,
  sortAscLabel = "A-Z",
  sortDescLabel = "Z-A",
}: FilterBoxProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [sortOpen, setSortOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    if (onChange) {
      onChange(nextValue);
    } else {
      setInternalValue(nextValue);
    }
  };

  return (
    <div className="flex h-9 items-center rounded-md border border-zinc-200 bg-white px-2">
      <input
        className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        value={onChange ? value ?? "" : internalValue}
        onChange={handleChange}
        placeholder={placeholder}
      />

      <div className="flex items-center gap-2">

        {attachmentBox && <div className="h-9 border-zinc-200" />}
        {attachmentBox && (
          <ChevronDown
            size={14}
            className="cursor-pointer hover:text-[#09090B] text-[#71717A]"
          />
        )}

        {showSort && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className={`flex items-center gap-1 rounded px-1 text-[#71717A] hover:text-[#09090B] ${
                activeSort ? "bg-zinc-100" : ""
              }`}
            >
              <ChevronsUpDown size={16} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-md border border-zinc-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSortOpen(false);
                    onSort?.("asc");
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                    activeSort && sortDirection === "asc" ? "text-sky-600" : "text-zinc-500"
                  } hover:bg-zinc-100`}
                >
                  <span>{sortAscLabel}</span>
                  {activeSort && sortDirection === "asc" && <span>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortOpen(false);
                    onSort?.("desc");
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                    activeSort && sortDirection === "desc" ? "text-sky-600" : "text-zinc-500"
                  } hover:bg-zinc-100`}
                >
                  <span>{sortDescLabel}</span>
                  {activeSort && sortDirection === "desc" && <span>✓</span>}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="border-l h-9 border-zinc-200" />
        <Funnel
          size={14}
          className="cursor-pointer text-[#71717A] hover:text-[#09090B]"
        />
      </div>
    </div>
  );
}
