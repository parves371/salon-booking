"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoChevronDown } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import ProfileCard from "../professional/profile-card";
import { ProfileCardProps } from "../professional/select-professional";
import data from "../../../data/frisha.json"; // Assuming this is an array of professionals
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useAppSelector } from "@/lib/hooks";

const SelectTime = () => {
  const [datas, setDatas] = useState<ProfileCardProps[]>(data.professional);
  const { selectedTreatments, totalPrice } = useAppSelector(
    (state) => state.treatments // Redux state for selected treatments
  );
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeProfessional, setActiveProfessional] =
    useState<ProfileCardProps | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<
    Record<string, { time: string; booked: boolean }[]>
  >({
    "2024-12-01": [
      { time: "10:00 AM", booked: false },
      { time: "11:00 AM", booked: true },
      { time: "1:00 PM", booked: false },
    ],
    "2024-12-02": [
      { time: "9:00 AM", booked: true },
      { time: "10:30 AM", booked: false },
      { time: "2:00 PM", booked: false },
    ],
  });

  const dates = [
    { date: "1", day: "Sun", id: "2024-12-01" },
    { date: "2", day: "Mon", id: "2024-12-02" },
  ];

  const handleDateClick = (id: string) => {
    setActiveDate(id);
    setSelectedTime(null); // Reset selected time when changing date
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  // Handle professional selection and store data
  const handleProfessionalSelect = (professional: ProfileCardProps) => {
    setActiveProfessional(professional); // Set the clicked professional as active
  };

  return (
    <section className="mt-12">
      <div className="container mx-auto flex gap-16">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold bg-white sticky top-0">
            Select time
          </h1>

          <Dialog>
            <DialogTrigger className="flex gap-2 items-center justify-center border p-2 rounded-full mt-6">
              <RxAvatar className="text-2xl" /> Any Professional{" "}
              <IoChevronDown />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[620px] h-[600px] overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold sticky top-0 bg-white p-4">
                  Neutral Scalp Treatment
                </DialogTitle>
                <DialogDescription>
                  <div className="gap-4 flex flex-wrap">
                    {/* Default 'Any Professional' option */}
                    <ProfileCard
                      title="for maximum availability"
                      professional="Any Professional"
                      isActive={activeProfessional === null} // Highlight if no professional is selected
                      onClick={() => setActiveProfessional(null)} // Deselect any professional
                    />

                    {/* Map through the professionals in 'datas' */}
                    {datas.length > 0 ? (
                      datas.map((i) => (
                        <ProfileCard
                          key={i.id} // Use 'id' as the key instead of 'professional'
                          title={i.name}
                          imageUrl={i.img}
                          professional={i.professional}
                          rating={i.ratting}
                          isActive={activeProfessional?.id === i.id} // Highlight active professional
                          onClick={() => handleProfessionalSelect(i)} // Set active professional
                        />
                      ))
                    ) : (
                      <p className="w-full text-center text-gray-600">
                        No professionals available
                      </p>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <div className="mt-6 flex gap-4">
            {dates.map((date) => (
              <DateSlot
                key={date.id}
                isActive={activeDate === date.id}
                date={date.date}
                day={date.day}
                onClick={() => handleDateClick(date.id)}
              />
            ))}
          </div>

          {activeDate && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Available Times</h2>
              <div className="flex gap-4 flex-wrap">
                {timeSlots[activeDate]?.map((slot, index) => (
                  <TimeSlot
                    key={index}
                    isActive={selectedTime === slot.time}
                    time={slot.time}
                    disabled={slot.booked}
                    onClick={() => handleTimeClick(slot.time)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-[40%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin">
          {selectedTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="flex justify-between items-center mb-4 px-3"
            >
              <div className="w-[50%]">
                <h4>{treatment.selectedOption?.name || treatment.name}</h4>
                <span>{treatment.selectedOption?.time || treatment.time}</span>

                <span className="ml-2">with</span>
              </div>
              <div>
                {treatment.selectedOption?.price ||
                  (treatment.price && (
                    <span>
                      AED {treatment.selectedOption?.price || treatment.price}
                    </span>
                  ))}
              </div>
            </div>
          ))}
          <div className="px-3">
            <Separator className="my-4 px-3" />
          </div>
          <div className="flex justify-between font-bold text-lg px-3">
            <h3>Total</h3>
            <h3>AED {totalPrice}</h3> {/* Display total price */}
          </div>

          <Button
            className="w-full mt-16"
            onClick={() =>
              localStorage.setItem(
                "selectedTreatments",
                JSON.stringify(selectedTreatments)
              )
            }
          >
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SelectTime;

const DateSlot = ({
  isActive,
  date,
  day,
  onClick,
}: {
  isActive: boolean;
  date: string;
  day?: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-col justify-center gap-2 text-center w-[60px] h-[60px]`}
    >
      <div
        className={`text-lg border rounded-full p-4 flex items-center justify-center ${
          isActive ? "bg-[#5C4ACE] text-white" : "bg-gray-200"
        }`}
      >
        {date}
      </div>
      <span className="text-base font-medium">{day}</span>
    </div>
  );
};

const TimeSlot = ({
  isActive,
  time,
  disabled,
  onClick,
}: {
  isActive: boolean;
  time: string;
  disabled: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 border border-[#d3d3d3] rounded-lg hover:bg-[#F5F5F5] text-lg font-semibold text-start ${
        isActive && !disabled
          ? "border-[3px] border-[#5847c7] text-black"
          : "bg-white text-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {time}
    </button>
  );
};
