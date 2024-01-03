"use client";

import dynamic from "next/dynamic";
import { MapContext, MapContextProvider } from "@/contexts/MapContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { MouseEvent, useContext } from "react";

const BookingCanvas = dynamic(() => import("@/components/BookingCanvas"), {
  ssr: false,
});

const BookingPage = () => {
  const { updateFocusElement } = useContext(MapContext);
  const path = usePathname();
  const id = path.replace("/book-desk/", "");

  return (
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
          <h1 className="text-2xl font-semibold">Book your workspace</h1>
          <p>Select an available desk or room to book</p>
        </div>
          <BookingCanvas mapId={Number(id)}></BookingCanvas>
      </MapContextProvider>
    </div>
  );
};

export default BookingPage;
