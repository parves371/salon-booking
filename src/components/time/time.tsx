"use client";
import { useBookSlot, useSlots } from "@/hooks/product/use-slot";
import { useServicesStore } from "@/store/use-professional-store";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const Booking = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { services } = useServicesStore.getState();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(
    null
  ); // Track selected professional

  
  const staffIds = services?.map((professional) => professional.professional.id); // Example staff ID
  const staffId = 3; // Example user ID
  const userId = 3; // Example user ID

  const { data: slotsData } = useSlots(staffId, date); // Fetch available slots based on the selected staff and date
  const mutation = useBookSlot();

  // Calculate the end time for a selected slot
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

  // Handle the booking logic
  const handleBooking = async () => {
    if (!selectedSlot || !selectedProfessional) return;

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

  // Professional selection handler
  const handleProfessionalSelect = (professional: any) => {
    setSelectedProfessional(professional); // Set the clicked professional as active
  };

  return (
    <div className="mt-12">
      <div className="container mx-auto flex gap-16">
        {/* Left Panel for Selecting Professional and Date/Time */}
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

          {/* Professional List (Display staff options to choose from) */}
          <div className="mt-6 flex gap-4">
            {services.map((professional) => (
              <div
                key={professional.id}
                onClick={() =>
                  handleProfessionalSelect(professional.professional.id)
                }
                className={`cursor-pointer flex flex-col items-center ${
                  selectedProfessional?.id === professional.id
                    ? "text-blue-600"
                    : ""
                }`}
              >
                <Avatar>
                  {/* <AvatarImage src={professional.img} alt={professional.name} /> */}
                </Avatar>
                <span>{professional.name}</span>
              </div>
            ))}
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
          {selectedProfessional && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Available Times</h2>
              <div className="flex gap-4 flex-wrap">
                {slotsData?.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-4 border border-[#d3d3d3] rounded-lg hover:bg-[#F5F5F5] text-lg font-semibold text-start ${
                      selectedSlot === slot
                        ? "bg-[#5847c7] text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel for Selected Treatments and Summary */}
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
            disabled={!selectedSlot || !selectedProfessional} // Disable if no slot or professional is selected
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
