import ActionCard from "@/components/ActionCard";
import floorplan from "../floorplan.jpg";
import newdesk from "../newdesk.jpg";

const Home = () => {
  return (
    <main className="flex flex-col xl:flex-row justify-center xl:items-stretch items-center mt-8 lg:mt-16 pt-4 gap-4 mb-16">
      <ActionCard
        img={floorplan}
        title="For office managers"
        description="Create a new office map or modify an existing one. A streamlined approach to managing your workspace layout."
        btnText="Manage maps"
        href="maps"
      ></ActionCard>
      <ActionCard
        img={newdesk}
        title="For employees"
        description="Choose your workspace! Select dates and pick from available rooms or desks through our interface. Book your ideal spot with just a few taps."
        btnText="Book space"
        reverse={false}
        href="book-desk/107"
      ></ActionCard>
    </main>
  );
};

export default Home;
