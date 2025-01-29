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
import { useProductStore } from "@/store/use-product-store";
import { priceCurrency } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

// Types for services and options
interface ServicesOption {
  id: number;
  name: string;
  time: string;
  price: number;
}

interface Services {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: ServicesOption[];
  selectedOption?: ServicesOption;
}

interface TreatmentCardProps {
  services: Services;
  onTreatmentUpdate: (
    services: Services & { selectedOption?: ServicesOption }
  ) => void;
  onTreatmentRemove: (treatmentId: number) => void;
  isActive: boolean;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  services,
  onTreatmentUpdate,
  onTreatmentRemove,
  isActive,
}) => {
  const [selectedOption, setSelectedOption] = useState<ServicesOption | undefined>(
    services.selectedOption
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasBeenSelected, setHasBeenSelected] = useState(false);

  const { addOrUpdateTreatment, removeTreatment, selectedTreatments } =
    useProductStore();

  // When component mounts, check if this treatment is already selected and set the default option
  useEffect(() => {
    const existingTreatment = selectedTreatments.find(
      (t) => t.id === services.id
    );
    if (existingTreatment?.selectedOption) {
      setSelectedOption(existingTreatment.selectedOption);
    }
  }, [selectedTreatments, services.id]);

  const handleOptionSelect = (option: ServicesOption) => {
    setSelectedOption(option);
  };

  const handleAddOrUpdate = () => {
    const updatedService = { ...services, selectedOption };
    addOrUpdateTreatment(updatedService);
    onTreatmentUpdate(updatedService);
    setHasBeenSelected(true);
    setIsDialogOpen(false);
  };

  const handleRemove = () => {
    removeTreatment(services.id);
    onTreatmentRemove(services.id);
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
                {selectedOption ? selectedOption.name : services.name}
              </h2>
              <p className="mb-4 text-[#908291]">
                {selectedOption ? selectedOption.time : services.time}
              </p>
              <p className="mb-4 text-[#212c43] font-semibold">
                {priceCurrency.currency}{" "}
                {selectedOption ? selectedOption.price : services.price}
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

        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-3xl">
              {hasBeenSelected ? "Upgrade Services" : services.name}
            </DialogTitle>
            <DialogDescription className="text-xl pt-6">
              {hasBeenSelected
                ? "Select an upgrade option"
                : `Select an option ${services.option ? "*" : ""}`}
            </DialogDescription>
          </DialogHeader>

          {/* ✅ Set default selected option correctly */}
          <RadioGroup
            className={`${
              services.option ? "h-[400px] overflow-auto scrollbar-hidden" : ""
            }`}
            value={selectedOption?.name || ""}
            onValueChange={(value) => {
              if (services.option) {
                const option = services.options.find(
                  (opt) => opt.name === value
                );
                if (option) {
                  handleOptionSelect(option);
                }
              } else {
                handleOptionSelect({
                  id: services.id,
                  name: services.name,
                  time: services.time,
                  price: services.price,
                });
              }
            }}
          >
            {services.option && (
              <div>
                {services.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-4 space-y-6 hover:bg-accent hover:text-accent-foreground px-4"
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
                          {priceCurrency.currency} {option.price}
                        </p>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!services.option && (
              <div className="flex items-center space-x-4 space-y-6 hover:bg-accent hover:text-accent-foreground p-4">
                <RadioGroupItem value={services.name} id={services.name} />
                <div className="w-full">
                  <Label
                    htmlFor={services.name}
                    className="leading-none space-y-1 w-full cursor-pointer block py-4"
                  >
                    <p className="text-xl font-bold">{services.name}</p>
                    <p className="text-gray-500 text-base font-medium">
                      {services.time}
                    </p>
                    <p className="text-gray-500 text-lg font-bold">
                      {priceCurrency.currency} {services.price}
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
                onClick={handleAddOrUpdate}
                disabled={!selectedOption && services.option}
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
                  onClick={handleAddOrUpdate}
                  disabled={!selectedOption && services.option}
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
