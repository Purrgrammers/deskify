"use client";
import { MapContext } from "@/contexts/MapContext";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer, Path } from "react-konva";

const Canvas = () => {
  const [focus, setFocus] = useState<Shape<ShapeConfig> | null>(null);

  const { rooms, updateRooms, addRoom, desks, updateDesks, addDesk } =
    useContext(MapContext);

  const trRef = useRef(null);

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
  };

  const handleDraggedDesk = (target: Shape<ShapeConfig>, id: number) => {
    const draggedElementIndex = desks.findIndex((desk) => desk.id === id);
    desks[draggedElementIndex] = {
      ...desks[draggedElementIndex],
      x: target.x(),
      y: target.y(),
    };
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
  };

  const handleFocus = (e: KonvaEventObject<MouseEvent>) => {
    console.log(e.target);
    if (e.target.attrs.name === "stage") {
      setFocus(null);
    } else {
      setFocus(e.target as Shape<ShapeConfig>);
    }
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        name="stage"
        onClick={(e) => handleFocus(e)}
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
              anchorSize={10}
              keepRatio={false}
              flipEnabled={false}
              ignoreStroke={true}
            />
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
