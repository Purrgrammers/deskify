import ActionCard from "@/components/ActionCard";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-4">
      <h1 className="text-lg mb-4">Deskify</h1>
      <ActionCard
        img="/favicon.ico"
        title="For office managers"
        description="Create a new booking map here"
        btnText="Create map"
        href="upload-map"
      ></ActionCard>
      <ActionCard
        img="/favicon.ico"
        title="For employees"
        description="Book a desk here"
        btnText="Book desk"
        reverse={true}
        href="book-desk/1"
      ></ActionCard>
    </main>
  );
};

export default Home;
