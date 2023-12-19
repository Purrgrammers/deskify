import DropZone from "@/components/DropZone";
const Upload = () => {
  return (
    <>
      <h1 className="text-xl mt-4">Uppload your Office floor plan</h1>
      <div className="m-3 mt-7">
        <DropZone />
      </div>
    </>
  );
};

export default Upload;
