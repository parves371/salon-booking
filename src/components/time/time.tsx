"use client";

import { useBookSlot, useSlots } from "@/hooks/product/use-slot";
import { useServicesStore } from "@/store/use-professional-store";
import { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface Professional {
  id: number;
  position: string;
  available: boolean;
  skills: string[] | null;
  name: string;
  role: string; // Add 'role' to the Professional interface
}

interface Service {
  id: number;
  name: string;
  time: string;
  price: number; // Changed price to number to match SelectProfessional
  professional: Professional;
}

interface Payload {
  staffId: number;
  userId: number;
  startTime: string;
  endTime: string;
  serviceId: number;
}

const Times = () => {
  const [date, setDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(
    null
  );

  const { services } = useServicesStore.getState();
  const staffIds = services?.map(
    (professional) => professional.professional.id
  );
  const servicesIdsAndTime = services?.map((service) => ({
    id: service.id,
    time: service.time,
  }));

  const userId = 1;

  const { data: slotsData } = useSlots(staffIds, date, servicesIdsAndTime);
  const mutation = useBookSlot();

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const getEndTime = (startTime: string, durationMinutes: string) => {
    // Convert duration "00:30" to total minutes
    const [hours, minutes] = durationMinutes.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + totalMinutes);

    const endHours = String(startDate.getHours()).padStart(2, "0");
    const endMinutes = String(startDate.getMinutes()).padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  };

  console.log(services);

  // Generate payload with cascading times
  const generatePayload = (
    services: Service[],
    userId: number,
    date: string,
    selectedSlot: string
  ): Payload[] => {
    let currentStartTime = selectedSlot;

    const payload = services.map((service) => {
      const endTime = getEndTime(currentStartTime, service.time);
      const servicePayload: Payload = {
        staffId: service.professional.id,
        userId,
        startTime: `${date}T${currentStartTime}`,
        endTime: `${date}T${endTime}`,
        serviceId: service.id,
      };

      currentStartTime = endTime;

      return servicePayload;
    });

    return payload;
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    // let currentStartTime = selectedSlot; // Initialize with the first selected slot

    // const payload = services.map((service) => ({
    //   staffId: service.professional.id,
    //   userId,
    //   startTime: `${date}T${selectedSlot}`,
    //   endTime: `${date}T${getEndTime(selectedSlot, service.time)}`,
    //   serviceId: service.id,
    // }));
    const payload = generatePayload(services, userId, date, selectedSlot);

    console.log(payload);

    try {
      const response = await fetch("/api/product/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting bookings:", error);
      alert("An error occurred while submitting bookings.");
    }
  };

  if (!date) {
    // Render nothing while initializing state
    return null;
  }

  return (
    <div className="mt-12">
      <div className="container mx-auto flex gap-16">
        {/* Left Panel */}
        <div className="w-1/2">
          <h1 className="text-4xl font-bold bg-white sticky top-0">
            Book a Slot
          </h1>

          {/* Professional Selection */}
          <div
            className="flex gap-2 items-center justify-center border p-2 rounded-full mt-6 w-[300px]"
            onClick={() => setSelectedProfessional(null)}
          >
            {selectedProfessional ? (
              <Avatar>
                <AvatarImage
                  src={selectedProfessional.img}
                  alt={selectedProfessional.name}
                />
              </Avatar>
            ) : (
              <>
                <RxAvatar className="text-2xl" />
                Select a Professional
                <IoChevronDown />
              </>
            )}
          </div>

          {/* Date Selection */}
          <div className="mt-6 flex gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Disable past dates
            />
          </div>

          {/* Time Slot Selection */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Available Times</h2>
            <div className="flex gap-4 flex-wrap">
              {slotsData &&
                slotsData.map((slot) => (
                  <div
                    key={slot}
                    className={`w-full p-4 border border-[#d3d3d3] rounded-lg hover:bg-[#5847c7] hover:text-white text-lg font-semibold text-start ${
                      selectedSlot === slot
                        ? "bg-[#5847c7] text-white"
                        : "bg-white text-gray-600"
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[40%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin">
          {services.map((treatment) => (
            <div
              key={treatment.id}
              className="flex justify-between items-center mb-4 px-3"
            >
              <div className="w-[50%] flex flex-col">
                <span>{treatment.name}</span>
                <span>{treatment.time}</span>
                <span className="">
                  with{" "}
                  <span className="text-[#7C6DD8] font-semibold text-sm">
                    {treatment?.professional.name || "Any Professional"}
                  </span>
                </span>
              </div>
              <div>
                <span>AED {treatment.price}</span>
              </div>
            </div>
          ))}
          <div className="px-3">
            <Separator className="my-4 px-3" />
          </div>
          <div className="flex justify-between font-bold text-lg px-3">
            <h3>Total</h3>
            {/* <h3>AED {totalPrice}</h3> Display total price */}
          </div>

          {/* Confirm Booking Button */}
          <Button
            className="w-full mt-16"
            onClick={handleBooking}
            disabled={!selectedSlot} // Disable if no slot or professional is selected
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Times;
