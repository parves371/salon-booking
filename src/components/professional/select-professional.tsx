"use client";
import { use, useEffect, useState } from "react";
import data from "../../../data/frisha.json"; // Assuming this is an array of professionals
import ProfileCard from "./profile-card"; // Make sure this is the correct path to the ProfileCard component
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { updateTotalPrice } from "@/lib/features/SelectServices/treatmentSlice";

// Defining the type for the professional data
// Correct the ProfileCardProps type to describe the structure of each individual professional
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
  const { selectedTreatments, totalPrice } = useAppSelector(
    (state) => state.treatments // Redux state for selected treatments
  );

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
        {selectedTreatments.map((treatment) => (
          <div
            key={treatment.id}
            className="flex justify-between items-center mb-4 px-3"
          >
            <div className="w-[50%]">
              <h4>{treatment.selectedOption?.name || treatment.name}</h4>
              <span>{treatment.selectedOption?.time || treatment.time}</span>
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

        <Button
          className="w-full mt-16"
          onClick={() =>
            localStorage.setItem(
              "selectedTreatments",
              JSON.stringify(selectedTreatments)
            )
          }
        >
          Continue
        </Button>
      </div>
    </section>
  );
};
