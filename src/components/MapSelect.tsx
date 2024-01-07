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
import router from "next/router";
import { usePathname, useRouter } from "next/navigation";

const MapSelect = () => {
    const path = usePathname();
    const id = path.replace("/edit-map/", "");
    const { maps } = useContext(MapContext)
    const [ selectedMap, setSelectedMap ] = useState(id)
    const router = useRouter();
    
    const handleValueChange = (value: string) => {

        // const selectedValue = (document.querySelector('#mapSelect') as HTMLSelectElement).value
        router.push(`/edit-map/${value}`, { scroll: false });
    }
  return (
    <div>
      <Select value={selectedMap} onValueChange={(value) => handleValueChange(value)}>
        <Label htmlFor="mapSelect">Choose map</Label>
        <SelectTrigger className="w-[180px]">
        <SelectValue defaultValue={selectedMap} />
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
