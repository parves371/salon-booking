import React, { useState, useEffect } from "react";

type MultiSelectDropdownProps = {
  options: string[];
  onChange: (selectedTags: string[]) => void;
  defaultValue?: string | string[]; // defaultValue can be a string or an array
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  onChange,
  defaultValue = [], // Default to an empty array if not provided
}) => {
  // Normalize defaultValue to always be an array
  const normalizedDefaultValue = Array.isArray(defaultValue)
    ? defaultValue
    : [defaultValue];
  
  const [selectedTags, setSelectedTags] = useState<string[]>(normalizedDefaultValue);
  const [isOpen, setIsOpen] = useState(false);

  // Only call onChange when selectedTags actually change
  useEffect(() => {
    onChange(selectedTags);
  }, [selectedTags, onChange]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectTag = (tag: string) => {
    // Avoid updating state if the tag is already selected
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags); // This triggers the useEffect
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags); // This triggers the useEffect
  };

  const availableOptions = options.filter(
    (option) => !selectedTags.includes(option)
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="flex flex-wrap items-center border p-2 rounded-md">
        {selectedTags.map((tag, index) => (
          <div
            key={index}
            className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2 mb-2 flex items-center"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          {isOpen ? "Close" : "Select Tags"}
        </button>
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-lg z-10">
          {availableOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                handleSelectTag(option);
                setIsOpen(false); // Close the dropdown after selecting
              }}
              className="p-2 cursor-pointer hover:bg-blue-100"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
