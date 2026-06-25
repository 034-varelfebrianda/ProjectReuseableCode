import SearchIcon from "../atoms/SearchIcon";
import SearchText from "../atoms/SearchText";


export default function SidebarSearch() {
    return (
        <div className="border w-65 border-[#E4E4E7] bg-[#FFFFFF] p-3">
        <button className="flex h-10 w-56 items-center gap-2 rounded-md border border-[#E4E4E7] bg-[#FFFFFF] px-3 hover:shadow-2xl transition hover:cursor-text">
            <SearchIcon />
            <SearchText />
        </button>
        </div>
    );
}