"use client";
import React, { useEffect, useRef, useState } from "react";
import data from "../../../data/frisha.json";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { TreatmentCard } from "./treatment-card";

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
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update active section during scroll
  useEffect(() => {
    const currentSections = sectionRefs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) {
              setActiveSection(parseInt(id, 10));
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    currentSections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleTreatmentUpdate = (treatment: SelectedTreatment) => {
    setSelectedTreatments((prev) => {
      const exists = prev.find((item) => item.id === treatment.id);
      if (exists) {
        return prev.map((item) =>
          item.id === treatment.id ? treatment : item
        );
      } else {
        return [...prev, treatment];
      }
    });
  };

  const handleTreatmentRemove = (treatmentId: number) => {
    setSelectedTreatments((prev) =>
      prev.filter((item) => item.id !== treatmentId)
    );
  };

  const totalPrice = selectedTreatments.reduce((sum, treatment) => {
    const price = treatment.selectedOption
      ? treatment.selectedOption.price
      : treatment.price;
    return sum + price;
  }, 0);

  const scrollToSection = (index: number) => {
    const target = sectionRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });

      setActiveSection(data.data[index].id);
    }
  };

  return (
    <section>
      <div className="container mx-auto mt-16 flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 px-4 lg-px-0 ">
        <div className="w-full md:w-[60%]">
          {/* Sticky Menu */}
          <div className="flex space-x-6 sticky top-0 left-18 w-full bg-white p-4 shadow-md z-10 overflow-auto">
            <ul className="flex space-x-4 overflow-x-auto">
              {data.data.map((category, index) => (
                <li
                  key={category.id}
                  className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                    activeSection === category.id
                      ? "bg-black text-white"
                      : "text-gray-700 hover:text-black"
                  } flex items-center justify-center`}
                  onClick={() => scrollToSection(index)}
                >
                  <h1 className="text-sm text-center justify-center font-bold max-w-[220px] min-w-[120px] ">
                    {category.name}
                  </h1>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Sections */}
          {data.data.map((category, index) => (
            <div
              key={category.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              data-id={category.id}
              className="pt-20"
            >
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
          ))}
        </div>

        {/* Selected Treatments Sidebar */}
        <div className="w-full md:w-[35%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin ">
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
    </section>
  );
};
