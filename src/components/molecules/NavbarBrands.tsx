import { PanelLeftClose } from "lucide-react";
import Logo from "../atoms/LogoBrand";
import IconButton from "../atoms/IconButtons";


export default function NavbarBrand() {
    return (
    <div className="flex items-center justify-start gap-4">
        <IconButton icon={<PanelLeftClose size={18} />} />
        <div>
            <Logo/>
        </div>
        <div className="h-5 w-px bg-zinc-700" />
            <span className="hidden text-sm text-slate-400 sm:block">
        Components
        </span>
    </div>
)
}

