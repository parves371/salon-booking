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

// Types for the props and treatments
interface TreatmentOption {
  id: number;
  name: string;
  time: string;
  price: number;
}

interface Treatment {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: TreatmentOption[];
}

interface TreatmentCardProps {
  treatment: Treatment;
  onTreatmentUpdate: (
    treatment: Treatment & { selectedOption?: TreatmentOption }
  ) => void;
  onTreatmentRemove: (treatmentId: number) => void;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  onTreatmentUpdate,
  onTreatmentRemove,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TreatmentOption | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasBeenSelected, setHasBeenSelected] = useState(false);

  const handleOptionSelect = (option: TreatmentOption) => {
    setSelectedOption(option);
  };

  const handleAdd = () => {
    const selectedData = selectedOption
      ? { ...treatment, selectedOption }
      : treatment;
    onTreatmentUpdate(selectedData);
    setIsActive(true);
    setHasBeenSelected(true);
    setIsDialogOpen(false);
  };

  const handleUpgrade = () => {
    const updatedData = selectedOption
      ? { ...treatment, selectedOption }
      : treatment;
    onTreatmentUpdate(updatedData);
    setIsDialogOpen(false);
  };

  const handleRemove = () => {
    onTreatmentRemove(treatment.id);
    setSelectedOption(null);
    setIsActive(false);
    setHasBeenSelected(false);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div
        className={`bg-white shadow-md rounded-lg py-3 px-6 flex items-center justify-between ${
          isActive
            ? "border-[3px] border-[#6950f3]"
            : "border-[1px] border-[#ececec]"
        } hover:bg-[#F5F5F5]`}
      >
        <DialogTrigger asChild>
          <div className="flex items-center justify-between w-full cursor-pointer">
            <div>
              <h2 className="text-lg font-bold mb-2 text-[#212c43]">
                {selectedOption ? selectedOption.name : treatment.name}
              </h2>
              <p className="mb-4 text-[#908291]">
                {selectedOption ? selectedOption.time : treatment.time}
              </p>
              <p className="mb-4 text-[#212c43] font-semibold">
                AED {selectedOption ? selectedOption.price : treatment.price}
              </p>
            </div>
            <Button
              className={`${
                isActive
                  ? "bg-[#6950f3] text-white hover:bg-[#5840d9]"
                  : "bg-[#f2f2f2] text-black hover:bg-[#e5e5e5]"
              } font-bold p-2 rounded`}
            >
              <FiPlus size={20} />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]  ">
          <DialogHeader className="">
            <DialogTitle className="text-3xl">
              {hasBeenSelected ? "Upgrade Treatment" : treatment.name}
            </DialogTitle>
            <DialogDescription className="text-xl pt-6">
              {hasBeenSelected
                ? "Select an upgrade option"
                : `Select an option ${treatment.option ? "*" : ""}`}
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            className={`${
              treatment.option ? "h-[400px] overflow-auto scrollbar-hidden" : ""
            }`}
            defaultValue={selectedOption?.name || ""}
            onValueChange={(value) => {
              if (treatment.option) {
                const option = treatment.options.find(
                  (opt) => opt.name === value
                );
                if (option) {
                  handleOptionSelect(option);
                }
              } else {
                handleOptionSelect({
                  id: treatment.id,
                  name: treatment.name,
                  time: treatment.time,
                  price: treatment.price,
                });
              }
            }}
          >
            {treatment.option && (
              <div className="">
                {treatment.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-4 space-y-6  hover:bg-accent hover:text-accent-foreground px-4"
                  >
                    <RadioGroupItem value={option.name} id={option.name} />
                    <div className="w-full">
                      <Label
                        htmlFor={option.name}
                        className="leading-none space-y-1 w-full cursor-pointer block p-4"
                      >
                        <p className="text-base font-bold">{option.name}</p>
                        <p className="text-gray-500 text-base font-medium">
                          {option.time}
                        </p>
                        <p className="text-gray-500 text-base font-bold">
                          AED {option.price}
                        </p>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!treatment.option && (
              <div className="flex items-center space-x-4 space-y-6 hover:bg-accent hover:text-accent-foreground p-4">
                <RadioGroupItem value={treatment.name} id={treatment.name} />
                <div className="w-full">
                  <Label
                    htmlFor={treatment.name}
                    className="leading-none space-y-1 w-full cursor-pointer block py-4"
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
              <Button
                className="mt-6 w-full"
                onClick={handleAdd}
                disabled={!selectedOption && treatment.option}
              >
                Add
              </Button>
            ) : (
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
      </div>
    </Dialog>
  );
};

export default TreatmentCard;
