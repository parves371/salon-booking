"use client";
import { useStaff } from "@/hooks/use-staff";
import { useProductStore } from "@/store/use-product-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProfileCard from "./profile-card";

// Defining the type for the professional data
interface StaffProps {
  available: boolean;
  id: number;
  name: string;
  position: string;
  role: string;
  skills: string[] | null; // Assuming 'skills' could be an array of strings or null
}

export const SelectProfessional = () => {
  // const [selectedTreatments, setSelectedTreatments] = useState<any[]>([]);
  const { selectedTreatments: selectedTreatments } = useProductStore();
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeProfessional, setActiveProfessional] =
    useState<StaffProps | null>(null);

  const selectedTreatmentName = selectedTreatments
    .map((treatment) => treatment.selectedOption?.name.trim())
    .filter((name) => name !== undefined);
  const { data } = useStaff(
    selectedTreatmentName.length > 0 ? selectedTreatmentName : undefined
  );

  const handleProfessionalSelect = (professional: StaffProps) => {
    setActiveProfessional(professional);
  };

  console.log("data", data);

  const updateAnyProfessional = () => {
    setActiveProfessional(null);
  };

  const onSubmit = () => {
    const selectedData = selectedTreatments.map((treatment) => ({
      id: treatment.id,
      name: treatment.selectedOption?.name || treatment.name,
      time: treatment.selectedOption?.time || treatment.time,
      price: treatment.selectedOption?.price || treatment.price,
      professional: activeProfessional || { name: "Any Professional" },
    }));

    console.log("Submitted Data:", selectedData);
    // You can handle the submitted data here (e.g., send to an API)
  };

  return (
    <section className="flex container mx-auto">
      <div className="w-[70%]">
        <h1 className="text-4xl font-bold sticky top-0 mt-2 bg-white p-4">
          Select Professional
        </h1>

        <div className="gap-4 flex flex-wrap">
          {/* "Any Professional" card */}
          <ProfileCard
            title="for maximum availability"
            professional="Any Professional"
            isActive={activeProfessional === null}
            onClick={updateAnyProfessional}
          />

          {/* Professional cards */}
          {data?.data?.map((i: StaffProps) => (
            <ProfileCard
              key={i.id}
              title={i.name}
              professional={i.position}
              isActive={activeProfessional?.id === i.id}
              onClick={() => handleProfessionalSelect(i)}
            />
          ))}
        </div>
      </div>

      <div className="w-full md:w-[30%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin">
        {selectedTreatments.map((treatment) => (
          <div
            key={treatment.id}
            className="flex justify-between items-center mb-4 px-3"
          >
            <div className="w-[70%]">
              <h4 className="">
                {treatment.selectedOption?.name || treatment.name}
              </h4>
              <span>{treatment.selectedOption?.time || treatment.time}</span>
              <span className="mx-2">with</span>
              <span className="text-[#7C6DD8] font-semibold text-sm">
                {activeProfessional?.name || "Any Professional"}
              </span>
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

        <Button className="w-full mt-16" onClick={onSubmit}>
          Continue
        </Button>
      </div>
    </section>
  );
};
