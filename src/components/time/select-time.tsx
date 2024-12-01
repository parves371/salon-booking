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

const SelectTime = () => {
  const [datas, setDatas] = useState<ProfileCardProps[]>(data.professional);
  const [activeDate, setActiveDate] = useState<string | null>(null);
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

  return (
    <section className="mt-12">
      <div className="container mx-auto">
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
                    <ProfileCard
                      title="for maximum availability"
                      professional="Any Professional"
                    />
                    {datas.length > 0 ? (
                      datas.map((i) => (
                        <ProfileCard
                          key={i.id}
                          title={i.name}
                          imageUrl={i.img}
                          professional={i.professional}
                          rating={i.ratting}
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
        <div className="w-1/2"></div>
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
