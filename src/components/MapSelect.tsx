import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

type MapSelectProps = {
  options: number[];
};

const MapSelect = ({ options }: MapSelectProps) => {
  return (
    <div>
      <Select>
        <Label htmlFor="mapSelect">Map</Label>
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={options[0]} />
        </SelectTrigger>
        <SelectContent id="mapSelect">
          <SelectGroup>
            {options.map((option: number) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapSelect;
