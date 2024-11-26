"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import data from "../../../data/frisha.json";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
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

interface CustomSliderProps {
  data: { id: number; name: string }[];
  activeSection: number | null;
  scrollToSection: (index: number) => void;
}

// Define types for the category data and scrollToSection function
interface CustomSliderProps {
  data: { id: number; name: string }[];
  activeSection: number | null;
  scrollToSection: (index: number) => void;
}

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
      <div className="container mx-auto mt-16 flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 px-4 lg-px-0">
        <div className="w-full md:w-[60%]">
          {/* Slider for Categories */}
          <CustomSlider
            data={data.data}
            activeSection={activeSection}
            scrollToSection={scrollToSection}
          />

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

const CustomSlider: React.FC<CustomSliderProps> = ({
  data,
  activeSection,
  scrollToSection,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const totalItems = data.length;

  useEffect(() => {
    if (activeSection !== null) {
      const activeIndex = data.findIndex(
        (category) => category.id === activeSection
      );
      if (activeIndex !== -1) {
        setCurrentIndex(activeIndex);
      }
    }
  }, [activeSection, data]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalItems - 1 ? 0 : prevIndex + 1
    );
  };

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    scrollToSection(index); // Trigger scroll to section when an item is clicked
  };

  return (
    <div className="slider-container w-[100%] container mx-auto overflow-hidden sticky top-0 bg-white">
      <h1 className="sticky top-0 text-2xl md:text-2xl lg:text-4xl font-bold bg-white text-black p-4">
        Select services
      </h1>

      <div
        className="slider-items flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 25}%)` }} // Display 4 items at once
      >
        {data.map((category, index) => (
          <div
            key={category.id}
            onClick={() => handleItemClick(index)}
            className={`slider-item flex-shrink-0 w-1/4 p-1 cursor-pointer transition-transform duration-300 flex items-center justify-center rounded-full ${
              category.id === activeSection
                ? "scale-105 bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <h3 className="text-center ">{category.name}</h3>
          </div>
        ))}
      </div>
      <div
        className="absolute z-50 top-0 right-[-3px] bg-white p-[9px] h-full flex items-center space-x-1 text-2xl"
        style={{
          boxShadow: "white 0 0px 27px 18px",
        }}
      >
        <button
          onClick={handlePrevClick}
          className="prev-btn z-10  text-[#131b1e]  py-2 rounded-full"
        >
          <MdChevronLeft />
        </button>
        <button
          onClick={handleNextClick}
          className="next-btn z-10  text-[#131b1e]  py-2 rounded-full"
        >
          <MdChevronRight />
        </button>
      </div>
    </div>
  );
};
