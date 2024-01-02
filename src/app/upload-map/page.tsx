"use client";

import DropZone from "@/components/DropZone";
import { MapContextProvider } from "@/contexts/MapContext";
const Upload = () => {
  return (
    <MapContextProvider>
      <div className="flex flex-col mt-12 items-center min-h-screen max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-semibold m-4 mb-8">
            Upload your Office floor plan
          </h1>
          <div className="mx-4 my-2">
            <p>
              Upload your floor plan image for an effortless mapping of your
              office space. Alternatively, you can choose to skip this step and
              proceed without a picture.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="m-4 mt-5 mx-auto">
              <DropZone />
            </div>
          </div>
        </div>
      </div>
    </MapContextProvider>
  );
};

export default Upload;
