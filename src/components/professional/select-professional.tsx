"use client";
import { useStaff } from "@/hooks/use-staff";
import { useProductStore } from "@/store/use-product-store";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProfileCard from "./profile-card";
import { LoaderIcon } from "lucide-react";
import { useServicesStore } from "@/store/use-professional-store";
import { useRouter } from "next/navigation";

// Defining the type for the professional data
export interface StaffProps {
  available: boolean;
  id: number;
  name: string;
  position: string;
  role: string;
  skills: string[] | null; // Assuming 'skills' could be an array of strings or null
}

interface Services {
  id: number;
  name: string;
  time: string;
  price: number; // Ensure price is treated as a number here as well
}

export const SelectProfessional = () => {
  const router = useRouter();
  const { selectedTreatments } = useProductStore();
  const [totalPrice, setTotalPrice] = useState(0);
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

  useEffect(() => {
    // Update total price when selected treatments or active professional changes
    const total = selectedTreatments.reduce((acc, treatment) => {
      const price = treatment.selectedOption?.price || treatment.price;
      return acc + price; // price is already a number now
    }, 0);
    setTotalPrice(total);
  }, [selectedTreatments, activeProfessional]);

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

    // Access the addTreatment function from Zustand store
    const { addTreatment, updateProfessional } = useServicesStore.getState();

    // Save the selected data to Zustand store
    selectedData.forEach((treatment) => {
      // If the treatment already exists in the store, update its professional
      const existingTreatment = useServicesStore
        .getState()
        .services.find((service) => service.id === treatment.id);

      if (existingTreatment) {
        // If the treatment exists, update the professional for that treatment
        updateProfessional(treatment.id, treatment.professional);
      } else {
        // If the treatment doesn't exist, add a new one
        addTreatment(treatment);
      }
    });

    router.push("/time");
  };

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
