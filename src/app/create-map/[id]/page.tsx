"use client";
import { MapContextProvider } from "@/contexts/MapContext";
import { showPopup } from "@/utils/showPopup";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SyntheticEvent } from "react";
import { Toaster } from "react-hot-toast";

const Canvas = dynamic(() => import("@/components/Canvas"), {
  ssr: false,
});


const CreateMap = () => {
  const path = usePathname();
  const id = path.replace("/create-map/", "");

  const handleClick = (e: SyntheticEvent) => {
    if((e.target as HTMLElement).tagName.toLowerCase() !== 'canvas'){
      showPopup(false)
    }
  }

  return (
    <>
      <div className="flex flex-col max-w-7xl mx-auto" onClick={(e) => handleClick(e)}>
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
            <h1 className="text-2xl font-semibold">Create your office map</h1>
            <p>Drag and drop bookable rooms and desks onto your map</p>
          </div>
          <div id="bookingWrapper" className="flex flex-col">
            <Canvas mapId={Number(id)}></Canvas>
          </div>
        </MapContextProvider>
      </div>
    </>
  );
};

export default CreateMap;
