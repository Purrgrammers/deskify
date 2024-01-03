import { useContext } from "react";
import { Button } from "./ui/button";
import { MapContext } from "@/contexts/MapContext";

const BookingDetails = () => {
  const { bookRoom, bookDesk, focusElement } = useContext(MapContext)

  const handleBooking = () => {
    if(focusElement?.type === 'Room') {
      bookRoom(focusElement?.id)
    }
    if(focusElement?.type === 'Desk') {
      bookDesk(focusElement?.id)
    }
  }
  
  return (
    <div className="flex gap-6 items-center pl-10 pb-10">
        <p>{`${focusElement?.type} ${focusElement?.id}: `} <span className={focusElement?.booked? 'text-red-600': 'text-green-600'}>{focusElement?.booked? 'Booked': 'Available'}</span></p>
        <Button disabled={focusElement?.booked? true : false} size='xs' onClick={handleBooking}>Book</Button>
    </div>
  )
}

export default BookingDetails