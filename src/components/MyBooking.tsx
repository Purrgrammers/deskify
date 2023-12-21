import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <TableRow>
        <TableCell className="font-medium">{booking.date}</TableCell>
        <TableCell>{booking.deskId}</TableCell>
        <TableCell className="text-right">Delete button</TableCell>
      </TableRow>
    </>
  );
};

export default MyBooking;
