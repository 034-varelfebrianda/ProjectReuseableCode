import ExploreComponentsSection from "../molecules/ExploreComponents";
import MainContainer from "../molecules/MainContainer";

export default function MainContain() {
  return (
    <div className="flex-1 p-8 w-full">
      <MainContainer />
      <ExploreComponentsSection />
    </div>
  );
}
