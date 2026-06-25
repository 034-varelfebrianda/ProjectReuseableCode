import TextMainContainer from "../atoms/TextMainContainer";
import ButtonMainContainer from "../atoms/ButtonMainContainer";

export default function MainContainer() {
  return (
      <div className="bg-[#09090B] rounded-2xl px-5 pt-5 pb-5">
        <TextMainContainer />
        <ButtonMainContainer />
      </div>
  );
}