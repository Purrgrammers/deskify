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
  Transformer,
} from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import useImage from "use-image";
import { Stage as StageType } from "konva/lib/Stage";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CreateMapPopup from "./CreateMapPopup";
import { BeatLoader } from "react-spinners";
import MapSelect from "./MapSelect";
import FloorSelect from "./FloorSelect";
import HelpTextPopup from "./HelpTextPopup";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EditCanvas = ({ mapId }: { mapId: number }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showHelpText, setShowHelpText] = useState<{
    type: string;
    x: number;
  } | null>(null);
  const { focusElement, updateFocusElement, updateFocusPosition } = useContext(MapContext);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [image] = useImage(backgroundImage);
  const [imageScale, setImageScale] = useState(1);
  const { rooms, updateRooms, addRoom, desks, updateDesks, addDesk } =
    useContext(MapContext);

  const router = useRouter();

  const trRef = useRef(null);

  useEffect(() => {
    const getMapData = async () => {
      const { data , error } = await supabase
      .from("Maps")
      .select("*, Desks(*), Rooms(*)")
      .eq("id", mapId);
    if (data) {
      const newDesks = [...desks, ...(data[0].Desks as Desk[])];
      const newRooms = [...rooms, ...(data[0].Rooms as Room[])];
      updateDesks(newDesks as Desk[]);
      updateRooms(newRooms as Desk[]);
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
    if (image) {
      setImageScale(500 / image.height);
    }
  }, [image]);

  useEffect(() => {
    if (focusElement) {
      // @ts-expect-error need to figure out type
      trRef.current?.nodes([focusElement.element]);
    } else {
      setShowPopup(false);
    }
  }, [focusElement]);

  const handleFocus = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<Event>
  ) => {
    if (
      e.target.attrs.name === "stage" ||
      e.target.attrs.name === "image" ||
      e.target.attrs.y === 50
    ) {
      updateFocusElement(undefined);
      setShowPopup(false);
    } else {
      const newFocusElement = { ...focusElement, element: e.target as Shape<ShapeConfig>};
      updateFocusElement(newFocusElement);
      setShowPopup(true);
      const popup = document.querySelector('.popup')
      if(popup) {
        popup.classList.remove('popup-hidden')
      }
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLDivElement).matches("canvas")) {
      updateFocusElement(undefined);
    }
  };

  const handleDragStart = (target: Shape<ShapeConfig>) => {
    setShowPopup(false);
    setShowHelpText(null);
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
    if (focusElement) {
      setShowPopup(true);
      const popup = document.querySelector('.popup')
      if(popup) {
        popup.classList.remove('popup-hidden')
      }
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
    if (focusElement) {
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
    if (focusElement) {
      setShowPopup(true);
      const popup = document.querySelector('.popup')
      if(popup) {
        popup.classList.remove('popup-hidden')
      }
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
    if (focusElement) {
      updateFocusPosition(target.x(), target.y());
    }
  };

  const handleMouseEvent = (e: KonvaEventObject<globalThis.MouseEvent>) => {
    const container = (
      e.target.getStage() as StageType
    ).container();
    if (e.type === 'mouseenter'){
      container.style.cursor = "pointer";
    } else {
      container.style.cursor = "default";
    }
  }

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
          name: room.name,
          seats: room.seats,
          additionalInfo: room.additionalInfo,
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
      <div className="flex flex-col">
        {!backgroundImage ? (
          <BeatLoader className="justify-center pt-56" color="#ccc" />
        ) : (
          <div
            id="bookingWrapper"
            className=" flex flex-col py-6"
            onClick={(e) => handleClick(e)}
          >
            <div className="pl-4 lg:pl-10 flex gap-2">
              <MapSelect mapId={mapId.toString()} path="edit-map" />
              <FloorSelect mapId={mapId.toString()} />
            </div>
            <div
              className="flex flex-col md:items-center relative"
            >
              <Stage
                width={(image?.width as number) * imageScale || 400}
                height={640}
                name="stage"
                onClick={(e) => handleFocus(e)}
                onTap={(e) => handleFocus(e)}
                id="createMapStage"
              >
                <Layer>
                  <Image
                    y={120}
                    image={image}
                    alt="booking map"
                    scaleX={imageScale}
                    scaleY={imageScale}
                    name="image"
                    preventDefault={false}
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
                        handleDraggedRoom(
                          e.target as Shape<ShapeConfig>,
                          room.id
                        );
                      }}
                      onTransformEnd={(e) =>
                        handleTransformRoom(
                          e.target as Shape<ShapeConfig>,
                          room.id
                        )
                      }
                      onMouseEnter={(e) => {
                        handleMouseEvent(e)
                        if (e.target.attrs.y === 50) {
                          setShowHelpText({
                            type: e.target.attrs.name,
                            x: e.target.attrs.x,
                          });
                        }
                      }}
                      onMouseLeave={(e) => {
                        handleMouseEvent(e)
                        setShowHelpText(null);
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
                        handleDraggedDesk(
                          e.target as Shape<ShapeConfig>,
                          desk.id
                        );
                      }}
                      onTransformEnd={(e) =>
                        handleTransformDesk(
                          e.target as Shape<ShapeConfig>,
                          desk.id
                        )
                      }
                      onMouseEnter={(e) => {
                        handleMouseEvent(e)
                        if (e.target.attrs.y === 50) {
                          setShowHelpText({
                            type: e.target.attrs.name,
                            x: e.target.attrs.x,
                          });
                        }
                      }}
                      onMouseLeave={(e) => {
                        handleMouseEvent(e)
                        setShowHelpText(null);
                      }}
                    />
                  ))}
                  {focusElement && (
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
              {showHelpText && (
                <HelpTextPopup type={showHelpText.type} x={showHelpText.x} />
              )}
              <div className="m-4 flex gap-4 self-end px-4 lg:px-10">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateMap}>Update map</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditCanvas;
