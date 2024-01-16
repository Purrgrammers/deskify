"use client";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Booking from "@/components/Booking";
import { BookingProvider } from "@/contexts/BookingContext";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fetchFail = () =>
  toast.error("Could not show your bookings.", {
    id: "fail1",
  });

type Booking = {
  id: string;
  date: string;
  userId: number;
  deskId: number;
  roomId: number;
  Maps: {
    id: number;
    location?: string;
    floor?: number;
  };
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const date = new Date();
  const today = date.toISOString().split("T")[0];

  useEffect(() => {
    const fetchAllBookings = async () => {
      const { data, error } = await supabase
        .from("Bookings")
        .select("*, Maps!inner(id, location, floor), Rooms(id, name)")
        .order("date", { ascending: true })
        .gte("date", today);
      if (error) {
        console.log("Fetching problem:", error);
        fetchFail();
        return;
      }
      console.log(data, "bookingdata");
      setBookings(data);
      console.log("Those are my bookings", data);
    };
    fetchAllBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeBookingFromState = (bookingId: string) => {
    setBookings((currentBookings) =>
      currentBookings.filter((b) => b.id !== bookingId)
    );
  };

  return (
    <div className="max-w-7xl mx-auto mb-14">
      <BookingProvider
        initialBookings={bookings}
        removeBookingFromState={removeBookingFromState}
      >
        <Toaster
          containerStyle={{
            top: 20,
            left: 20,
            bottom: 20,
            right: 20,
          }}
          toastOptions={{
            success: {
              style: {
                background: "#a3cfac",
              },
            },
            error: {
              style: {
                background: "#f6b2b5",
              },
            },
          }}
        />
        <h1 className="text-2xl font-semibold my-8 mx-4 mt-10">Bookings</h1>
        <div className="flex flex-col justify-center mx-4">
          <h2>Your booked desks:</h2>
          {!bookings.length ? (
            <BeatLoader className="justify-center pt-20" color="#ccc" />
          ) : (
            <Table className="mx-auto">
              <TableCaption>A list of your booked desks.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[150px]">Desk</TableHead>
                  <TableHead className="w-[150px]">Location</TableHead>
                  <TableHead className="w-[150px]">Floor</TableHead>
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
          )}
          <h2 className="mt-8">Your booked rooms:</h2>
          {!bookings.length ? (
            <BeatLoader className="justify-center pt-20" color="#ccc" />
          ) : (
            <Table className="mx-auto">
              <TableCaption>A list of your booked rooms.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[150px]">Room</TableHead>
                  <TableHead className="w-[150px]">Location</TableHead>
                  <TableHead className="w-[150px]">Floor</TableHead>
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
          )}
        </div>
      </BookingProvider>
    </div>
  );
};

export default Bookings;
