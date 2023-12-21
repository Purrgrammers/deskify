import { Button } from "./ui/button";

type BookingDetailsProps = {
    type: string;
    available: boolean,
    id: number
}


const BookingDetails = ({type, id, available}: BookingDetailsProps) => {
  return (
    <div className="flex gap-6 items-center pl-10 pb-10">
        <p>{`${type} ${id}: `} <span className={available? 'text-green-600': 'text-red-600'}>{available? 'Available': 'Booked'}</span></p>
        <Button size='xs'>Book</Button>
    </div>
  )
}

export default BookingDetails