import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type BookingProps = {
  booking: {
    id: string;
    date: string;
    userId: number;
    deskId: number;
  };
};

const MyBooking = ({ booking }: BookingProps) => {
  const handleClick = async () => {
    const { error } = await supabase
      .from("Bookings")
      .delete()
      .eq("id", booking.id);
  };
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{booking.date}</TableCell>
        <TableCell>{booking.deskId}</TableCell>
        <TableCell className="text-right w-[25px]" align="right">
          <Trash2 onClick={handleClick} className="trash-hover" />
        </TableCell>
      </TableRow>
    </>
  );
};

export default MyBooking;
