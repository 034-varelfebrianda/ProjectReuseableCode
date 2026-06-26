import { LargeDataBase as mails } from "../../data/LargeDataBase";
import Checkbox from "../atoms/CheckBox";
import TabButton from "../atoms/TabButton";
import GridFilterRow from "../molecules/GridFilterRow";
import Pagination from "../molecules/Pagination";

export default function LargeDataTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex border-b border-zinc-200">
        <TabButton label="Preview" active />
        <TabButton label="Code" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-275 border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-left text-sm font-semibold text-[#71717A]">
              <th className="w-45 border-b border-r border-zinc-200 px-4 py-4">
                From
              </th>
              <th className="border-b border-r border-zinc-200 px-4 py-4">
                Subject
              </th>
              <th className="w-32.5 border-b border-r border-zinc-200 px-4 py-4">
                Sent
              </th>
              <th className="w-32.5 border-b border-r border-zinc-200 px-4 py-4 text-center">
                Attachment?
              </th>
              <th className="w-27.5 border-b border-zinc-200 px-4 py-4">
                Size
              </th>
            </tr>

            <GridFilterRow />
          </thead>

          <tbody>
            {mails.map((mail) => (
              <tr
                key={mail.id}
                className="font-sm text-[#09090B] hover:bg-zinc-50"
              >
                <td className="border-b border-r border-zinc-200 px-4 py-4">
                  {mail.from}
                </td>
                <td className="border-b border-r border-zinc-200 px-4 py-4">
                  {mail.subject}
                </td>
                <td className="border-b border-r border-zinc-200 px-4 py-4">
                  {mail.sent}
                </td>
                <td className="border-b border-r border-zinc-200 px-4 py-4">
                  <Checkbox checked={mail.attachment} />
                </td>
                <td className="border-b border-zinc-200 px-4 py-4">
                  {mail.size}
                </td>
              </tr>
            ))}

            <tr>
              <td
                colSpan={5}
                className="border-b border-zinc-200 px-5 py-3 text-right text-sm font-medium text-zinc-500"
              >
                Sum = 42 GB
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  );
}