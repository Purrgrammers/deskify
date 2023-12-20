"use client";

import { Desk, MapContext, Room } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BookingMap = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");

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
        console.log(deskError);
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

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          backgroundPositionY: 120,
        }}
        className="h-screen w-screen"
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-2 border-black border-solid absolute"
            style={{
              left: `${room.x}px`,
              top: `${room.y}px`,
              height: "50px",
              width: "50px",
              transform: `scaleX(${room.scaleX}) scaleY(${room.scaleY}`,
            }}
          ></div>
        ))}
        {desks.map((desk) => (
          <svg
            key={desk.id}
            style={{
                left: `${desk.x}px`,
                top: `${desk.y}px`,
                height: "50px",
                width: "50px",
                transform: `scaleX(${desk.scaleX}) scaleY(${desk.scaleY}`,
              }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
            />
          </svg>
        ))}
      </div>
    </>
  );
};

export default BookingMap;
