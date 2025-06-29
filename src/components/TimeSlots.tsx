import { useEffect, useMemo, useRef, useState } from "react";
import type { TimeSlot } from "./types";
import { formatDate } from "../lib/dateUtils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

function TimeSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch data
  useEffect(() => {
    (async function () {
      try {
        const response = await fetch("/slots.json");
        const data: TimeSlot[] = await response.json();
        setSlots(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unexpected Error");
        }
        console.error("Failed to load slots:", error);
      }
    })();
  }, []);

  // function responsible for controlling scroll behaviour
  const scroll = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  // handle date selection
  const handleSelectDate = (date: string) => {
    setSelectedDate((prev) => (prev === date ? null : date));
    setSelectedTimeSlot(null);
  };

  // handle time slot selection
  const handleSelectTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlot((prev) => (prev === timeSlot ? null : timeSlot));
  };
  // hanlde final booking
  const handleBooking = () => {
    console.log({ selectedDate, selectedTimeSlot });
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  // Extract unique dates and memoize to avoid recalculation on every render
  const uniqueDates = useMemo(
    () => [...new Set(slots.map((slot) => slot.displayDate))],
    [slots]
  );

  // Filter slots for selected date
  const filteredSlots = selectedDate
    ? slots.filter((slot) => slot.displayDate === selectedDate)
    : [];

  // return error message when there is a error in loading slots
  if (error) {
    return (
      <div className="p-4 max-w-lg md:mx-auto mx-2 my-2 rounded-xl bg-[#F9F3EC]">
        <span className="text-red-600">
          error in loading slots! Please try again after some time
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg md:mx-auto mx-2 my-2 rounded-xl bg-[#F9F3EC]">
      <h2 className="text-xl font-bold mb-4">Pick a date</h2>
      <div className="flex items-center justify-between gap-2">
        {/* scroll backward button */}
        <button
          aria-label="scroll back"
          className="rounded-full bg-black/5 p-2 cursor-pointer"
          onClick={() => scroll(-200)}
        >
          <ArrowLeft color="#454545" />
        </button>
        {/* set horizontal overflow to scroll  */}
        <div className="flex gap-2 sm:w-96 overflow-x-scroll" ref={scrollRef}>
          {/* loop through the unique dates and display button for selection */}
          {uniqueDates.map((dateStr) => {
            const { date, day } = formatDate(dateStr);
            return (
              <button
                key={dateStr}
                className={cn(
                  "px-4 py-2 bg-white border border-[#D9DEE2] rounded-xl cursor-pointer",
                  selectedDate === dateStr &&
                    "bg-[#e2f1ffb3] border border-[#1c8cf2]"
                )}
                onClick={() => handleSelectDate(dateStr)}
              >
                <div className="flex flex-col gap-2">
                  <span className={cn(selectedDate === dateStr && "font-bold")}>
                    {date}
                  </span>
                  <span>{day}</span>
                </div>
              </button>
            );
          })}
        </div>
        {/* scroll forward button */}
        <button
          aria-label="scroll forward"
          className="rounded-full bg-black/5 p-2 cursor-pointer"
          onClick={() => scroll(200)}
        >
          <ArrowRight color="#454545" />
        </button>
      </div>

      <div className="mt-10 mb-5">
        <h3 className="text-lg font-semibold">Available Time Slots</h3>
        <h2 className="text-black/50">Each session lasts for 30 minutes</h2>
      </div>

      {/* loop through the available slots for for selected Date */}
      {selectedDate ? (
        <div>
          <div className="flex gap-3 flex-wrap">
            {filteredSlots.map((slot, index) => (
              <button
                tabIndex={0}
                key={index}
                className={cn(
                  "p-2 border border-[#D9DEE2] rounded-xl bg-white cursor-pointer",
                  selectedTimeSlot === slot.displayTime &&
                    "bg-[#e2f1ffb3] border border-[#1c8cf2]"
                )}
                onClick={() => handleSelectTimeSlot(slot.displayTime)}
              >
                {slot.displayTime}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <span className="text-sm font-bold">
          Please select a date to see available time slots
        </span>
      )}
      <div className="flex justify-center mt-10">
        <button
          className={cn(
            "bg-[#1c8cf2] p-1 rounded w-1/2 md:w-1/3 text-white cursor-pointer disabled:cursor-not-allowed",
            !selectedTimeSlot ? "bg-gray-400" : "active:bg-blue-600"
          )}
          disabled={!selectedTimeSlot}
          onClick={handleBooking}
        >
          Book
        </button>
      </div>
    </div>
  );
}

export default TimeSlots;
