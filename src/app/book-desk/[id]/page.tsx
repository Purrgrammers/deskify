"use client";

import dynamic from "next/dynamic";
import {
  FacilityInfo,
  MapContext,
  MapContextProvider,
} from "@/contexts/MapContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BookingCanvas = dynamic(() => import("@/components/BookingCanvas"), {
  ssr: false,
});

const BookingPage = () => {
  const path = usePathname();
  const id = path.replace("/book-desk/", "");
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo | null>();

  return (
    <div className="flex flex-col max-w-7xl mx-auto">
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
        <div className="pl-4 lg:pl-10 pt-10">
          <h1 className="text-2xl font-semibold">Book your workspace</h1>
          <p>Select an available desk or room to book</p>
        </div>
        <div className="pl-10 pt-4">
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {facilityInfo?.location}
          </p>
          <p>
            <span className="font-semibold">Floor:</span> {facilityInfo?.floor}
          </p>
        </div>
        <BookingCanvas
          mapId={Number(id)}
          getFacilityInfo={(data: FacilityInfo) => setFacilityInfo(data)}
        ></BookingCanvas>
      </MapContextProvider>
    </div>
  );
};

export default BookingPage;
