import dynamic from "next/dynamic";

const BookingCanvas = dynamic(() => import('@/components/BookingCanvas'), {
  ssr: false,
});

const BookingPage = () => {
  return (
    <div id="bookingWrapper" className="h-screen"> 
    <BookingCanvas></BookingCanvas>
    </div>
  )
}

export default BookingPage