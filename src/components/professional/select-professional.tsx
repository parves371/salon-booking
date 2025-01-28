"use client";
import { useStaff } from "@/hooks/use-staff";
import { useProductStore } from "@/store/use-product-store";
import { useServicesStore } from "@/store/use-professional-store";
import { priceCurrency } from "@/utils/constants";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProfileCard from "./profile-card";
import { useWizardStore } from "@/store/wizardStore";

export interface StaffProps {
  available: boolean;
  id: number;
  name: string;
  position: string;
  role: string;
  avatar_path: string;
  skills: string[] | null;
}

export const SelectProfessional = () => {
  const router = useRouter();
  const { selectedTreatments, getTotalPrice } = useProductStore();
  const [activeProfessional, setActiveProfessional] =
    useState<StaffProps | null>(null);

  // remove local isActiveProfessional if you want derived logic
  const [isActiveProfessional, setIsActiveProfessional] = useState(false);

  const selectedTreatmentName = selectedTreatments
    .map((treatment) => treatment.selectedOption?.name.trim())
    .filter((name) => name !== undefined);

  const { step, setStep } = useWizardStore();

  // Access store
  const hasHydrated = useWizardStore.persist.hasHydrated;

  // If the user hasn't completed step1, redirect them back to appointments
  useEffect(() => {
    if (!hasHydrated) return;
    if (step < 2) {
      router.replace("/appointment");
    }
  }, [step, router, hasHydrated]);

  // Derived logic: does services array already have a professional?
  // (Optional: remove entirely if you don't need it.)

  // Staff fetching
  const { data, isLoading, error, isError } = useStaff(
    selectedTreatmentName.length > 0 ? selectedTreatmentName : undefined
  );

  const handleProfessionalSelect = (professional: StaffProps) => {
    setActiveProfessional(professional);
    setIsActiveProfessional(true);
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
            id: -1,
            name: "Any Professional",
            position: "N/A",
            available: true,
            skills: [],
            role: "N/A",
          },
    }));

    // Update state in store
    selectedData.forEach((treatment) => {
      const { addTreatment, updateTreatmentById } = useServicesStore.getState();
      const existingTreatment = useServicesStore
        .getState()
        .services.find((service) => service.id === treatment.id);

      if (existingTreatment) {
        updateTreatmentById(treatment.id, treatment);
      } else {
        addTreatment(treatment);
      }
    });

    // Mark step=3, move to time
    setStep(3);
    router.push("/time");
  };

  function handleBackToStep1() {
    // If you want to force the user to re-complete step1,
    // then set step=1 so they cannot skip to step2 or step3
    setStep(1);
    router.push("/appointment");
  }
  // total price
  const totalPrice = getTotalPrice();

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
          {data?.data?.length > 0 ? (
            data.data.map((i: StaffProps) => {
              // Could also check if i.id is in the store
              const isActive = activeProfessional?.id === i.id;

              return (
                <ProfileCard
                  key={i.id}
                  imageUrl={i.avatar_path}
                  title={i.name}
                  professional={i.position}
                  isActive={isActive}
                  onClick={() => handleProfessionalSelect(i)}
                />
              );
            })
          ) : (
            <div className="text-center py-10">
              <div className="bg-white rounded-lg shadow-md py-4 w-[240px] overflow-hidden cursor-pointer">
                <div className="flex justify-center pt-6">{/* ... */}</div>
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
              <h4>{treatment.selectedOption?.name || treatment.name}</h4>
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
          disabled={!isActiveProfessional}
        >
          Continue
        </Button>
      </div>
    </section>
  );
};
