import { createContext, useState } from "react";

type MapContextProviderProps = {
  children: React.ReactNode;
};

type MapContextProps = {
  rooms: Room[];
  updateRooms: (rooms: Room[]) => void;
  addRoom: () => void;
  desks: Desk[];
  updateDesks: (desks: Desk[]) => void;
  addDesk: () => void;
  image: string;
  updateImage: (url: string) => void;
};

type Room = {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  scaleX: number;
  scaleY: number;
  name?: string;
};

type Desk = {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  scaleX: number;
  scaleY: number;
};

export const MapContext = createContext<MapContextProps>({
  rooms: [],
  updateRooms: () => {},
  addRoom: () => {},
  desks: [],
  updateDesks: () => {},
  addDesk: () => {},
  image: "",
  updateImage: () => {},
});

export const MapContextProvider = (props: MapContextProviderProps) => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, x: 50, y: 50, width: 50, height: 50, scaleX: 1, scaleY: 1 },
  ]);
  const [desks, setDesks] = useState<Desk[]>([
    { id: 1, x: 120, y: 50, width: 100, height: 100, scaleX: 1, scaleY: 1 },
  ]);
  const [image, setImage] = useState("hello");

  const updateRooms = (rooms: Room[]) => {
    setRooms(rooms);
  };

  const updateDesks = (desks: Desk[]) => {
    setDesks(desks);
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: rooms.length + 1,
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        scaleX: 1,
        scaleY: 1,
      },
    ]);
  };

  const addDesk = () => {
    setDesks((prev) => [
      ...prev,
      {
        id: desks.length + 1,
        x: 120,
        y: 50,
        width: 50,
        height: 50,
        scaleX: 1,
        scaleY: 1,
      },
    ]);
  };

  const updateImage = (url: string) => {
    console.log("context", url);
    setImage("url");
  };

  return (
    <MapContext.Provider
      value={{
        rooms,
        updateRooms,
        addRoom,
        desks,
        updateDesks,
        addDesk,
        image,
        updateImage,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};
