"use client";
import { MapContext } from "@/contexts/MapContext";
import { createClient } from "@supabase/supabase-js";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer, Path } from "react-konva";
import { useStrictMode } from "react-konva";
import { Button } from "./ui/button";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Canvas = () => {
  const [focus, setFocus] = useState<Shape<ShapeConfig> | null>(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const { rooms, updateRooms, addRoom, desks, updateDesks, addDesk } =
    useContext(MapContext);

  useStrictMode(true);

  const trRef = useRef(null);

  useEffect(() => {
    const getImage = async () => {
      const { data, error } = await supabase
        .from("Maps")
        .select("img")
        .eq("id", "1");
      if (data) {
        console.log(data[0].img);
        setBackgroundImage(data[0].img);
      }
    };
    getImage();
  }, []);

  useEffect(() => {
    if (focus) {
      // @ts-expect-error just let me do it
      trRef.current?.nodes([focus]);
      // @ts-expect-error just let me do it
      trRef.current?.getLayer().batchDraw();
    }
  }, [focus]);

  const handleDraggedRoom = (target: Shape<ShapeConfig>, id: number) => {
    const draggedElementIndex = rooms.findIndex((room) => room.id === id);
    rooms[draggedElementIndex] = {
      ...rooms[draggedElementIndex],
      x: target.x(),
      y: target.y(),
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
    if (e.target.attrs.name === "stage") {
      setFocus(null);
    } else {
      setFocus(e.target as Shape<ShapeConfig>);
    }

    if (e.target.attrs.name === 'room') {
      
    }
  };

  const handleCreateMap = async() => {
    const { error: roomError } = await supabase
    .from('Rooms')
    .insert(rooms)
    if(roomError) {
      console.log('roomerror', roomError)
    }
    const { error: deskError } = await supabase
    .from('Desks')
    .insert(desks)
    if(deskError) {
      console.log('deskerror', deskError)
    }
  }

  const container = document.querySelector("#canvasWrapper") as HTMLDivElement;

  return (
    <>
      <Stage
        width={container.offsetWidth}
        height={container.offsetHeight}
        name="stage"
        onClick={(e) => handleFocus(e)}
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
      <div className="m-4 flex gap-4 justify-end">
        <Button variant="secondary">Back</Button>
        <Button onClick={handleCreateMap}>Create map</Button>
      </div>
    </>
  );
};

export default Canvas;
