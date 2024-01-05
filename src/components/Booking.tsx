import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingContext } from "@/contexts/BookingContext";
import { createClient } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";
import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

//Toasters
const deleteSuccess = () =>
  toast.success("You succesfully deleted your booking.");
const deleteFail = () =>
  toast.error("We could not delete your booking.", { id: "fail1" });

type BookingProps = {
  booking: {
    id: string;
    date: string;
    userId: number;
    deskId: number;
    roomId: number;
    address?:string;
    floor?: number;
  };
};

const Booking: React.FC<BookingProps> = ({ booking }) => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("BookingContext must be used within a BookingProvider");
  }

  console.log(booking)

  const { removeBookingFromState } = context;

  const handleClick = async () => {
    try {
      const { error } = await supabase
        .from("Bookings")
        .delete()
        .eq("id", booking.id);
      if (error) throw new Error();
      console.log("I have been clicked");
      deleteSuccess();
      removeBookingFromState(booking.id);
    } catch (error) {
      deleteFail();
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{booking.date}</TableCell>
        <TableCell>
          {booking.deskId ? booking.deskId : booking.roomId}
        </TableCell>
        <TableCell>
          {booking.address}
        </TableCell>
        <TableCell>
        {booking.floor}
        </TableCell>
        <TableCell className="text-right w-[25px]" align="right">
          <Trash2 onClick={handleClick} className="trash-hover" />
        </TableCell>
      </TableRow>
    </>
  );
};

export default Booking;
