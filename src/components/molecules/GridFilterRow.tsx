import FilterBox from "../atoms/FIlterBox";

export default function GridFilterRow() {
  return (
    <tr className="bg-zinc-50/50">
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <FilterBox />
      </td>
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <FilterBox />
      </td>
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <FilterBox withDropdown />
      </td>
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <FilterBox withDropdown />
      </td>
      <td className="border-b border-zinc-200 px-2 py-2">
      </td>
    </tr>
  );
}