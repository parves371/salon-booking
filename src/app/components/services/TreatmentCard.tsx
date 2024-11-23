"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface Treatment {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: {
    id: number;
    name: string;
    time: string;
    price: number;
  }[];
}

interface TreatmentCardProps {
  treatment: Treatment;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  const [isActive, setIsActive] = useState(true);
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 flex items-center justify-between ${
        isActive ? "border-[3px] border-[#6950f3]" : ""
      }`}
    >
      <div>
        <h2 className="text-xl font-bold mb-2">{treatment.name}</h2>
        <p className="text-gray-700 mb-4">{treatment.time}</p>
        <p className="text-gray-700 mb-4">AED {treatment.price}</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={` ${
              isActive
                ? "bg-[#6950f3] text-white hover"
                : "bg-[#f2f2f2] text-black"
            }    font-bold p-2 rounded`}
          >
            <FiPlus size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-3xl">Dry Scalp Treatment</DialogTitle>
            <DialogDescription className="text-xl pt-6">
              Select an option *
            </DialogDescription>
          </DialogHeader>

          <RadioGroup defaultValue="option-one">
            { treatment.option && treatment.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-4 space-y-6 hover:bg-accent hover:text-accent-foreground p-4`}
              >
                <RadioGroupItem value={option.name} id={option.name} />
                <div className="w-full ">
                  <Label
                    htmlFor={option.name}
                    className="leading-none space-y-1 w-full cursor-pointer block "
                  >
                    <p className="text-xl font-bold">{option.name}</p>
                    <p className="text-gray-500 text-base font-medium">
                      {option.time}
                    </p>
                    <p className="text-gray-500 text-lg font-bold">
                      AED {option.price}
                    </p>
                  </Label>
                </div>
              </div>
            ))}

            {!treatment.option && (
              <div className="flex items-center space-x-4 space-y-6 hover:bg-accent hover:text-accent-foreground p-4">
                <RadioGroupItem value="option-one" id="option-one" />
                <div className="w-full ">
                  <Label
                    htmlFor="option-one"
                    className="leading-none space-y-1 w-full cursor-pointer block "
                  >
                    <p className="text-xl font-bold">
                      {treatment.name}
                    </p>
                    <p className="text-gray-500 text-base font-medium">
                      {treatment.time}
                    </p>
                    <p className="text-gray-500 text-lg font-bold">
                      AED {treatment.price}
                    </p>
                  </Label>
                </div>
              </div>
            )}
          </RadioGroup>

          <div className="flex justify-between">
            <Button className="mt-6 w-full">Add</Button>
            <Button className="mt-6 ml-4 w-full">Remove</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreatmentCard;
