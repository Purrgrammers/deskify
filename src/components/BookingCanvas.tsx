"use client";

import { Desk, MapContext, Room } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { useContext, useEffect, useRef, useState } from "react";
import { Layer, Path, Rect, Stage, Image } from "react-konva";
import BookingDetails from "./BookingDetails";
import DatePicker from "./DatePicker";
import { KonvaEventObject } from "konva/lib/Node";
import useImage from "use-image";
import { Stage as StageType } from "konva/lib/Stage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type FocusElement = {
  type: string;
  booked: boolean;
  id: number;
};

const BookingMap = ({ mapId }: { mapId: number }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [bookedDesks, setBookedDesks] = useState<(number | undefined)[]>([]);
  const [bookedRooms, setBookedRooms] = useState<(number | undefined)[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [image] = useImage(backgroundImage);
  const [imageScale, setImageScale] = useState(1);
  const [deviceDimensions, setDeviceDimensions] = useState({width: 400, height: 400});
  const [focusElement, setFocusElement] = useState<FocusElement | undefined>();
  const { bookings } = useContext(MapContext);

  useEffect(() => {
    const getMapData = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from("Rooms")
        .select()
        .eq("mapId", mapId);
      if (roomError) {
        console.log(roomError);
      }
      const { data: deskData, error: deskError } = await supabase
        .from("Desks")
        .select()
        .eq("mapId", mapId);
      if (deskError) {
        console.log(deskError);
      }
      const { data: imgData, error: imgError } = await supabase
        .from("Maps")
        .select("img")
        .eq("id", mapId);
      if (imgError) {
        console.log(imgError);
      }
      setRooms(roomData as Room[]);
      setDesks(deskData as Desk[]);
      console.log(roomData, deskData);
      if (imgData) {
        setBackgroundImage(imgData[0].img);
      }
    };
    getMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteredDesks = bookings
      .filter((booking) => booking.deskId)
      .map((booking) => booking.deskId);
    setBookedDesks(filteredDesks);

    const filteredRooms = bookings
      .filter((booking) => booking.roomId)
      .map((booking) => booking.roomId);
    setBookedRooms(filteredRooms);
  }, [bookings]);

  useEffect(() => {
    if(!image) {
      return
    }
    if(deviceDimensions.width > 768){
      setImageScale(500 / image?.height)
    } else {
      setImageScale(350 / image?.width)
    }
  }, [image, deviceDimensions])

  useEffect(() => {
    setDeviceDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    console.log(deviceDimensions)
  }, [deviceDimensions]);

  const stageRef = useRef<StageType>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickRoom = (target: Shape<ShapeConfig>, id: number) => {
    const booked = bookedRooms.includes(id);
    const type = target.attrs.name.replace(
      target.attrs.name[0],
      target.attrs.name[0].toUpperCase()
    );
    setFocusElement({ type, id, booked });
  };

  const handleClickDesk = (target: Shape<ShapeConfig>, id: number) => {
    const booked = bookedDesks.includes(id);
    const type = target.attrs.name.replace(
      target.attrs.name[0],
      target.attrs.name[0].toUpperCase()
    );
    setFocusElement({ type, id, booked });
  };

  const handleFocus = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target.attrs.name === "stage") {
      setFocusElement(undefined);
    }
  };

  return (
    <>
      <div className="self-start my-6 pl-10">
        <DatePicker />
      </div>
      <div className="flex flex-col items-center relative" ref={containerRef}>
        <Stage
          width={deviceDimensions.width > 768? image?.width as number * imageScale || 400 : 350}
          height={deviceDimensions.width > 768? 500 : (image?.height as number) * imageScale|| 400}
          name="stage"
          ref={stageRef}
          onClick={(e) => handleFocus(e)}
        >
          <Layer>
            <Image
              image={image}
              alt="booking map"
              scaleX={imageScale}
              scaleY={imageScale}
            ></Image>
            {rooms.map((room) => (
              <Rect
                key={`room-${room.id}`}
                name="room"
                width={room.width}
                height={room.height}
                scaleX={room.scaleX}
                scaleY={room.scaleY}
                x={room.x}
                y={room.y - 140 * imageScale}
                stroke={bookedRooms.includes(room.id) ? "red" : "green"}
                onClick={(e) =>
                  handleClickRoom(e.target as Shape<ShapeConfig>, room.id)
                }
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
                y={desk.y - 140 * imageScale}
                stroke={bookedDesks.includes(desk.id) ? "red" : "green"}
                fill="white"
                onClick={(e) =>
                  handleClickDesk(e.target as Shape<ShapeConfig>, desk.id)
                }
              />
            ))}
          </Layer>
        </Stage>
        {focusElement && <BookingDetails element={focusElement} />}
      </div>
    </>
  );
};

export default BookingMap;
