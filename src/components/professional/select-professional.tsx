"use client";
import { useStaff } from "@/hooks/use-staff";
import { useProductStore } from "@/store/use-product-store";
import { useServicesStore } from "@/store/use-professional-store";
import { priceCurrency } from "@/utils/constants";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProfileCard from "./profile-card";

// Defining the type for the professional data
export interface StaffProps {
  available: boolean;
  id: number;
  name: string;
  position: string;
  role: string;
  skills: string[] | null; // Assuming 'skills' could be an array of strings or null
}

export const SelectProfessional = () => {
  const router = useRouter();
  const { selectedTreatments, getTotalPrice } = useProductStore();
  const [activeProfessional, setActiveProfessional] =
    useState<StaffProps | null>(null);

  const selectedTreatmentName = selectedTreatments
    .map((treatment) => treatment.selectedOption?.name.trim())
    .filter((name) => name !== undefined);

  const { data, isLoading, error, isError } = useStaff(
    selectedTreatmentName.length > 0 ? selectedTreatmentName : undefined
  );

  const handleProfessionalSelect = (professional: StaffProps) => {
    setActiveProfessional(professional);
  };

  const updateAnyProfessional = () => {
    setActiveProfessional(null);
  };

  const onSubmit = () => {
    const selectedData = selectedTreatments.map((treatment) => ({
      id: treatment.id,
      name: treatment.selectedOption?.name || treatment.name,
      time: treatment.selectedOption?.time || treatment.time,
      price: treatment.selectedOption?.price || treatment.price,
      professional: activeProfessional
        ? activeProfessional
        : {
            id: -1, // Placeholder ID
            name: "Any Professional",
            position: "N/A",
            available: true,
            skills: [],
            role: "N/A", // Default role
          },
    }));

    selectedData.forEach((treatment) => {
      // Update treatment with new professional and other details
      const { addTreatment, updateTreatmentById } = useServicesStore.getState();

      const existingTreatment = useServicesStore
        .getState()
        .services.find((service) => service.id === treatment.id);

      if (existingTreatment) {
        // If the treatment exists, update the whole treatment
        updateTreatmentById(treatment.id, treatment); // Update everything (name, time, price, professional)
      } else {
        // If it doesn't exist, add a new treatment
        addTreatment(treatment); // Add treatment if it doesn't exist
      }
    });

    // After submitting, go to the next step (e.g., /time)
    router.push("/time");
  };
  // Calculate total price
  const totalPrice = getTotalPrice(); // Calculate total price on every render that could affect it
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderIcon className="size-5 spin-in-1" />
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <section className="flex container mx-auto pt-12 pb-72">
      <div className="w-[70%]">
        <h1 className="text-4xl font-bold sticky top-0 mt-2 bg-white p-4">
          Select Professional
        </h1>

        <div className="gap-4 flex flex-wrap">
          {/* "Any Professional" card
          <ProfileCard
            title="for maximum availability"
            professional="Any Professional"
            isActive={activeProfessional === null}
            onClick={updateAnyProfessional}
          /> */}

          {/* Professional cards */}
          {data?.data?.length > 0 ? (
            <div className="gap-4 flex flex-wrap">
              {data.data.map((i: StaffProps) => (
                <ProfileCard
                  key={i.id}
                  title={i.name}
                  professional={i.position}
                  isActive={activeProfessional?.id === i.id}
                  onClick={() => handleProfessionalSelect(i)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-white rounded-lg shadow-md py-4 w-[240px] overflow-hidden cursor-pointer">
                <div className="flex justify-center pt-6">
                  <div className="rounded-full h-24 w-24 bg-gray-200 flex items-center justify-center">
                    <svg
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      width={62}
                      height={62}
                    >
                      <path d="M30.6 18.8a1 1 0 0 1-1.4-.2A6.45 6.45 0 0 0 24 16a1 1 0 0 1 0-2 3 3 0 1 0-2.905-3.75 1 1 0 0 1-1.937-.5 5 5 0 1 1 8.217 4.939 8.5 8.5 0 0 1 3.429 2.71A1 1 0 0 1 30.6 18.8m-6.735 7.7a1 1 0 1 1-1.73 1 7.125 7.125 0 0 0-12.27 0 1 1 0 1 1-1.73-1 9 9 0 0 1 4.217-3.74 6 6 0 1 1 7.296 0 9 9 0 0 1 4.217 3.74M16 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-7-7a1 1 0 0 0-1-1 3 3 0 1 1 2.905-3.75 1 1 0 0 0 1.938-.5 5 5 0 1 0-8.218 4.939 8.5 8.5 0 0 0-3.425 2.71A1 1 0 1 0 2.8 18.6 6.45 6.45 0 0 1 8 16a1 1 0 0 0 1-1"></path>
                    </svg>
                  </div>
                </div>
                <div className="text-center py-2 px-2 overflow-hidden">
                  <h2 className="text-lg font-semibold text-gray-800">
                    No professionals available.
                  </h2>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" w-full md:w-[30%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky top-10 bottom-0 bg-white scrollbar-thin">
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
                {priceCurrency.currency}{" "}
                {treatment.selectedOption?.price || treatment.price}
              </span>
            </div>
          </div>
        ))}

        <div className="px-3">
          <Separator className="my-4 px-3" />
        </div>

        <div className="flex justify-between font-bold text-lg px-3">
          <h3>Total</h3>
          <h3>
            {priceCurrency.currency} {totalPrice}
          </h3>
        </div>

        <Button
          className="w-full mt-16"
          onClick={onSubmit}
          disabled={!activeProfessional}
        >
          Continue
        </Button>
      </div>
    </section>
  );
};
