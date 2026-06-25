import ExploreCard from "./ExploreCard";
import { componentsData } from "../../data/componentsData";

export default function ExploreComponentsSection() {
  return (
    <section className="w-full">
      <h2 className="mb-5 text-2xl font-bold text-zinc-800 pt-4">
        Explore Components
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {componentsData.map((item) => (
          <ExploreCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}