import { createClient } from "@supabase/supabase-js";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { createContext, useEffect, useState } from "react";
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
  deleteRoom: (id: number) => void;
  desks: Desk[];
  updateDesks: (desks: Desk[]) => void;
  addDesk: () => void;
  deleteDesk: (id: number) => void;
  bookings: Booking[];
  updateBookings: (bookingData: Booking[]) => void;
  bookRoom: (id: number, mapId: number) => void;
  bookDesk: (id: number, mapId: number) => void;
  date: Date | undefined;
  updateDate: (date: Date) => void;
  focusElement: FocusElementBook | FocusElementTransform | undefined;
  updateFocusElement: (element: FocusElementBook | FocusElementTransform  | undefined) => void;
  updateFocusPosition: (x: number, y: number) => void;
  maps: Map[];
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
  seats?: number;
  additionalInfo?: string;
  mapId?: number;
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
  date: Date;
};

export type Map = {
  id: number;
  location: string;
  floor: number;
};

export type FocusElementBook = {
  type: string;
  booked: boolean;
  id: number;
  x: number;
  y: number;
  name?: string;
  seats?: number;
  additionalInfo?: string;
};

export type FocusElementTransform = {
  element: Shape<ShapeConfig>;
  x?: number;
  y?: number;
}

export const MapContext = createContext<MapContextProps>({
  rooms: [],
  updateRooms: () => {},
  addRoom: () => {},
  deleteRoom: () => {},
  desks: [],
  updateDesks: () => {},
  addDesk: () => {},
  deleteDesk: () => {},
  bookings: [],
  updateBookings: () => {},
  bookRoom: () => {},
  bookDesk: () => {},
  date: undefined,
  updateDate: () => {},
  focusElement: undefined,
  updateFocusElement: () => {},
  updateFocusPosition: () => {},
  maps: [{ id: 1, location: "", floor: 1 }],
});

export const MapContextProvider = (props: MapContextProviderProps) => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, x: 20, y: 50, width: 50, height: 50, scaleX: 1, scaleY: 1 },
  ]);
  const [desks, setDesks] = useState<Desk[]>([
    { id: 1, x: 80, y: 50, width: 50, height: 50, scaleX: 1, scaleY: 1 },
  ]);
  const [date, setDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [focusElement, setFocusElement] = useState<FocusElementBook | FocusElementTransform | undefined>();
  const [maps, setMaps] = useState<Map[]>([
    { id: 107, location: "Deskify HQ", floor: 3 },
  ]);

  useEffect(() => {
    const getMaps = async () => {
      const { data, error } = await supabase
        .from("Maps")
        .select("id, location, floor")
        .order("id", { ascending: true });
      if (data) {
        setMaps(data);
      } else {
        console.log("Error getting maps", error);
        toast.error("Could not get maps");
      }
    };
    getMaps();
  }, []);

  const bookRoom = async (id: number, mapId: number) => {
    const { data, error } = await supabase
      .from("Bookings")
      .insert({
        userId: 1,
        roomId: id,
        date: date?.toLocaleDateString("en-CA"),
        mapId,
      })
      .select();
    if (data) {
      toast.success("Your room has been booked");
      setBookings((prev) => [...prev, data[0]]);
    } else {
      toast.error("Error booking room");
      console.log("Error booking room", error);
    }
  };

  const bookDesk = async (id: number, mapId: number) => {
    const { data, error } = await supabase
      .from("Bookings")
      .insert({
        userId: 1,
        deskId: id,
        date: date?.toLocaleDateString("en-CA"),
        mapId,
      })
      .select();
    if (data) {
      toast.success("Your desk has been booked");
      setBookings((prev) => [...prev, data[0]]);
    } else {
      toast.error("Error booking desk");
      console.log("Error booking desk", error);
    }
  };

  const updateBookings = (bookingData: Booking[]) => {
    setBookings(bookingData);
  };

  const updateFocusElement = (element: FocusElementBook | FocusElementTransform | undefined) => {
    setFocusElement(element);
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
        id: rooms[rooms.length - 1].id + 1,
        x: 20,
        y: 50,
        width: 50,
        height: 50,
        scaleX: 1,
        scaleY: 1,
        mapId: 1,
      },
    ]);
  };

  const addDesk = () => {
    setDesks((prev) => [
      ...prev,
      {
        id: desks[desks.length - 1].id + 1,
        x: 80,
        y: 50,
        width: 50,
        height: 50,
        scaleX: 1,
        scaleY: 1,
        mapId: 1,
      },
    ]);
  };

  const deleteRoom = (id: number) => {
    const filteredRooms = rooms.filter((room) => room.id !== id);
    setRooms(filteredRooms);
  };

  const deleteDesk = (id: number) => {
    const filteredDesks = desks.filter((desk) => desk.id !== id);
    setDesks(filteredDesks);
  };

  const updateFocusPosition = (x: number, y: number) => {
    if (focusElement) {
      const newFocus = { ...focusElement, x, y };
      setFocusElement(newFocus);
    }
  };

  return (
    <MapContext.Provider
      value={{
        rooms,
        updateRooms,
        addRoom,
        deleteRoom,
        desks,
        updateDesks,
        addDesk,
        deleteDesk,
        bookings,
        updateBookings,
        bookRoom,
        bookDesk,
        date,
        updateDate,
        focusElement,
        updateFocusElement,
        updateFocusPosition,
        maps,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
