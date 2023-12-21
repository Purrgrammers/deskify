"use client";

import { Desk, MapContext, Room } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { useContext, useEffect, useState } from "react";
import { Layer, Path, Rect, Stage } from "react-konva";
import BookingDetails from "./BookingDetails";
import DatePicker from "./DatePicker";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BookingMap = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [bookedDesks, setBookedDesks] = useState<(number | undefined)[]>([]);
  const [bookedRooms, setBookedRooms] = useState<(number | undefined)[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const { bookings } = useContext(MapContext)

  useEffect(() => {
    const getMapData = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from("Rooms")
        .select()
        .eq("mapId", "1");
      if (roomError) {
        console.log(roomError);
      }
      const { data: deskData, error: deskError } = await supabase
        .from("Desks")
        .select()
        .eq("mapId", "1");
      if (deskError) {
        console.log(deskError);
      }
      const { data: imgData, error: imgError } = await supabase
        .from("Maps")
        .select("img")
        .eq("id", "1");
      if (imgError) {
        console.log(imgError);
      }
      setRooms(roomData as Room[]);
      setDesks(deskData as Desk[]);
      //   updateDesks(deskData as Desk[]);
      if (imgData) {
        setBackgroundImage(imgData[0].img);
      }
    };
    getMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteredDesks = bookings
    .filter(booking => booking.deskId)
    .map(booking => booking.deskId); 
    console.log(filteredDesks) 
    setBookedDesks(filteredDesks)

    const filteredRooms = bookings
    .filter(booking => booking.roomId)
    .map(booking => booking.roomId); 
    console.log(filteredRooms) 
    setBookedRooms(filteredRooms) 
  }, [bookings])

  const container = document.querySelector("#bookingWrapper") as HTMLDivElement;

  const handleBookRoom = (target: Shape<ShapeConfig>, id: number) => {
    console.log(target.attrs, id)
  }

  const handleBookDesk = (target: Shape<ShapeConfig>, id: number) => {
    console.log(target.attrs, id)
  }

  return (
    <>
    <div className="self-end pr-10 mt-4">
    <DatePicker />
    </div>
      <Stage
        width={container.offsetWidth}
        height={container.offsetHeight}
        name="stage"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          backgroundPositionY: 120,
        }}
      >
        <Layer>
          {rooms.map((room) => (
            <Rect
              key={`room-${room.id}`}
              name="room"
              width={room.width}
              height={room.height}
              scaleX={room.scaleX}
              scaleY={room.scaleY}
              x={room.x}
              y={room.y}
              stroke={bookedRooms.includes(room.id)? "red": "green"}
              onClick={(e) => handleBookRoom(e.target as Shape<ShapeConfig>, room.id)}
            />
          ))}
          {desks.map((desk) => (
            <Path
              key={`desk-${desk.id}`}
              name="desk"
              data="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
              width={desk.width}
              height={desk.height}
              scaleX={desk.scaleX}
              scaleY={desk.scaleY}
              x={desk.x}
              y={desk.y}
              stroke={bookedDesks.includes(desk.id)? "red": "green"}
              fill="white"
              onClick={(e) => handleBookDesk(e.target as Shape<ShapeConfig>, desk.id)}
            />
          ))}
        </Layer>
      </Stage>
      <BookingDetails type="desk" id={1} available={true}/>
    </>
  );
};

export default BookingMap;
