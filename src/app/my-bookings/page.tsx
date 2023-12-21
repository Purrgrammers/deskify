"use client";
import MyBooking from "@/components/MyBooking";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Booking = {
  id: string;
  date: string;
  userId: number;
  deskId: number;
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      const { data, error } = await supabase.from("Bookings").select();
      if (error) {
        console.log("Fetching problem:", error);
        return;
      }
      setBookings(data);
      console.log("Those are my bookings", data);
    };
    fetchAllBookings();
  }, []);
  return (
    <>
      <h1 className="text-2xl my-6 mx-4">Bookings</h1>

      <Table>
        <TableCaption>A list of your booked desks and rooms.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Date</TableHead>
            <TableHead>Table</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            // Pass each memory to the Memory component
            <MyBooking key={booking.id} booking={booking} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Bookings;
