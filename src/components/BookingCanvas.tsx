"use client";

import { Desk, MapContext, Room } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { Layer, Path, Rect, Stage, Image } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage as StageType } from "konva/lib/Stage";
import { MouseEvent, useContext, useEffect, useState } from "react";
import DatePicker from "./DatePicker";
import useImage from "use-image";
import BookDeskPopup from "./BookDeskPopup";
import { BeatLoader } from "react-spinners";
import MapSelect from "./MapSelect";
import FloorSelect from "./FloorSelect";
import toast from "react-hot-toast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BookingMap = ({ mapId }: { mapId: number }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [bookedDesks, setBookedDesks] = useState<(number | undefined)[]>([]);
  const [bookedRooms, setBookedRooms] = useState<(number | undefined)[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [image] = useImage(backgroundImage);
  const [imageScale, setImageScale] = useState(1);
  const { bookings, focusElement, updateFocusElement } = useContext(MapContext);

  useEffect(() => {
    const getMapData = async () => {
      const { data , error } = await supabase
        .from("Maps")
        .select("*, Desks(*), Rooms(*)")
        .eq("id", mapId);
      if (data) {
        setRooms(data[0].Rooms as Room[]);
        setDesks(data[0].Desks as Desk[]);
        setBackgroundImage(data[0].img);
      } else {
        console.log('Error getting map data from database', error)
        toast.error('Could not get map data')
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

    if (
      focusElement &&
      (filteredDesks.includes(focusElement?.id as number) ||
        filteredRooms.includes(focusElement?.id as number))
    ) {
      focusElement.booked = true;
    }
  }, [bookings, focusElement]);

  useEffect(() => {
    if (!image) {
      return;
    }
    setImageScale(500 / image?.height);
  }, [image]);

  const handleClickRoom = (target: Shape<ShapeConfig>, id: number) => {
    const booked = bookedRooms.includes(id);
    const type = target.attrs.name.replace(
      target.attrs.name[0],
      target.attrs.name[0].toUpperCase()
    );
    const x = target.attrs.x;
    const y = target.attrs.y;
    const clickedRoom = rooms.find((room) => room.id === id);

    updateFocusElement({
      type,
      id,
      booked,
      x,
      y,
      name: clickedRoom?.name,
      seats: clickedRoom?.seats,
      additionalInfo: clickedRoom?.additionalInfo,
    });
    const popup = document.querySelector('.popup')
    if(popup) {
      popup.classList.remove('popup-hidden')
    }
  };

  const handleClickDesk = (target: Shape<ShapeConfig>, id: number) => {
    const booked = bookedDesks.includes(id);
    const type = target.attrs.name.replace(
      target.attrs.name[0],
      target.attrs.name[0].toUpperCase()
    );
    const x = target.attrs.x;
    const y = target.attrs.y;
    updateFocusElement({ type, id, booked, x, y });
    const popup = document.querySelector('.popup')
    if(popup) {
      popup.classList.remove('popup-hidden')
    }
  };

  const handleFocus = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<Event>
  ) => {
    if (e.target.attrs.name !== "room" && e.target.attrs.name !== "desk") {
      updateFocusElement(undefined);
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLDivElement).matches("canvas")) {
      updateFocusElement(undefined);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {!backgroundImage ? (
          <BeatLoader className="justify-center pt-56" color="#ccc" />
        ) : (
          <div
            id="bookingWrapper"
            className="flex flex-col overflow-auto"
            onClick={(e) => handleClick(e)}
          >
            <div className="mb-6 mt-4 pl-4 lg:pl-10 flex flex-col md:flex-row gap-2 justify-between md:items-end">
              <div className="flex flex-col md:flex-row gap-2">
              <MapSelect mapId={mapId.toString()} path="book-desk"/>
              <FloorSelect mapId={mapId.toString()}/>
              </div>
              <DatePicker />
            </div>
            <div
              className="flex flex-col lg:items-center relative"
            >
              <Stage
                width={(image?.width as number) * imageScale || 400}
                height={500}
                name="stage"
                id="bookDeskStage"
                onPointerClick={(e) => handleFocus(e)}
              >
                <Layer>
                  <Image
                    image={image}
                    alt="booking map"
                    scaleX={imageScale}
                    scaleY={imageScale}
                    preventDefault={false}
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
                      y={room.y - 120}
                      stroke={bookedRooms.includes(room.id) ? "#e53935" : "#43a047"}
                      onPointerClick={(e) =>
                        handleClickRoom(e.target as Shape<ShapeConfig>, room.id)
                      }
                      onMouseEnter={(e) => {
                        const container = (
                          e.target.getStage() as StageType
                        ).container();
                        container.style.cursor = "pointer";
                      }}
                      onMouseLeave={(e) => {
                        const container = (
                          e.target.getStage() as StageType
                        ).container();
                        container.style.cursor = "default";
                      }}
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
                      y={desk.y - 120}
                      stroke={bookedDesks.includes(desk.id) ? "#e53935" : "#43a047"}
                      fill="white"
                      onPointerClick={(e) =>
                        handleClickDesk(e.target as Shape<ShapeConfig>, desk.id)
                      }
                      onMouseEnter={(e) => {
                        const container = (
                          e.target.getStage() as StageType
                        ).container();
                        container.style.cursor = "pointer";
                      }}
                      onMouseLeave={(e) => {
                        const container = (
                          e.target.getStage() as StageType
                        ).container();
                        container.style.cursor = "default";
                      }}
                    />
                  ))}
                </Layer>
              </Stage>
              {focusElement && <BookDeskPopup mapId={mapId} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingMap;
