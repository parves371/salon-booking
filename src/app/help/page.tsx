"use client";
import React, { useState } from 'react';

const CustomSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
  ];

  const totalItems = items.length;

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalItems - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalItems - 1 ? 0 : prevIndex + 1));
  };

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider-container w-full relative container mx-auto">
      <div
        className="slider-items flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 33.3333}%)` }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(index)}
            className={`slider-item flex-shrink-0 w-1/3 p-4 cursor-pointer transition-transform duration-300 ${
              index === currentIndex ? 'scale-105 bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            <h3 className="text-center py-6 rounded-lg">{item}</h3>
          </div>
        ))}
      </div>
      
      <button
        onClick={handlePrevClick}
        className="prev-btn absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={handleNextClick}
        className="next-btn absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        &gt;
      </button>
    </div>
  );
};

export default CustomSlider;
