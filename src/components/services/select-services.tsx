"use client";
import { useProducts } from "@/hooks/useProducts";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { TreatmentCard } from "./treatment-card";
import { useProductStore } from "@/store/use-product-store";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { priceCurrency } from "@/utils/constants";
import { useWizardStore } from "@/store/wizardStore";

type Option = {
  id: number;
  name: string;
  time: string;
  price: number;
};

type Service = {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: Option[];
  selectedOption?: Option;
};

type Category = {
  id: number;
  name: string;
  items: Service[];
};

export const SelectServices: React.FC = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();
  const { appointmentDone, setAppointmentDone } = useWizardStore();

  const {
    selectedTreatments,
    addOrUpdateTreatment,
    removeTreatment,
    setActiveSection,
    setHydrated,
    activeSection,
    getTotalPrice,
  } = useProductStore();

  //fetching data from the server | all the products
  const { data, isError, isLoading, error } = useProducts();

  useEffect(() => {
    if (appointmentDone) {
      router.push("/professional");
    }
  }, [appointmentDone, router]);

  useEffect(() => {
    if (data?.length > 0 && !activeSection) {
      setActiveSection(data[0].id);
      setHydrated(true);
    }
  }, [data, setActiveSection, setHydrated, activeSection]);

  const onsubmit = () => {
    const selectedData = selectedTreatments.map((services) => ({
      id: services.id,
      name: services.selectedOption?.name || services.name,
      time: services.selectedOption?.time || services.time,
      price: services.selectedOption?.price || services.price,
    }));
    
    // Mark step1 done in Zustand
    setAppointmentDone(true);

    // Set a cookie so middleware can see we've completed step1
    document.cookie = "completedSteps=1; Path=/;";

    // Go to step2
    router.push("/professional");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderIcon className="size-5 spin-in-1" />
      </div>
    );
  }
  if (isError) {
    return <div>Error:{error.message}</div>;
  }

  const totalPrice = getTotalPrice(); // Calculate total price on every render that could affect it
  return (
    <section className="py-20">
      <div className="container mx-auto mt-16 flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 px-4 lg-px-0">
        <div className="w-full md:w-[60%]">
          <Suspense fallback={<div>Loading...</div>}>
            <CustomSlider
              data={data}
              activeSection={activeSection}
              scrollToSection={setActiveSection}
            />
          </Suspense>
          {data?.map((category: Category, index: number) => (
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
                {category.items.map((services) => (
                  <TreatmentCard
                    key={services.id}
                    services={services}
                    onTreatmentUpdate={() => addOrUpdateTreatment(services)}
                    onTreatmentRemove={() => removeTreatment(services.id)}
                    isActive={selectedTreatments.some(
                      (t) => t.id === services.id
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-[35%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bg-white scrollbar-thin">
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
              {priceCurrency.currency} {totalPrice} {priceCurrency.symbol}
            </h3>
          </div>
          <Button className="w-full mt-16" onClick={onsubmit}>
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
};

interface CustomSliderProps {
  data: Category[]; // Ensure data is an array of Category
  activeSection: number | null;
  scrollToSection: (index: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  data,
  activeSection,
  scrollToSection,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Calculate the width of each slider item on mount
  useEffect(() => {
    const widths: number[] = [];
    const sliderItems =
      sliderContainerRef.current?.querySelectorAll(".slider-item");
    if (sliderItems) {
      sliderItems.forEach((item) => {
        widths.push(item.clientWidth);
      });
      setCurrentIndex(
        data?.findIndex((category) => category.id === activeSection)
      ); // Update initial index based on activeSection
    }
  }, [data, activeSection]);

  const handlePrevClick = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    scrollToSection(index);
  };

  const sliderStyle = {
    transform: `translateX(-${currentIndex * 100}%)`, // Simplified for illustration
    transition: "transform 0.5s ease-in-out",
  };

  return (
    <div className="slider-container w-full mx-auto overflow-hidden sticky top-0 bg-white">
      <h1 className="sticky top-0 text-2xl md:text-2xl lg:text-4xl font-bold bg-white text-black p-4">
        Select services
      </h1>
      <div
        className="slider-items flex gap-4"
        ref={sliderContainerRef}
        style={sliderStyle}
      >
        {data?.map((category, index) => (
          <div
            key={category.id}
            onClick={() => handleItemClick(index)}
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
      <div className="absolute z-50 top-9 right-[-3px] bg-white p-[9px] h-full flex items-center space-x-1 text-2xl">
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
