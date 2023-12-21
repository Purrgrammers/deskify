import { Button } from "./ui/button";

type BookingDetailsProps = {
    element: {
      type: string;
      booked: boolean,
      id: number
    }
}


const BookingDetails = ({element}: BookingDetailsProps) => {
  return (
    <div className="flex gap-6 items-center pl-10 pb-10">
        <p>{`${element.type} ${element.id}: `} <span className={element.booked? 'text-red-600': 'text-green-600'}>{element.booked? 'Booked': 'Available'}</span></p>
        <Button size='xs'>Book</Button>
    </div>
  )
}

export default BookingDetails