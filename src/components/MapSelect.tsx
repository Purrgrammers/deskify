import React, { useContext, useState } from "react";
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

const MapSelect = ({ mapId, path }: { mapId: string, path: string }) => {
  const { maps } = useContext(MapContext);
  const router = useRouter();

  const handleValueChange = (value: string) => {
    router.push(`/${path}/${value}`, { scroll: false });
  };

  return (
    <div>
      <Select value={mapId} onValueChange={(value) => handleValueChange(value)}>
        <Label htmlFor="mapSelect">Choose location</Label>
        <SelectTrigger className="w-[180px]">
          <SelectValue defaultValue={mapId} />
        </SelectTrigger>
        <SelectContent id="mapSelect">
          <SelectGroup>
            {maps.map((map) => (
              <SelectItem key={map.id} value={map.id.toString()}>
                {map.location || 'hello'}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapSelect;
