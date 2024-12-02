"use client";
import { FaArrowRight } from "react-icons/fa6";
import { Navbar } from "@/components/layout/Header";
import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <>
      <Navbar />
      <section
        className="pb-0 top-space-padding bg-dark-gray full-screen border-top position-relative md-h-700px sm-h-600px sm-pb-70px h-screen "
        data-parallax-background-ratio="0.3"
        style={{
          backgroundImage: 'url("/images/demo-beauty-salon-home-banner.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container mx-auto flex flex-col items-center justify-center md:items-start md:justify-start">
          <div className="relative mt-48">
            <h1 className="text-[9rem] text-white ">Beauty</h1>
            <span className="text-[9rem] text-white  absolute top-32">
              studio
            </span>
          </div>
          <p className="mt-32 text-xl font-semibold text-[#68717D] w-[400px]">
            A salon is an establishment dealing with natural cosmetic
            treatments.
          </p>
          <button className="bg-[#FFA085] text-black px-16 py-4 rounded mt-12 flex items-center gap-5 text-xl font-semibold">
            Book appointment <FaArrowRight />
          </button>
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-center px-4 md:px-0">
          <h2 className="text-xl">
            Beauty{" "}
            <span className="bg-gradient-to-r from-[#2e3844] via-[#455161] to-[#e47256] text-transparent bg-clip-text font-bold">
              salon services
            </span>
          </h2>
          <div className="border-r-[3px] mx-5 h-12 border-[#000] hidden md:block" />
          <h3 className="text-[2.5rem] font-normal sm:text-xl md:text-3xl lg:text-[2.5rem] mt-4 md:mt-0">
            Makeup and hairstyles
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-x-8 px-4 py-8">
          <ServicesCard
            imageSrc="https://img.freepik.com/free-photo/young-woman-getting-new-hairstyle-professional-hair-styling-saloon-hairdresser-is-massaging-her-head_231208-10831.jpg?ga=GA1.1.1096800660.1727073327&semt=ais_hybrid"
            title="Hair Treatment"
            description="Advanced hair treatment"
          />
          <ServicesCard
            imageSrc="https://img.freepik.com/free-photo/woman-receiving-foot-massage-service-from-masseuse-close-up-hand-foot-relax-foot-massage-therapy-service-concept_1150-13718.jpg?ga=GA1.1.1096800660.1727073327&semt=ais_hybrid"
            title="Reflexology"
            description="Different amounts of pressure"
          />
          <ServicesCard
            imageSrc="https://img.freepik.com/premium-photo/cosmetic-pink-fashion-theme-white-background_38364-11.jpg?ga=GA1.1.1096800660.1727073327&semt=ais_hybrid"
            title="Makeup"
            description="Rethink your lash look"
          />
          <ServicesCard
            imageSrc="https://img.freepik.com/free-photo/young-beautiful-naked-girl-smiling-hiding-eye-cucumber-slice-looking-camera-white-background_176420-14063.jpg?ga=GA1.1.1096800660.1727073327&semt=ais_hybrid"
            title="Skin care"
            description="Believe in your beauty"
          />
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-0">
        <div className="grid grid-cols-1  lg:grid-cols-2  gap-x-8 px-4 py-8">
          <CardComponent
            title="Hair Treatmen"
            description="Believe in your beauty"
            price="58"
          />
          <CardComponent
            title="Hair Treatmen"
            description="Believe in your beauty"
            price="58"
          />
          <CardComponent
            title="Hair Treatmen"
            description="Believe in your beauty"
            price="58"
          />
          <CardComponent
            title="Hair Treatmen"
            description="Believe in your beauty"
            price="58"
          />
          <CardComponent
            title="Hair Treatmen"
            description="Believe in your beauty"
            price="58"
          />
          <CardComponent
            title="Hair Treatmen"
            description="Believe in your beauty"
            price="58"
          />
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-center px-4 md:px-0">
          <h2 className="text-xl">
            <span className="bg-gradient-to-r from-[#2e3844] via-[#455161] to-[#e47256] text-transparent bg-clip-text font-bold">
              Associates brand
            </span>
          </h2>
          <div className="border-r-[3px] mx-5 h-12 border-[#000] hidden md:block" />
          <h3 className="text-[2.5rem] font-normal sm:text-xl md:text-3xl lg:text-[2.5rem] mt-4 md:mt-0">
            Brands available
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 px-4 py-8">
          <div className="border-r border-b flex items-center justify-center">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="border-r border-b flex items-center justify-center">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
        </div>
      </section>
    </>
  );
}
interface ServicesCardProps {
  imageSrc: string;
  title: string;
  description: string;
}
const ServicesCard: React.FC<ServicesCardProps> = ({
  imageSrc,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-[375px] h-[450px] overflow-hidden">
      <div className="relative group ">
        <Image
          alt={title}
          src={imageSrc}
          width={500}
          height={500}
          className="transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg bg-cover w-[371px] h-[328px]"
        />
      </div>
      <h3 className="mt-6 text-2xl text-[#3C4550] font-medium ">{title}</h3>
      <span className="mt-1 text-xl font-medium text-[#68717D]">
        {description}
      </span>
    </div>
  );
};

const CardComponent = ({
  title,
  description,
  price,
}: {
  title: string;
  description: string;
  price: string;
}) => {
  return (
    <div className="flex justify-around items-center gap-4 border-t border-b group overflow-hidden hover:shadow-lg transition-transform duration-300">
      <div className="p-8 group-hover:scale-105 group-hover:shadow-lg transition-transform duration-300">
        <Image
          src={
            "https://img.freepik.com/free-photo/young-beautiful-naked-girl-smiling-hiding-eye-cucumber-slice-looking-camera-white-background_176420-14063.jpg?ga=GA1.1.1096800660.1727073327&semt=ais_hybrid"
          }
          alt="Image"
          width={75}
          height={75}
          className="bg-cover w-[75px] h-[58px] group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="border-r h-full" />
      <div>
        <h3 className="text-2xl text-[#3C4550] font-medium">{title}</h3>
        <span className="text-xl font-medium text-[#68717D]">
          {description}
        </span>
      </div>
      <div className="text-xl font-medium text-[#68717D]">${price}</div>
    </div>
  );
};
