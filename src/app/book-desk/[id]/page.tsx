'use client'

import dynamic from "next/dynamic";
import { MapContextProvider } from "@/contexts/MapContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const BookingCanvas = dynamic(() => import('@/components/BookingCanvas'), {
  ssr: false,
});

const BookingPage = () => {

  const path = usePathname()
  const id = path.replace('/book-desk/', '')

  return (
    <div className="flex flex-col ">
    <MapContextProvider>
    <Toaster></Toaster>
    <div className="pl-10 pt-10">
    <h1 className='text-2xl'>Book your workspace</h1>
    <p>Select an available desk or room to book</p>
    </div>
    <div id="bookingWrapper" className="h-screen flex flex-col"> 
    <BookingCanvas mapId={Number(id)}></BookingCanvas>
    </div>
    </MapContextProvider>
    </div>
  )
}

export default BookingPage