"use client";
import { useState } from "react";
import data from "../../../data/frisha.json"; // Assuming this is an array of professionals
import ProfileCard from "./profile-card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  addProfession,
  anyProfession,
  updateAllProfession,
} from "@/lib/features/SelectServices/treatmentSlice";
import { useProductStore } from "@/store/use-product-store";

// Defining the type for the professional data
export interface ProfileCardProps {
  id: number;
  name: string;
  professional: string;
  img: string;
  ratting: number;
  skils: string[];
}

export const SelectProfessional = () => {
  const dispatch = useAppDispatch();
  const { selectedTreatments: selectedTreatment } = useProductStore();

  const [datas, setDatas] = useState<ProfileCardProps[]>(data.professional);
  const [selectedProfessional, setSelectedProfessional] =
    useState<ProfileCardProps | null>(null);

  const { selectedTreatments, totalPrice, finaldata } = useAppSelector(
    (state) => state.treatments
  );

  const finalDataPropessionalIds = finaldata.map(
    (item) => item.professional?.id
  );

  const [activeProfessional, setActiveProfessional] =
    useState<ProfileCardProps | null>(null);

  const handleProfessionalSelect = (professional: ProfileCardProps) => {
    setActiveProfessional(professional);
    setSelectedProfessional(professional);
    dispatch(updateAllProfession(professional));
  };

  const onSubmit = () => {
    if (selectedProfessional) {
      localStorage.setItem(
        "selectedTreatments",
        JSON.stringify(selectedTreatments)
      );

      const selectedData = selectedTreatments.map((treatment) => ({
        id: treatment.id,
        name: treatment.selectedOption?.name || treatment.name,
        time: treatment.selectedOption?.time || treatment.time,
        price: treatment.selectedOption?.price || treatment.price,
      }));

      dispatch(addProfession({ selectedProfessional, data: selectedData }));
    } else {
      localStorage.setItem(
        "selectedTreatments",
        JSON.stringify(selectedTreatments)
      );

      const storedTreatments = localStorage.getItem("selectedTreatments");
      if (storedTreatments) {
        const treatments = JSON.parse(storedTreatments);

        const selectedData = selectedTreatments.map((treatment) => ({
          id: treatment.id,
          name: treatment.selectedOption?.name || treatment.name,
          time: treatment.selectedOption?.time || treatment.time,
          price: treatment.selectedOption?.price || treatment.price,
        }));

        dispatch(
          anyProfession({
            anyProfession: true,
            data: selectedData,
          })
        );
      }
    }
  };

  const updateAnyProfession = () => {
    dispatch(
      anyProfession({
        anyProfession: true,
        data: selectedTreatments.map((treatment) => ({
          id: treatment.id,
          name: treatment.selectedOption?.name || treatment.name,
          time: treatment.selectedOption?.time || treatment.time,
          price: treatment.selectedOption?.price || treatment.price,
        })),
      })
    );
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
            onClick={() => {
              setActiveProfessional(null); // Deactivate any active professional
              setSelectedProfessional(null); // Clear the selected professional
              updateAnyProfession();
            }}
          />

          {/* Professional cards */}
          {datas.length > 0 ? (
            datas.map((i) => (
              <ProfileCard
                key={i.id}
                title={i.name}
                imageUrl={i.img}
                professional={i.professional}
                rating={i.ratting}
                isActive={
                  // Pre-selected professional
                  activeProfessional?.id === i.id // Currently clicked professional
                }
                onClick={() => handleProfessionalSelect(i)} // Set the clicked card as active
              />
            ))
          ) : (
            <p className="w-full text-center text-gray-600">
              No professionals available
            </p>
          )}
        </div>
      </div>

      <div className="w-full md:w-[30%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin">
        {selectedTreatment.map((treatment) => (
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
