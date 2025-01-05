"use client";
import { useBookSlot, useSlots } from "@/hooks/product/use-slot";
import { useState } from "react";

const Booking = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const staffId = 1; // Example staff ID
  const userId = 1; // Example user ID

  const { data: slotsData } = useSlots(staffId, date);
  const mutation = useBookSlot();

  const getEndTime = (
    startTime: string,
    durationMinutes: number = 15
  ): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);
    const endHours = String(startDate.getHours()).padStart(2, "0");
    const endMinutes = String(startDate.getMinutes()).padStart(2, "0");
    return `${endHours}:${endMinutes}`;
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    const startTime = `${date} ${selectedSlot}`;
    const endTime = `${date} ${getEndTime(selectedSlot)}`; // Calculate end time

    try {
      mutation.mutate(
        { staffId, userId, startTime, endTime },
        {
          onSuccess: () => {
            alert("Slot booked successfully!");
          },
          onError: (error) => {
            alert(`Booking failed: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Book a Slot</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
      />
      <ul>
        {slotsData?.map((slot) => (
          <li
            key={slot}
            style={{
              cursor: "pointer",
              color: selectedSlot === slot ? "blue" : "black",
            }}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot}
          </li>
        ))}
      </ul>
      <button onClick={handleBooking} disabled={!selectedSlot}>
        Confirm Booking
      </button>
    </div>
  );
};

export default Booking;
