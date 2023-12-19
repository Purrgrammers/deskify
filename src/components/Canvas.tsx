"use client";
import { KonvaEventObject } from "konva/lib/Node";
import { DragEvent, useRef } from "react";
import { useState } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";

const Canvas = () => {
  const [rooms, setRooms] = useState([{ id: 1, x: 50, y: 50, width: 50, height: 50, scaleX: 1, scaleY: 1},
    { id: 2, x: 376.9999999999998, y: 165.99999999999983, width: 50, height: 50, scaleX: 3.360000000000005, scaleY: 3.2200000000000037}]);
  const [desks, setDesks] = useState([{ id: 1, x: 50, y: 50 }]);

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

  const handleTransform = (e: KonvaEventObject<Event>, id: number) => {
    console.log(e.target.attrs)
    const transformedElementIndex = rooms.findIndex((room) => room.id === id);
    rooms[transformedElementIndex] = {
      ...rooms[transformedElementIndex],
      scaleX: e.target.attrs.scaleX,
      scaleY: e.target.attrs.scaleY,
      x: e.target.attrs.x,
      y: e.target.attrs.y
    };

  };

  const handleFocus = (e: KonvaEventObject<MouseEvent>) => {
    // @ts-expect-error just let me do it
    trRef.current?.nodes([e.target]);
    // @ts-expect-error just let me do it
    trRef.current?.getLayer().batchDraw();
  };
  
  const handleBlur = (e: KonvaEventObject<MouseEvent>) => {
    console.log(e.target)
  }



  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer>
          {rooms.map((room) => (
            <Rect
              key={room.id}
              width={room.width}
              height={room.height}
              scaleX={room.scaleX}
              scaleY={room.scaleY}
              x={room.x}
              y={room.y}
              stroke="black"
              draggable
              onClick={(e) => handleFocus(e)}
              onDragStart={() => {
                setRooms([...rooms, { id: rooms.length + 1, x: 50, y: 50, width: 50, height: 50, scaleX: 1, scaleY: 1 }]);
              }}
              onDragEnd={(e) => {
                handleDragged(e, room.id);
              }}
              onTransformEnd={(e) => handleTransform(e, room.id)}
            />
          ))}
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
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
