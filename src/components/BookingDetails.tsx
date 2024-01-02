import { useContext } from "react";
import { Button } from "./ui/button";
import { MapContext } from "@/contexts/MapContext";

type BookingDetailsProps = {
    element: {
      type: string;
      booked: boolean,
      id: number
    }
}

const BookingDetails = ({element}: BookingDetailsProps) => {

  const { bookRoom, bookDesk } = useContext(MapContext)

  const handleBooking = () => {
    if(element.type === 'Room') {
      bookRoom(element.id)
    }
    if(element.type === 'Desk') {
      bookDesk(element.id)
    }
  }

  return (
    <div className="flex gap-6 items-center pl-10 pb-10">
        <p>{`${element.type} ${element.id}: `} <span className={element.booked? 'text-red-600': 'text-green-600'}>{element.booked? 'Booked': 'Available'}</span></p>
        <Button disabled={element.booked? true : false} size='xs' onClick={handleBooking}>Book</Button>
    </div>
  )
}

export default BookingDetails