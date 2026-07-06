import { ChangeEvent, useState } from "react";
import { ChevronDown, Funnel } from "lucide-react";

interface FilterBoxProps {
  attachmentBox?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function FilterBox({
  attachmentBox = false,
  value,
  onChange,
  placeholder = "",
}: FilterBoxProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");

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

        <div className="border-l h-9 border-zinc-200" />
        <Funnel
          size={14}
          className="cursor-pointer text-[#71717A] hover:text-[#09090B]"
        />
      </div>
    </div>
  );
}
