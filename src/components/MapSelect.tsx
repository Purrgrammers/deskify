import React, { useContext } from "react";
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

type MapSelectProps = {
  options: number[];
};

const MapSelect = () => {
    const { maps } = useContext(MapContext)

  return (
    <div>
      <Select>
        <Label htmlFor="mapSelect">Choose map</Label>
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={maps[0].id} />
        </SelectTrigger>
        <SelectContent id="mapSelect">
          <SelectGroup>
            {maps.map((map) => (
              <SelectItem key={map.id} value={map.id.toString()}>
                {map.id}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapSelect;
