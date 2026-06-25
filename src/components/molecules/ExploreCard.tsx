import { ComponentItem } from "../../data/componentsData";
import ComponentIcon from "../atoms/ComponentIcon";
import DemoCount from "../atoms/DemoCount";
import SeeDemosLink from "../atoms/SeeDemosLink";

type ExploreCardProps = {
  item: ComponentItem;
};

export default function ExploreCard({ item }: ExploreCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex h-32 items-center justify-center bg-zinc-50">
        <ComponentIcon icon={item.icon} />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-[17px] font-semibold text-zinc-800">
            {item.title}
          </h3>
        </div>

        <p className="mb-5 text-sm leading-6 text-zinc-400">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <DemoCount count={item.demos} />
          <SeeDemosLink />
        </div>
      </div>
    </div>
  );
}