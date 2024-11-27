"use client";
import { useState } from "react";
import data from "../../../data/frisha.json"; // Assuming this is an array of professionals
import ProfileCard from "./profile-card"; // Make sure this is the correct path to the ProfileCard component

// Defining the type for the professional data
// Correct the ProfileCardProps type to describe the structure of each individual professional
interface ProfileCardProps {
  id: number;
  name: string;
  professional: string;
  img: string;
  ratting: number;
  skils: string[];
}


export const SelectProfessional = () => {
  // Directly using the professional array in the state
  const [datas, setDatas] = useState<ProfileCardProps[]>(data.professional);

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
            <p className="w-full text-center text-gray-600">No professionals available</p>
          )}
        </div>
      </div>
      <div className="w-[30%]"></div>
    </section>
  );
};
