"use client";
import { MapContext } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Transformer,
  Path,
  Image,
} from "react-konva";
import { useStrictMode } from "react-konva";
import { Button } from "./ui/button";
import useImage from "use-image";
import { Stage as StageType } from "konva/lib/Stage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Canvas = ({ mapId }: { mapId: number }) => {
  const [focus, setFocus] = useState<Shape<ShapeConfig> | null>(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [image] = useImage(backgroundImage);
  const [imageScale, setImageScale] = useState(1);
  const { rooms, updateRooms, addRoom, desks, updateDesks, addDesk } =
    useContext(MapContext);

  useStrictMode(true);

  const trRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageType>(null);

  useEffect(() => {
    const getImage = async () => {
      const { data, error } = await supabase
        .from("Maps")
        .select("img")
        .eq("id", mapId);
      if (data) {
        setBackgroundImage(data[0].img);
      }
    };
    getImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (focus) {
      // @ts-expect-error just let me do it
      trRef.current?.nodes([focus]);
      // @ts-expect-error just let me do it
      trRef.current?.getLayer().batchDraw();
    }
  }, [focus]);

  useEffect(() => {
    if(!image) {
      return
    }
    setImageScale(500 / image?.height)
    console.log(image.height)
  }, [image])


  const handleDraggedRoom = (target: Shape<ShapeConfig>, id: number) => {
    const draggedElementIndex = rooms.findIndex((room) => room.id === id);
    rooms[draggedElementIndex] = {
      ...rooms[draggedElementIndex],
      x: target.x(),
      y: target.y(),
      mapId,
    };
    updateRooms(rooms);
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
  };

  const handleFocus = (e: KonvaEventObject<MouseEvent>) => {
    console.log(e.target);
    if (e.target.attrs.name === "stage" || e.target.attrs.name === "image") {
      setFocus(null);
    } else {
      setFocus(e.target as Shape<ShapeConfig>);
    }
  };

  const handleCreateMap = async () => {
    const roomData = rooms
      .filter((room) => room.y !== 50)
      .map(({ id, ...keepAttrs }) => keepAttrs);

    const deskData = desks
      .filter((desk) => desk.y !== 50)
      .map(({ id, ...keepAttrs }) => keepAttrs);

    const { error: roomError } = await supabase.from("Rooms").insert(roomData);
    if (roomError) {
      console.log("roomerror", roomError);
    }
    const { error: deskError } = await supabase.from("Desks").insert(deskData);
    if (deskError) {
      console.log("deskerror", deskError);
    }
  };


  return (
    <>
      <div
        style={{
          position: "relative",
        }}
        ref={containerRef}
      >
        <Stage
          name="stage"
          width={containerRef.current?.offsetWidth || 400}
          height={500 + 140}
          onClick={(e) => handleFocus(e)}
          ref={stageRef}
        >
          <Layer>
          <Image 
          offsetY={-140} 
          image={image} 
          scaleX={imageScale}
          scaleY={imageScale}
          alt="floor plan"
          name="image"
          >
          </Image>
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
                stroke="black"
                draggable
                onDragStart={() => addRoom()}
                onDragEnd={(e) => {
                  handleDraggedRoom(e.target as Shape<ShapeConfig>, room.id);
                }}
                onTransformEnd={(e) =>
                  handleTransformRoom(e.target as Shape<ShapeConfig>, room.id)
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
                y={desk.y}
                stroke="black"
                fill="white"
                draggable
                onDragStart={() => addDesk()}
                onDragEnd={(e) => {
                  handleDraggedDesk(e.target as Shape<ShapeConfig>, desk.id);
                }}
                onTransformEnd={(e) =>
                  handleTransformDesk(e.target as Shape<ShapeConfig>, desk.id)
                }
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
        <div className="m-4 flex gap-4 justify-end pr-10 pb-10">
          <Button variant="secondary">Back</Button>
          <Button onClick={handleCreateMap}>Create map</Button>
        </div>
      </div>
    </>
  );
};

export default Canvas;
