import React, { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { MapContext } from "@/contexts/MapContext";
import { useRouter } from "next/navigation";

const FloorSelect = ({ mapId }: { mapId: string }) => {
  const { maps } = useContext(MapContext);
  const [ floorValue, setFloorValue ] = useState('0')

  useEffect(() => {
    const map = maps.find((map) => map.id === Number(mapId))
    if(map) {
      setFloorValue(map?.floor.toString())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[mapId])

  return (
    <div>
      <Select value={floorValue}>
        <Label htmlFor="floorSelect">Floor</Label>
        <SelectTrigger className="w-[180px]">
          <SelectValue defaultValue={floorValue} />
        </SelectTrigger>
        <SelectContent id="floorSelect">
          <SelectGroup>
              <SelectItem value={floorValue}>
                {floorValue}
              </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FloorSelect;
