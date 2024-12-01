import Image from "next/image";
import React from "react";

interface ProfileCardProps {
  professional: string;
  title: string;
  rating?: number; // Optional prop
  imageUrl?: string; // Optional prop
  isActive: boolean; // Prop to highlight the active card
  onClick: () => void; // Click handler to select the professional
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  professional,
  title,
  rating = 0, // Default to 0 stars if rating is not provided
  imageUrl = "", // Use a placeholder image if no image URL is provided
  isActive,
  onClick,
}) => {
  // Calculate the number of full stars, half stars, and empty stars
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div
      onClick={onClick} // Call onClick when the card is clicked
      className={`bg-white rounded-lg shadow-md py-4 w-[240px] overflow-hidden cursor-pointer ${
        isActive ? "border-2 border-[#5C4ACE] shadow-lg" : "" // Highlight active card
      }`}
    >
      <div className="flex justify-center pt-6">
        {imageUrl ? (
          <Image
            width={62}
            height={62}
            alt={professional || "Profile Image"} // Default alt text if professional name is empty
            src={imageUrl}
            className="rounded-full h-24 w-24 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="rounded-full h-24 w-24 bg-gray-200 flex items-center justify-center">
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width={62}
              height={62}
            >
              <path d="M30.6 18.8a1 1 0 0 1-1.4-.2A6.45 6.45 0 0 0 24 16a1 1 0 0 1 0-2 3 3 0 1 0-2.905-3.75 1 1 0 0 1-1.937-.5 5 5 0 1 1 8.217 4.939 8.5 8.5 0 0 1 3.429 2.71A1 1 0 0 1 30.6 18.8m-6.735 7.7a1 1 0 1 1-1.73 1 7.125 7.125 0 0 0-12.27 0 1 1 0 1 1-1.73-1 9 9 0 0 1 4.217-3.74 6 6 0 1 1 7.296 0 9 9 0 0 1 4.217 3.74M16 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-7-7a1 1 0 0 0-1-1 3 3 0 1 1 2.905-3.75 1 1 0 0 0 1.938-.5 5 5 0 1 0-8.218 4.939 8.5 8.5 0 0 0-3.425 2.71A1 1 0 1 0 2.8 18.6 6.45 6.45 0 0 1 8 16a1 1 0 0 0 1-1"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="text-center py-2 px-2 overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{professional}</h2>
        <p className="text-sm text-gray-600 truncate">{title}</p>
        <div className="mt-2">
          {rating !== 0 ? (
            <span className="text-yellow-500">
              {"★".repeat(fullStars)}{" "}
              {"☆".repeat(emptyStars)}
            </span>
          ) : (
            <span className="text-gray-400"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
