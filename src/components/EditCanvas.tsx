"use client";

import { Desk, MapContext, Room } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import {
  Layer,
  Path,
  Rect,
  Stage,
  Image,
  useStrictMode,
  Transformer,
} from "react-konva";
import BookingDetails from "./BookingDetails";
import DatePicker from "./DatePicker";
import { KonvaEventObject } from "konva/lib/Node";
import useImage from "use-image";
import { Stage as StageType } from "konva/lib/Stage";
import Popup from "./CreateMapPopup";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CreateMapPopup from "./CreateMapPopup";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EditCanvas = ({ mapId }: { mapId: number }) => {
  const [showPopup, setShowPopup] = useState(false);
  const { focus, updateFocus, updateFocusPosition } = useContext(MapContext);
  const [bookedDesks, setBookedDesks] = useState<(number | undefined)[]>([]);
  const [bookedRooms, setBookedRooms] = useState<(number | undefined)[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [image] = useImage(backgroundImage);
  const [imageScale, setImageScale] = useState(1);
  const [deviceDimensions, setDeviceDimensions] = useState({
    width: 400,
    height: 400,
  });
  const { bookings, focusElement, updateFocusElement } = useContext(MapContext);
  const { rooms, updateRooms, addRoom, desks, updateDesks, addDesk } =
    useContext(MapContext);

  const router = useRouter();

  const trRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageType>(null);

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
      // setRooms(roomData as Room[]);
      //   setDesks(deskData as Desk[]);
      const newDesks = [...desks, ...(deskData as Desk[])];
      const newRooms = [...rooms, ...(roomData as Room[])];

      updateDesks(newDesks as Desk[]);
      updateRooms(newRooms as Desk[]);
      //   updateDesks(deskData as Desk[]);
      //   updateRooms(roomData as Room[]);
      //   setDesks((prev) => [...prev, deskData] as Desk[]);
      if (imgData) {
        setBackgroundImage(imgData[0].img);
      }
    };
    getMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!image) {
      return;
    }
    if (deviceDimensions.width > 768) {
      setImageScale(500 / image?.height);
    } else {
      setImageScale(350 / image?.width);
    }
  }, [image, deviceDimensions]);

  useEffect(() => {
    setDeviceDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (focus) {
      // @ts-expect-error just let me do it
      trRef.current?.nodes([focus.element]);
      // @ts-expect-error just let me do it
      trRef.current?.getLayer().batchDraw();
    }
    if (!focus) {
      setShowPopup(false);
    }
  }, [focus]);

  useEffect(() => {
    setDeviceDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    console.log(deviceDimensions);
  }, [deviceDimensions]);

  const handleFocus = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<Event>
  ) => {
    if (
      e.target.attrs.name === "stage" ||
      e.target.attrs.name === "image" ||
      e.target.attrs.y === 50
    ) {
      updateFocus(null);
      setShowPopup(false);
    } else {
      updateFocus(e.target as Shape<ShapeConfig>);
      setShowPopup(true);
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLDivElement).matches("canvas")) {
      updateFocusElement(undefined);
    }
  };

  const handleDragStart = (target: Shape<ShapeConfig>) => {
    setShowPopup(false);
    console.log("triggad first");
    if (target.attrs.name === "room") {
      addRoom();
      console.log("triggad");
    }
    if (target.attrs.name === "desk") {
      addDesk();
    }
  };

  const handleDraggedRoom = (target: Shape<ShapeConfig>, id: number) => {
    const draggedElementIndex = rooms.findIndex((room) => room.id === id);
    rooms[draggedElementIndex] = {
      ...rooms[draggedElementIndex],
      x: target.x(),
      y: target.y(),
      mapId,
    };
    updateRooms(rooms);
    if (focus) {
      setShowPopup(true);
      updateFocusPosition(target.x(), target.y());
    }
  };

  const handleTransformRoom = (target: Shape<ShapeConfig>, id: number) => {
    const transformedElementIndex = rooms.findIndex((room) => room.id === id);
    rooms[transformedElementIndex] = {
      ...rooms[transformedElementIndex],
      scaleX: target.attrs.scaleX,
      scaleY: target.attrs.scaleY,
      x: target.attrs.x,
      y: target.attrs.y,
    };
    updateRooms(rooms);
    if (focus) {
      updateFocusPosition(target.x(), target.y());
    }
  };

  const handleDraggedDesk = (target: Shape<ShapeConfig>, id: number) => {
    const draggedElementIndex = desks.findIndex((desk) => desk.id === id);
    desks[draggedElementIndex] = {
      ...desks[draggedElementIndex],
      x: target.x(),
      y: target.y(),
      mapId,
    };
    updateDesks(desks);
    if (focus) {
      setShowPopup(true);
      updateFocusPosition(target.x(), target.y());
    }
  };

  const handleTransformDesk = (target: Shape<ShapeConfig>, id: number) => {
    const transformedElementIndex = desks.findIndex((desk) => desk.id === id);
    desks[transformedElementIndex] = {
      ...desks[transformedElementIndex],
      scaleX: target.attrs.scaleX,
      scaleY: target.attrs.scaleY,
      x: target.attrs.x,
      y: target.attrs.y,
    };
    updateDesks(desks);
    if (focus) {
      updateFocusPosition(target.x(), target.y());
    }
  };

  const handleUpdateMap = async () => {
    await supabase.from("Rooms").delete().eq("mapId", mapId);
    await supabase.from("Desks").delete().eq("mapId", mapId);
    const roomData = rooms
      .filter((room) => room.y !== 50)
      .map(({ id, ...keepAttrs }) => keepAttrs);

    const deskData = desks
      .filter((desk) => desk.y !== 50)
      .map(({ id, ...keepAttrs }) => keepAttrs);
    try {
      // Insert all rooms with the new map ID
      for (const room of roomData) {
        await supabase.from("Rooms").insert({
          x: room.x,
          y: room.y,
          height: room.height,
          width: room.width,
          scaleX: room.scaleX,
          scaleY: room.scaleY,
          mapId: mapId,
        });
      }

      // Insert all desks with the new map ID
      for (const desk of deskData) {
        await supabase.from("Desks").insert({
          x: desk.x,
          y: desk.y,
          height: desk.height,
          width: desk.width,
          scaleX: desk.scaleX,
          scaleY: desk.scaleY,
          mapId: mapId,
        });
      }

      toast.success("Your map has been updated.");
      router.push(`/book-desk/${mapId}`, { scroll: false });
      // Navigate to the new map or update state as necessary
    } catch (error) {
      console.error("Error updating map:", error);
      toast.error("Failed to create new map version.");
    }
  };

  return (
    <>
      <div
        id="bookingWrapper"
        className=" flex flex-col py-6"
        onClick={(e) => handleClick(e)}
      >
        <div className="flex flex-col items-center relative" ref={containerRef}>
          <Stage
            width={
              deviceDimensions.width > 768
                ? (image?.width as number) * imageScale || 400
                : 350
            }
            height={
              deviceDimensions.width > 768
                ? 500
                : (image?.height as number) * imageScale || 400
            }
            name="stage"
            ref={stageRef}
            onClick={(e) => handleFocus(e)}
            onTap={(e) => handleFocus(e)}
            id="createMapStage"
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
                  id={`${room.id}`}
                  name="room"
                  width={room.width}
                  height={room.height}
                  scaleX={room.scaleX}
                  scaleY={room.scaleY}
                  x={room.x}
                  y={room.y}
                  stroke="black"
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e.target as Shape<ShapeConfig>)
                  }
                  onDragEnd={(e) => {
                    handleDraggedRoom(e.target as Shape<ShapeConfig>, room.id);
                  }}
                  onTransformEnd={(e) =>
                    handleTransformRoom(e.target as Shape<ShapeConfig>, room.id)
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
                  id={`${desk.id}`}
                  data="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                  width={desk.width}
                  height={desk.height}
                  scaleX={desk.scaleX}
                  scaleY={desk.scaleY}
                  x={desk.x}
                  y={desk.y}
                  stroke="black"
                  fill="white"
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e.target as Shape<ShapeConfig>)
                  }
                  onDragEnd={(e) => {
                    handleDraggedDesk(e.target as Shape<ShapeConfig>, desk.id);
                  }}
                  onTransformEnd={(e) =>
                    handleTransformDesk(e.target as Shape<ShapeConfig>, desk.id)
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
              {focus && (
                <Transformer
                  ref={trRef}
                  rotateEnabled={false}
                  borderEnabled={false}
                  anchorStroke={"#869ee3"}
                  anchorCornerRadius={15}
                  anchorStrokeWidth={1}
                  anchorSize={7}
                  keepRatio={false}
                  flipEnabled={false}
                  ignoreStroke={true}
                />
              )}
            </Layer>
          </Stage>
          {showPopup && <CreateMapPopup />}
          <div className="m-4 flex gap-4 self-end px-4 lg:px-10">
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMap}>Update map</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCanvas;
