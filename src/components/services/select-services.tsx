"use client";
import React, { useState } from "react";
import TreatmentCard from "@/app/components/services/TreatmentCard";
import data from "../../../data/frisha.json";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

// Define the types for treatments and options
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

interface SelectedTreatment extends Treatment {
  selectedOption?: TreatmentOption;
}

export const SelectServices: React.FC = () => {
  const [selectedTreatments, setSelectedTreatments] = useState<
    SelectedTreatment[]
  >([]);

  const handleTreatmentUpdate = (treatment: SelectedTreatment) => {
    setSelectedTreatments((prev) => {
      const exists = prev.find((item) => item.id === treatment.id);
      if (exists) {
        // Replace the existing treatment with the updated one
        return prev.map((item) =>
          item.id === treatment.id ? treatment : item
        );
      } else {
        // Add the new treatment
        return [...prev, treatment];
      }
    });
  };

  const handleTreatmentRemove = (treatmentId: number) => {
    setSelectedTreatments((prev) =>
      prev.filter((item) => item.id !== treatmentId)
    );
  };

  // Calculate total price
  const totalPrice = selectedTreatments.reduce((sum, treatment) => {
    const price = treatment.selectedOption
      ? treatment.selectedOption.price
      : treatment.price;
    return sum + price;
  }, 0);

  console.log(
    "Selected Treatments:",
    selectedTreatments.map((t) => t.selectedOption)
  );

  return (
    <div className="container mx-auto mt-16 flex justify-between">
      <div className="w-[60%]">
        {data.data.map(
          (category: { id: number; name: string; items: Treatment[] }) => (
            <div key={category.id}>
              <h1 className="text-2xl font-bold my-4">{category.name}</h1>
              <div className="space-y-6">  
                {category.items.map((treatment) => (
                  <TreatmentCard
                    key={treatment.id}
                    treatment={treatment}
                    onTreatmentUpdate={handleTreatmentUpdate}
                    onTreatmentRemove={handleTreatmentRemove}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>
      <div className="w-[30%] border border-gray-600 rounded-lg p-4 h-[600px]">
        {selectedTreatments.map((treatment) => (
          <div
            key={treatment.id}
            className="flex justify-between items-center mb-4 px-3"
          >
            <div>
              <h4>{treatment.selectedOption?.name || treatment.name}</h4>
              <span>{treatment.selectedOption?.time || treatment.time}</span>
            </div>
            <div>
              <span>
                AED {treatment.selectedOption?.price || treatment.price}
              </span>
            </div>
          </div>
        ))}
        <div className="px-3">
          <Separator className="my-4 px-3" />
        </div>
        <div className="flex justify-between font-bold text-lg px-3">
          <h3>Total</h3>
          <h3>AED {totalPrice}</h3>
        </div>

        <Button className="w-full mt-16">Continue</Button>
      </div>
    </div>
  );
};
