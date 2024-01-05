"use client";

import DropZone from "@/components/DropZone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapContextProvider } from "@/contexts/MapContext";
const Upload = () => {
  return (
    <MapContextProvider>
      <div className="flex flex-col mt-12 mb-8 items-center max-w-2xl mx-auto">
        <div className="text-left w-full mb-8">
          <h1 className="text-2xl font-semibold m-4 mb-6">
            Add some info about your facility
          </h1>
          <div className="mx-4 my-2">
            <p className="mb-4">
              This will be shown in the booking page.
            </p>
          </div>
          <div className="mx-4 flex flex-col gap-2">
          <Label htmlFor="address" className="ml-px mt-px">Address</Label>
          <Input type="text" id="address" name="input-address" required={true} className="mb-2"></Input>
          <Label htmlFor="floor" className="ml-px mt-px" >Floor number</Label>
          <Input type="number" id="floor" name="input-floor" required={true}></Input>
          </div>
        </div>
        <div className="text-left w-full">
          <h1 className="text-2xl font-semibold m-4 mb-6">
            Upload your office floor plan
          </h1>
          <div className="mx-4 my-2">
            <p>
              Upload your floor plan image for an effortless mapping of your
              office space. Alternatively, you can choose to skip this step and
              proceed without a picture.
            </p>
          </div>
          <div className="w-full">
            <div className="m-4 mt-5 flex flex-col justify-center w-full">
              <DropZone />
            </div>
          </div>
        </div>
      </div>
    </MapContextProvider>
  );
};

export default Upload;
