"use client";

import { MapContextProvider } from "@/contexts/MapContext";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

const EditCanvas = dynamic(() => import("@/components/EditCanvas"), {
  ssr: false,
});

const EditMap = () => {
  const path = usePathname();
  const id = path.replace("/edit-map/", "");

  return (
    <>
      <div className="flex flex-col">
        <MapContextProvider>
          <Toaster
            containerStyle={{
              top: 20,
              left: 20,
              bottom: 20,
              right: 20,
            }}
            toastOptions={{
              success: {
                style: {
                  background: "#a3cfac",
                },
              },
              error: {
                style: {
                  background: "#f6b2b5",
                },
              },
            }}
          />
          <div className="pl-10 pt-10">
            <h1 className="text-2xl">Edit your office map</h1>
            <p>
              Drag and drop bookable rooms and desks onto your map or remove
              existing ones.
            </p>
          </div>
          <div id="bookingWrapper" className="flex flex-col">
            <EditCanvas mapId={Number(id)}></EditCanvas>
          </div>
        </MapContextProvider>
      </div>
    </>
  );
};

export default EditMap;
