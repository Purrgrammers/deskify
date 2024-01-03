import ActionCard from "@/components/ActionCard";
import manager from "../manager.png";
import user from "../user.png";
import floorplan from "../floorplan.jpg";
import office from "../office.jpg";
import newdesk from "../newdesk.jpg";

const Home = () => {
  return (
    <main className="flex flex-col xl:flex-row justify-center xl:items-stretch items-center mt-16 pt-4 gap-4 mb-16">
      <ActionCard
        img={floorplan}
        title="For office managers"
        description="Start building your office! With interactive map you can design your office layout with rooms and desks, creating a bookable space for your team."
        btnText="Create map"
        href="upload-map"
      ></ActionCard>
      <ActionCard
        img={newdesk}
        title="For employees"
        description="Choose your workspace! Select dates and pick from available rooms or desks through our interface. Book your ideal spot with just a few taps."
        btnText="Book desk"
        reverse={true}
        href="book-desk/1"
      ></ActionCard>
    </main>
  );
};

export default Home;
