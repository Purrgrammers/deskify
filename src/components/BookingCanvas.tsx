"use client";

import { Desk, FacilityInfo, MapContext, Room } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { Layer, Path, Rect, Stage, Image } from "react-konva";
import DatePicker from "./DatePicker";
import { KonvaEventObject } from "konva/lib/Node";
import useImage from "use-image";
import { Stage as StageType } from "konva/lib/Stage";
import BookDeskPopup from "./BookDeskPopup";
import { BeatLoader } from "react-spinners";
import MapSelect from "./MapSelect";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import FloorSelect from "./FloorSelect";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BookingMap = ({
  mapId,
  getFacilityInfo,
}: {
  mapId: number;
  getFacilityInfo: (data: FacilityInfo) => void;
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [bookedDesks, setBookedDesks] = useState<(number | undefined)[]>([]);
  const [bookedRooms, setBookedRooms] = useState<(number | undefined)[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [image] = useImage(backgroundImage);
  const [imageScale, setImageScale] = useState(1);
  const [deviceDimensions, setDeviceDimensions] = useState({
    width: 400,
    height: 400,
  });
  const { bookings, focusElement, updateFocusElement, maps } = useContext(MapContext);

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
      const { data: mapData, error: imgError } = await supabase
        .from("Maps")
        .select()
        .eq("id", mapId);
      if (imgError) {
        console.log(imgError);
      }
      setRooms(roomData as Room[]);
      setDesks(deskData as Desk[]);
      if (mapData) {
        setBackgroundImage(mapData[0].img);
        getFacilityInfo({
          location: mapData[0].location,
          floor: mapData[0].floor,
        });
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
  }, [image, deviceDimensions]);

  useEffect(() => {
    setDeviceDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    console.log(deviceDimensions);
  }, [deviceDimensions]);

  const stageRef = useRef<StageType>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
              ref={containerRef}
            >
              <Stage
                width={(image?.width as number) * imageScale || 400}
                height={500}
                name="stage"
                id="bookDeskStage"
                ref={stageRef}
                onClick={(e) => handleFocus(e)}
                onTap={(e) => handleFocus(e)}
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
                      y={
                        deviceDimensions.width > 768
                          ? room.y - 120
                          : room.y - 120
                      }
                      stroke={bookedRooms.includes(room.id) ? "red" : "green"}
                      onClick={(e) =>
                        handleClickRoom(e.target as Shape<ShapeConfig>, room.id)
                      }
                      onTap={(e) =>
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
                      y={
                        deviceDimensions.width > 768
                          ? desk.y - 120
                          : desk.y - 120
                      }
                      stroke={bookedDesks.includes(desk.id) ? "red" : "green"}
                      fill="white"
                      onClick={(e) =>
                        handleClickDesk(e.target as Shape<ShapeConfig>, desk.id)
                      }
                      onTap={(e) =>
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
