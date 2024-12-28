"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks"; // Ensure you have the hooks set up for Redux
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {
  addTreatment,
  anyProfession,
  removeTreatment,
  updateTotalPrice,
  updateTreatment,
} from "@/lib/features/SelectServices/treatmentSlice";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { TreatmentCard } from "./treatment-card";
import data from "../../../data/frisha.json";
import { useProducts } from "@/hooks/useProducts";

// Types for treatment options and treatments
interface TreatmentOption {
  id: number;
  name: string;
  time: string;
  price: number;
}

export interface Treatment {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: TreatmentOption[];
  selectedOption?: TreatmentOption; // Make selectedOption optional
}

interface SelectedTreatment extends Treatment {
  selectedOption?: TreatmentOption; // Optional here too
}

interface CustomSliderProps {
  data: { id: number; name: string }[];
  activeSection: number | null;
  scrollToSection: (index: number) => void;
}

export const SelectServices: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const [datas, setdatas] = useState<Treatment[]>([]);
  const dispatch = useAppDispatch();
  const selectedTreatments = useAppSelector(
    (state) => state.treatments.selectedTreatments // Redux state for selected treatments
  );
  const totalPrice = useAppSelector(
    (state) => state.treatments.totalPrice // Redux state for total price
  ); // Fetch total price from Redux state
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { data:shuvo, isError, isLoading } = useProducts();

  console.log(shuvo);

  
  const calculateTotalPrice = (treatments: Treatment[]) => {
    return treatments.reduce((sum, treatment) => {
      // Use optional chaining to access selectedOption safely
      const price = treatment.selectedOption?.price ?? treatment.price; // Default to treatment.price if selectedOption doesn't exist
      return sum + price;
    }, 0);
  };

  // Load selected treatments from localStorage if they exist
  useEffect(() => {
    const storedTreatments = localStorage.getItem("selectedTreatments");
    if (storedTreatments) {
      const treatments: Treatment[] = JSON.parse(storedTreatments);

      // Check if the treatments already exist in the Redux state
      const existingTreatmentIds = selectedTreatments.map(
        (treatment) => treatment.id
      );

      // Filter out the treatments that are already in the Redux store
      const newTreatments = treatments.filter(
        (treatment) => !existingTreatmentIds.includes(treatment.id)
      );

      // Dispatch only the new treatments to avoid duplication
      if (newTreatments.length > 0) {
        dispatch(addTreatment(newTreatments)); // Add only new treatments
      }

      // Manually recalculate the total price after loading the treatments
      const updatedTotalPrice = calculateTotalPrice(selectedTreatments); // Recalculate total price
      dispatch(updateTotalPrice(updatedTotalPrice)); // Dispatch the updated total price
    }
  }, [dispatch, selectedTreatments]);
  // Ensure this effect runs after selectedTreatments is loaded

  // Save selected treatments to localStorage when it changes
  useEffect(() => {
    if (selectedTreatments.length > 0) {
      // Ensure total price is updated and stored in localStorage
      localStorage.setItem(
        "selectedTreatments",
        JSON.stringify(selectedTreatments)
      );
    }
  }, [selectedTreatments]);

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

  useEffect(() => {
    setHydrated(true); // Set hydrated to true after the data is loaded
    setActiveSection(data.data[0]?.id); // Default to the first section
  }, []);
  if (!hydrated) {
    return null; // or a loading spinner
  }

  const handleTreatmentUpdate = (treatment: SelectedTreatment) => {
    const exists = selectedTreatments.find((item) => item.id === treatment.id);
    if (exists) {
      dispatch(updateTreatment([treatment])); // Pass an array of treatments
    } else {
      dispatch(addTreatment([treatment])); // Pass an array of treatments
    }
  };

  const handleTreatmentRemove = (treatmentId: number) => {
    dispatch(removeTreatment(treatmentId)); // Remove treatment from Redux store
  };

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

  const onsubmit = () => {
    localStorage.setItem(
      "selectedTreatments",
      JSON.stringify(selectedTreatments)
    );

    const storedTreatments = localStorage.getItem("selectedTreatments");
    if (storedTreatments) {
      const treatments: Treatment[] = JSON.parse(storedTreatments);

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
  };

  if (!selectedTreatments) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className="container mx-auto mt-16 flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 px-4 lg-px-0">
        <div className="w-full md:w-[60%]">
          {/* Slider for Categories */}

          <Suspense fallback={<div>Loading...</div>}>
            <CustomSlider
              data={data.data}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
            />
          </Suspense>

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
                {category.items.map((treatment) => {
                  // Check if treatment is active (selected)
                  const isActive = selectedTreatments.some(
                    (selected) => selected.id === treatment.id
                  );

                  return (
                    <TreatmentCard
                      key={treatment.id}
                      treatment={treatment}
                      onTreatmentUpdate={handleTreatmentUpdate}
                      onTreatmentRemove={handleTreatmentRemove}
                      isActive={isActive}
                      // Pass isActive as a prop to mark the selected card
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Treatments Sidebar */}
        <div className="w-full md:w-[35%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin">
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

          <Button className="w-full mt-16" onClick={() => onsubmit()}>
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
};

const CustomSlider: React.FC<CustomSliderProps> = ({
  data,
  activeSection,
  scrollToSection,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemWidths, setItemWidths] = useState<number[]>([]); // Store the width of each item
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Calculate the width of each slider item on mount
  useEffect(() => {
    const widths: number[] = [];
    const sliderItems =
      sliderContainerRef.current?.querySelectorAll(".slider-item");
    if (sliderItems) {
      sliderItems.forEach((item) => {
        widths.push(item.clientWidth); // Push each item's width to the array
      });
    }
    setItemWidths(widths); // Store the widths in state
  }, [data]); // Recalculate when data changes (optional if data is dynamic)

  const totalItems = data.length; // Calculate the total number of items

  // Handle previous button click
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  // Handle next button click
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalItems - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle item click and ensure clicked item comes to first position
  const handleItemClick = (index: number) => {
    setCurrentIndex(index); // Set the clicked item as the active item
    scrollToSection(index); // Scroll to section when an item is clicked
  };

  // Slider item container styles
  const sliderStyle = {
    transform:
      typeof window !== "undefined"
        ? `translateX(-${itemWidths
            .slice(0, currentIndex)
            .reduce((a, b) => a + b, 0)}px)`
        : "none",
    transition: "transform 0.5s ease-in-out",
  };

  return (
    <div className="slider-container w-full mx-auto overflow-hidden sticky top-0 bg-white">
      <h1 className="sticky top-0 text-2xl md:text-2xl lg:text-4xl font-bold bg-white text-black p-4">
        Select services
      </h1>

      {/* Slider Items Container */}
      <div
        className="slider-items flex gap-4"
        ref={sliderContainerRef}
        style={sliderStyle}
      >
        {data.map((category, index) => (
          <div
            key={category.id}
            onClick={() => handleItemClick(index)} // Click event to move clicked item to the front
            className={`slider-item flex-shrink-0 p-4 cursor-pointer transition-transform duration-300 flex items-center justify-center rounded-full ${
              category.id === activeSection
                ? "scale-105 bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <h3 className="text-center">{category.name}</h3>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div
        className="absolute z-50 top-9 right-[-3px] bg-white p-[9px] h-full flex items-center space-x-1 text-2xl"
        style={{
          boxShadow: "0px 0px 27px 18px rgba(255, 255, 255, 0.5)", // White shadow
        }}
      >
        <button
          onClick={handlePrevClick}
          className="prev-btn z-10 text-[#131b1e] py-2 rounded-full"
        >
          <MdChevronLeft />
        </button>
        <button
          onClick={handleNextClick}
          className="next-btn z-10 text-[#131b1e] py-2 rounded-full"
        >
          <MdChevronRight />
        </button>
      </div>
    </div>
  );
};
