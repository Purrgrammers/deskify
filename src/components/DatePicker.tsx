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
import { useContext, useEffect, useState } from "react";
import { supabase } from "./BookingCanvas";
import { MapContext } from "@/contexts/MapContext";
import { Label } from "./ui/label";
import toast from "react-hot-toast";

const DatePicker = () => {
  const today = new Date();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { date, updateBookings, updateDate, updateFocusElement } =
    useContext(MapContext);

  useEffect(() => {
    const getBookings = async () => {
      if (!date) {
        return;
      }
      const selectedDate = date?.toLocaleDateString("en-CA");
      const { data, error } = await supabase
        .from("Bookings")
        .select()
        .eq("date", selectedDate);
      if (data) {
        updateBookings(data);
      } else {
        toast.error("Could not get bookings for this date");
        console.log("Error getting bookings from database", error);
      }
    };
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className="flex flex-col gap-px pr-4 lg:pr-10">
      <Label htmlFor="datePicker">Date</Label>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            id="datePicker"
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
            onSelect={(e) => {
              updateDate(e as Date);
              setIsCalendarOpen(false);
              updateFocusElement(undefined);
            }}
            initialFocus
            disabled={(date) =>
              date.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
