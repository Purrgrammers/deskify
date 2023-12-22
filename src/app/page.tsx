import ActionCard from "@/components/ActionCard";
import manager from "../manager.png";
import user from "../user.png";
import floorplan from "../floorplan.jpg";
import office from "../office.jpg";
import newdesk from "../newdesk.jpg";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center mt-7 pt-4 gap-4">
      <ActionCard
        img={floorplan}
        title="For office managers"
        description="Create a new bookable map here."
        btnText="Create map"
        href="upload-map"
      ></ActionCard>
      <ActionCard
        img={newdesk}
        title="For employees"
        description="Book a room or a desk here"
        btnText="Book desk"
        reverse={true}
        href="book-desk/1"
      ></ActionCard>
    </main>
  );
};

export default Home;
