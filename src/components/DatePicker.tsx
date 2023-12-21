"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { supabase } from "./BookingCanvas";
import { MapContext } from "@/contexts/MapContext";
import { SelectSingleEventHandler } from "react-day-picker";

const DatePicker = () => {
  const today = new Date()
  const [date, setDate] = useState<Date>(today);
  const { updateBookings, updateDate } = useContext(MapContext);

  useEffect(() => {
    const getBookings = async () => {
      if (!date) {
        return
      }
      const selectedDate = date?.toLocaleDateString("en-CA");
      updateDate(date)
      const { data, error } = await supabase
        .from("Bookings")
        .select()
        .eq("date", selectedDate);
      if (error) {
        console.log(error);
        return;
      }
      updateBookings(data);
    };
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate as SelectSingleEventHandler}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
