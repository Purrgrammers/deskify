import DropZone from "@/components/DropZone";
const Upload = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl m-4">Uppload your Office floor plan</h1>
      <div className="mx-4 my-2 text-center">
        <p>
          Upload your floor plan image for an effortless mapping of your office
          space. Alternatively, you can choose to skip this step and proceed
          without a picture.
        </p>
      </div>
      <div className="m-4 mt-5">
        <DropZone />
      </div>
    </div>
  );
};

export default Upload;
