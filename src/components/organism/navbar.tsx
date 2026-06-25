import NavbarBrand from "../molecules/NavbarBrands";
import NavbarActions from "../molecules/NavbarButtons";


export default function Navbar() {
  return (
    <div className="flex items-center bg-[#09090b] py-3 px-3 justify-between ">
      <NavbarBrand/>
      <NavbarActions/>
    </div>
  )
}
