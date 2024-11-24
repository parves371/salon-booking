"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const [selectedTreatments, setSelectedTreatments] = useState<SelectedTreatment[]>([]);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      { threshold: 0.5 }
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
        return prev.map((item) => (item.id === treatment.id ? treatment : item));
      } else {
        return [...prev, treatment];
      }
    });
  };

  const handleTreatmentRemove = (treatmentId: number) => {
    setSelectedTreatments((prev) => prev.filter((item) => item.id !== treatmentId));
  };

  const totalPrice = selectedTreatments.reduce((sum, treatment) => {
    const price = treatment.selectedOption ? treatment.selectedOption.price : treatment.price;
    return sum + price;
  }, 0);

  const scrollToSection = (index: number) => {
    const target = sectionRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(index);
    }
  };

  return (
    <div className="container mx-auto mt-16 flex justify-between">
      <div className="w-[60%]">
        {/* Sticky Menu */}
        <div className="flex space-x-6 fixed top-0 left-0 w-[60%] bg-white p-4 shadow-md z-10">
          {data.data.map((category, index) => (
            <div
              key={category.id}
              className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                activeSection === category.id
                  ? "bg-black text-white"
                  : "text-gray-700 hover:text-black"
              }`}
              onClick={() => scrollToSection(index)}
            >
              <h1 className="text-sm font-bold">{category.name}</h1>
            </div>
          ))}
        </div>

        {/* Service Sections */}
        {data.data.map((category, index) => (
          <div
            key={category.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            data-id={category.id}
            className="pt-4"
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
      <div className="w-[30%] border border-gray-600 rounded-lg p-4 h-[600px] overflow-y-auto">
        {selectedTreatments.map((treatment) => (
          <div key={treatment.id} className="flex justify-between items-center mb-4 px-3">
            <div>
              <h4>{treatment.selectedOption?.name || treatment.name}</h4>
              <span>{treatment.selectedOption?.time || treatment.time}</span>
            </div>
            <div>
              <span>AED {treatment.selectedOption?.price || treatment.price}</span>
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
