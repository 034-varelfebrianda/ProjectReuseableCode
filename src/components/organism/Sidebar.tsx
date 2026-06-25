import SidebarMenu from "../molecules/SidebarMenu";
import SidebarSearch from "../molecules/SidebarSearch";
import FooterMenu from "../molecules/FooterMenu";

export default function Sidebar() {
return (
    <aside>
    <SidebarSearch/>
    <SidebarMenu/>
    <FooterMenu/>
        </aside>
);
}
