import dynamic from "next/dynamic";

const BookingCanvas = dynamic(() => import('@/components/BookingCanvas'), {
  ssr: false,
});

const BookingPage = () => {
  return (
    <>
    <div className="pl-10 pt-10">
    <h1 className='text-2xl'>Book your workspace</h1>
    <p>Select an available desk or room to book</p>
    </div>
    <div id="bookingWrapper" className="h-screen flex flex-col"> 
    <BookingCanvas></BookingCanvas>
    </div>
    </>
  )
}

export default BookingPage