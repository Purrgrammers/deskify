"use client";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { useRef } from "react";
import { useState } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";

const Canvas = () => {
  const [rooms, setRooms] = useState([{ id: 1, x: 50, y: 50 }]);
  const [desks, setDesks] = useState([{ id: 1, x: 50, y: 50 }]);
  const [focus, setFocus] = useState<Shape<ShapeConfig> | null>(null);

  const trRef = useRef(null);

  const handleDragged = (e: KonvaEventObject<DragEvent>, id: number) => {
    const draggedElementIndex = rooms.findIndex((room) => room.id === id);
    rooms[draggedElementIndex] = {
      ...rooms[draggedElementIndex],
      x: e.target.x(),
      y: e.target.y(),
    };
    console.log(rooms[draggedElementIndex]);
  };

  const handleFocus = (e: KonvaEventObject<MouseEvent>) => {
    console.log(e.target)
    setFocus(e.target as Shape<ShapeConfig>);

    // @ts-expect-error just let me do it
    trRef.current?.nodes([e.target]);
    // @ts-expect-error just let me do it
    trRef.current?.getLayer().batchDraw();
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        className="canvas"
      >
        <Layer>
          {rooms.map((room) => (
            <Rect
              key={room.id}
              width={50}
              height={50}
              stroke="black"
              draggable
              onClick={(e) => handleFocus(e)}
              onDragStart={() => {
                setRooms([...rooms, { id: rooms.length + 1, x: 50, y: 50 }]);
              }}
              onDragEnd={(e) => {
                handleDragged(e, room.id);
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
              anchorSize={10}
              keepRatio={false}
              ignoreStroke={true}
            />
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
