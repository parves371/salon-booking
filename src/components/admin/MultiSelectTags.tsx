import React, { useState } from 'react';

type MultiSelectTagsProps = {
  options: string[];
  onChange: (selectedTags: string[]) => void;
};

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({ options, onChange }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      onChange(updatedTags);
    }
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags);
    onChange(updatedTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  return (
    <div className="flex flex-wrap items-center border p-2 rounded-md">
      {selectedTags.map((tag, index) => (
        <div
          key={index}
          className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2 mb-2 flex items-center"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press enter..."
        className="flex-grow outline-none p-2"
      />
    </div>
  );
};

export default MultiSelectTags;
