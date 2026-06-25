import ListSidebar from "../atoms/ListSidebar";

export default function SidebarMenu(){
    return(
        <div>
            <div className="border w-65 border-r border-[#E4E4E7] bg-[#FFFFFF] p-4">
            <p className="font-bold">All Demos</p>
            <ListSidebar/>
            </div>
        </div>
    )
}