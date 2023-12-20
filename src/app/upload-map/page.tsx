import DropZone from "@/components/DropZone";
const Upload = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl m-4">Uppload your Office floor plan</h1>
      <div className="m-4 mt-7">
        <DropZone />
      </div>
    </div>
  );
};

export default Upload;
