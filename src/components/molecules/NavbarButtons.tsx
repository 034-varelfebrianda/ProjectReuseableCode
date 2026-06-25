import { Moon, Search, Bell, ChevronDown,} from "lucide-react";
import IconButton from "../atoms/IconButtons";
import Avatar from "../atoms/AvatarProfile";

export default function NavbarActions() {
  return (
    <div className="flex items-center justify-end gap-3">
      <IconButton icon={<Moon size={18} />} />
      <IconButton icon={<Search size={18} />} />
      <IconButton icon={<Bell size={18} />} />
      <div className="h-5 w-px bg-zinc-700" />
      <button className="flex item-center gap-1 justify-end ">
      <Avatar initials="UM"/>
      <IconButton icon={<ChevronDown size={18}/>}/>
      </button>
    </div>
  );
}