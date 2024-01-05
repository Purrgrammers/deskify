import ActionCard from "@/components/ActionCard";
import floorplan from "../../floorplan.jpg";
import editfloormap from "../../edit-floor-map.jpg";
import newdesk from "../../newdesk.jpg";

const Home = () => {
  return (
    <main className="flex flex-col xl:flex-row justify-center xl:items-stretch items-center mt-16 pt-4 gap-4 mb-16">
      <ActionCard
        img={floorplan}
        title="Create a map of your office"
        description="Start building your office! With interactive map you can design your office layout with rooms and desks, creating a bookable space for your team."
        btnText="Create map"
        href="upload-map"
      ></ActionCard>
      <ActionCard
        img={editfloormap}
        title="Edit your map"
        description="Refine your office layout! Easily modify your existing map to adjust rooms and desks, ensuring your space evolves with your teams needs."
        btnText="Edit map"
        reverse={true}
        href="edit-map/1"
      ></ActionCard>
    </main>
  );
};

export default Home;
