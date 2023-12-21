"use client";
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
import Booking from "@/components/Booking";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Booking = {
  id: string;
  date: string;
  userId: number;
  deskId: number;
  roomId: number;
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
      <div className="flex flex-col justify-center mx-4">
        <h2>Your booked desks:</h2>
        <Table className="mx-auto">
          <TableCaption>A list of your booked desks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead>Desk</TableHead>
              <TableHead className="pl-0">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) =>
              // Pass each memory to the Memory component
              booking.roomId ? (
                <Booking key={booking.id} booking={booking} />
              ) : null
            )}
          </TableBody>
        </Table>
        <h2>Your booked rooms:</h2>
        <Table className="mx-auto">
          <TableCaption>A list of your booked rooms.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="pl-0">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) =>
              // Pass each memory to the Memory component
              booking.deskId ? (
                <Booking key={booking.id} booking={booking} />
              ) : null
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Bookings;
