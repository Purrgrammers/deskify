import { createClient } from "@supabase/supabase-js";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type MapContextProviderProps = {
  children: React.ReactNode;
};

type MapContextProps = {
  rooms: Room[];
  updateRooms: (rooms: Room[]) => void;
  addRoom: () => void;
  desks: Desk[];
  updateDesks: (desks: Desk[]) => void;
  addDesk: () => void;
  bookings: Booking[]
  updateBookings: (bookingData: Booking[]) => void
  bookRoom: (id: number) => void
  bookDesk: (id: number) => void
  date: Date | undefined
  updateDate: (date: Date) => void
};

export type Room = {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  scaleX: number;
  scaleY: number;
  name?: string;
  mapId?: number
};

export type Desk = {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  scaleX: number;
  scaleY: number;
  mapId?: number;
};

export type Booking = {
  id: number;
  userId: number;
  deskId?: number;
  roomId?: number;
  date: Date
};

export const MapContext = createContext<MapContextProps>({
  rooms: [],
  updateRooms: () => {},
  addRoom: () => {},
  desks: [],
  updateDesks: () => {},
  addDesk: () => {},
  bookings: [],
  updateBookings: () => {},
  bookRoom: () => {},
  bookDesk: () => {},
  date: undefined,
  updateDate: () => {}
});

export const MapContextProvider = (props: MapContextProviderProps) => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, x: 20, y: 50, width: 50, height: 50, scaleX: 1, scaleY: 1 },
  ]);
  const [desks, setDesks] = useState<Desk[]>([
    { id: 1, x: 80, y: 50, width: 50, height: 50, scaleX: 1, scaleY: 1 },
  ]);
  const [date, setDate] = useState<Date | undefined>();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const bookRoom = async(id: number) => {
    const { data, error } = await supabase
        .from("Bookings")
        .insert({userId: 1, roomId: id, date: date?.toLocaleDateString("en-CA")})
        .select()
      if(error) {
        toast.error("Error booking room");
        console.log(error)
      } else if (data) {
        toast.success("Your room has been booked");
        setBookings(prev => [...prev, data[0]])
        console.log(data[0])
      }
  }

  const bookDesk = async(id: number) => {
    const { data, error } = await supabase
        .from("Bookings")
        .insert({userId: 1, deskId: id, date: date})
        .select()
      if(error) {
        toast.error("Error booking desk");
        console.log(error)
      } else if (data) {
        toast.success("Your desk has been booked");
        setBookings(prev => [...prev, data[0]])
        console.log(data)
      }
  }

  const updateBookings = (bookingData: Booking[]) => {
    setBookings(bookingData);
  };

  const updateDate = (date: Date) => {
    setDate(date);
  };

  const updateRooms = (rooms: Room[]) => {
    setRooms(rooms);
  };

  const updateDesks = (desks: Desk[]) => {
    setDesks(desks);
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: rooms.length + 1,
        x: 20,
        y: 50,
        width: 50,
        height: 50,
        scaleX: 1,
        scaleY: 1,
        mapId: 1
      },
    ]);
  };

  const addDesk = () => {
    setDesks((prev) => [
      ...prev,
      {
        id: desks.length + 1,
        x: 80,
        y: 50,
        width: 50,
        height: 50,
        scaleX: 1,
        scaleY: 1,
        mapId: 1
      },
    ]);
  };

  return (
    <MapContext.Provider
      value={{
        rooms,
        updateRooms,
        addRoom,
        desks,
        updateDesks,
        addDesk,
        bookings,
        updateBookings,
        bookRoom,
        bookDesk,
        date,
        updateDate
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
