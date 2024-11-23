"use client";
import React, { useState } from "react";
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
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    name: string;
    time: string;
    price: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasBeenSelected, setHasBeenSelected] = useState(false);

  const handleOptionSelect = (option: {
    name: string;
    time: string;
    price: number;
  }) => {
    setSelectedOption(option);
  };

  const handleAdd = () => {
    if (selectedOption) {
      console.log("Added treatment:", {
        ...treatment,
        selectedOption
      });
    } else {
      console.log("Added treatment:", treatment);
    }
    setIsActive(true);
    setHasBeenSelected(true);
    setIsDialogOpen(false);
  };

  const handleUpgrade = () => {
    if (selectedOption) {
      console.log("Upgraded treatment:", {
        ...treatment,
        selectedOption
      });
    }
    setIsActive(true);
    setIsDialogOpen(false);
  };

  const handleRemove = () => {
    setSelectedOption(null);
    setIsActive(false);
    setHasBeenSelected(false);
    console.log("Removed treatment:", treatment);
    setIsDialogOpen(false);
  };

  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 flex items-center justify-between ${
        isActive ? "border-[3px] border-[#6950f3]" : ""
      }`}
    >
      <div>
        <h2 className="text-xl font-bold mb-2">
          {selectedOption ? selectedOption.name : treatment.name}
        </h2>
        <p className="text-gray-700 mb-4">
          {selectedOption ? selectedOption.time : treatment.time}
        </p>
        <p className="text-gray-700 mb-4">
          AED {selectedOption ? selectedOption.price : treatment.price}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className={`${
              isActive
                ? "bg-[#6950f3] text-white hover:bg-[#5840d9]"
                : "bg-[#f2f2f2] text-black hover:bg-[#e5e5e5]"
            } font-bold p-2 rounded`}
          >
            <FiPlus size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-3xl">
              {hasBeenSelected ? "Upgrade Treatment" : treatment.name}
            </DialogTitle>
            <DialogDescription className="text-xl pt-6">
              {hasBeenSelected ? "Select an upgrade option" : `Select an option ${treatment.option ? "*" : ""}`}
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            defaultValue={selectedOption?.name || ""}
            onValueChange={(value) => {
              if (treatment.option) {
                const option = treatment.options.find((opt) => opt.name === value);
                if (option) {
                  handleOptionSelect(option);
                }
              } else {
                handleOptionSelect({
                  name: treatment.name,
                  time: treatment.time,
                  price: treatment.price,
                });
              }
            }}
          >
            {treatment.option &&
              treatment.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-4 space-y-6 hover:bg-accent hover:text-accent-foreground p-4"
                >
                  <RadioGroupItem value={option.name} id={option.name} />
                  <div className="w-full">
                    <Label
                      htmlFor={option.name}
                      className="leading-none space-y-1 w-full cursor-pointer block"
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
                <RadioGroupItem value={treatment.name} id={treatment.name} />
                <div className="w-full">
                  <Label
                    htmlFor={treatment.name}
                    className="leading-none space-y-1 w-full cursor-pointer block"
                  >
                    <p className="text-xl font-bold">{treatment.name}</p>
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

          <div className="flex justify-between gap-4">
            {!hasBeenSelected ? (
              // First time - only show Add button
              <Button 
                className="mt-6 w-full" 
                onClick={handleAdd}
                disabled={!selectedOption && treatment.option}
              >
                Add
              </Button>
            ) : (
              // After selection - show Remove and Upgrade buttons
              <>
                <Button 
                  className="mt-6 w-full bg-red-500 hover:bg-red-600" 
                  onClick={handleRemove}
                >
                  Remove
                </Button>
                <Button 
                  className="mt-6 w-full" 
                  onClick={handleUpgrade}
                  disabled={!selectedOption && treatment.option}
                >
                  Upgrade
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreatmentCard;