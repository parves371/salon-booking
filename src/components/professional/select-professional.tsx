"use client";
import { use, useState } from "react";
import data from "../../../data/frisha.json"; // Assuming this is an array of professionals
import ProfileCard from "./profile-card"; // Make sure this is the correct path to the ProfileCard component
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  addProfession,
  anyProfession,
  updateTotalPrice,
} from "@/lib/features/SelectServices/treatmentSlice";

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

  // Directly using the professional array in the state
  const [datas, setDatas] = useState<ProfileCardProps[]>(data.professional);
  const [selectedProfessional, setSelectedProfessional] = // Fixed the name here
    useState<ProfileCardProps | null>(null);
  const { selectedTreatments, totalPrice } = useAppSelector(
    (state) => state.treatments // Redux state for selected treatments
  );
  const [activeProfessional, setActiveProfessional] =
    useState<ProfileCardProps | null>(null); // Track selected professional

  // Handle professional selection and store data
  const handleProfessionalSelect = (professional: ProfileCardProps) => {
    setActiveProfessional(professional); // Set the clicked professional as active
    setSelectedProfessional(professional); // Update the selected professional state
  };

  // Save to localStorage
  const onSubmit = () => {
    if (selectedProfessional) {
      // Save selected treatments to localStorage
      localStorage.setItem(
        "selectedTreatments",
        JSON.stringify(selectedTreatments)
      );
  
      // Prepare the selected treatments data for dispatch
      const selectedData = selectedTreatments.map((treatment) => ({
        id: treatment.id,
        name: treatment.selectedOption?.name || treatment.name,
        time: treatment.selectedOption?.time || treatment.time,
        price: treatment.selectedOption?.price || treatment.price,
      }));
  
      // Dispatch action to add the professional and associated treatments
      dispatch(addProfession({ selectedProfessional, data: selectedData }));
    } else {
      dispatch(anyProfession(true));
    }
  };
  
  return (
    <section className="flex container mx-auto">
      <div className="w-[70%]">
        <h1 className="text-4xl font-bold sticky top-0 mt-2 bg-white p-4">
          Select Professional
        </h1>

        <div className="gap-4 flex flex-wrap">
          {/* Default 'Any Professional' option */}
          <ProfileCard
            title="for maximum availability"
            professional="Any Professional"
            isActive={activeProfessional === null} // Highlight if no professional is selected
            onClick={() => {
              setActiveProfessional(null);
              setSelectedProfessional(null); // Deselect any professional
            }}
          />

          {/* Map through the professionals in 'datas' */}
          {datas.length > 0 ? (
            datas.map((i) => (
              <ProfileCard
                key={i.id} // Use 'id' as the key instead of 'professional'
                title={i.name}
                imageUrl={i.img}
                professional={i.professional}
                rating={i.ratting}
                isActive={activeProfessional?.id === i.id} // Highlight active professional
                onClick={() => handleProfessionalSelect(i)} // Set active professional
              />
            ))
          ) : (
            <p className="w-full text-center text-gray-600">
              No professionals available
            </p>
          )}
        </div>
      </div>

      {/* Selected Professional Section */}
      <div className="w-full md:w-[30%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin">
        {/* Treatments and Total Price */}
        {selectedTreatments.map((treatment) => (
          <div
            key={treatment.id}
            className="flex justify-between items-center mb-4 px-3"
          >
            <div className="w-[50%]">
              <h4>{treatment.selectedOption?.name || treatment.name}</h4>
              <span>{treatment.selectedOption?.time || treatment.time}</span>
              <span className="ml-2">with</span>

              <span className="text-[#7C6DD8] font-semibold text-sm">
                {" "}
                {activeProfessional?.name
                  ? activeProfessional?.name
                  : "Any Professional"}{" "}
              </span>
            </div>
            <div>
              {treatment.selectedOption?.price ||
                (treatment.price && (
                  <span>
                    AED {treatment.selectedOption?.price || treatment.price}
                  </span>
                ))}
            </div>
          </div>
        ))}

        <div className="px-3">
          <Separator className="my-4 px-3" />
        </div>

        <div className="flex justify-between font-bold text-lg px-3">
          <h3>Total</h3>
          <h3>AED {totalPrice}</h3> {/* Display total price */}
        </div>

        <Button className="w-full mt-16" onClick={onSubmit}>
          Continue
        </Button>
      </div>
    </section>
  );
};
