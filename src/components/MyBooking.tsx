type BookingProps = {
  booking: {
    id: string;
    date: string;
    userId: number;
    deskId: number;
  };
};

const MyBooking = ({ booking }: BookingProps) => {
  return (
    <>
      <h1>This is my single booking</h1>
      <p>Id is {booking.id}</p>
      <p>Date is {booking.date}</p>
    </>
  );
};

export default MyBooking;
