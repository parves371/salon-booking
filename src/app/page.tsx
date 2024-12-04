"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { Navbar } from "@/components/layout/Header";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"; // Import React Icons
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Slider from "react-slick";
import { Footer } from "@/components/layout/Footer";

const teamMembers = [
  {
    image: "/images/demo-beauty-salon-team-01.jpg",
    name: "Jeremy dupont",
    role: "Director",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/jeremy" },
      { platform: "instagram", url: "https://instagram.com/jeremy" },
      { platform: "twitter", url: "https://twitter.com/jeremy" },
      { platform: "linkedin", url: "https://linkedin.com/in/jeremy" },
    ],
  },
  {
    image: "/images/demo-beauty-salon-team-02.jpg",
    name: "Matthew taylor",
    role: "Makeup",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/samantha" },
      { platform: "instagram", url: "https://instagram.com/samantha" },
      { platform: "twitter", url: "https://twitter.com/samantha" },
      { platform: "linkedin", url: "https://linkedin.com/in/samantha" },
    ],
  },
  {
    image: "/images/demo-beauty-salon-team-03.jpg",
    name: "Herman miller",
    role: "Therapist",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/samantha" },
      { platform: "instagram", url: "https://instagram.com/samantha" },
      { platform: "twitter", url: "https://twitter.com/samantha" },
      { platform: "linkedin", url: "https://linkedin.com/in/samantha" },
    ],
  },
  {
    image: "/images/demo-beauty-salon-team-04.jpg",
    name: "Johncy parker",
    role: "Consultant",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/samantha" },
      { platform: "instagram", url: "https://instagram.com/samantha" },
      { platform: "twitter", url: "https://twitter.com/samantha" },
      { platform: "linkedin", url: "https://linkedin.com/in/samantha" },
    ],
  },
];

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
          <div className="border-b flex items-center justify-center">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="border-r flex items-center justify-center">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="border-r flex items-center justify-center">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="border-r flex items-center justify-center">
            {" "}
            <Image
              width={225}
              height={110}
              alt="XAKS"
              src={"/images/demo-01.png"}
              className=""
            />
          </div>
          <div className="flex items-center justify-center">
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

      <section
        className="mt-20 px-4 md:px-0"
        style={{
          backgroundImage: 'url("/images/demo-beauty-salon-home-bg-04.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col-reverse lg:flex-row gap-y-8 md:gap-x-16 items-center justify-center px-4">
            <div className="w-full lg:w-1/2">
              <Image
                width={500}
                height={400}
                alt="banner"
                src={"/images/demo-beauty-salon-home-10.png"}
                className="w-full h-auto md:w-[724px] md:h-[665px] "
              />
            </div>

            <div className="w-full lg:w-[40%] text-center md:text-left mt-4">
              <h2 className="text-2xl font-semibold text-[#ffa085]">
                Beauty salon focus on
              </h2>
              <p className="text-4xl md:text-5xl text-white w-full md:w-[400px] mt-5">
                The quest for quality and safety
              </p>
              <FAQ />
              <button className="bg-[#FFA085] text-black px-16 py-4 rounded mt-8 md:mt-20 flex items-center justify-center gap-5 text-sm font-semibold">
                Book appointment <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center md:px-0">
        <div className="flex flex-col md:flex-row items-center border-b w-full">
          <div className="w-full md:w-[30%] border-b md:border-r p-4 md:border-b-0">
            <h4 className="text-[#2E3844] text-[2rem]">2023 beauty tips</h4>
          </div>
          <div className="w-full md:w-[700px] pt-2 md:mt-0 md:ml-10 py-2 md:py-0">
            <CustomSlider />
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-center px-4 md:px-0">
          <h2 className="text-xl">
            <span className="bg-gradient-to-r from-[#2e3844] via-[#455161] to-[#e47256] text-transparent bg-clip-text font-bold">
              Our specialists
            </span>
          </h2>
          <div className="border-r-[3px] mx-5 h-12 border-[#000] hidden md:block" />
          <h3 className="text-[2.5rem] font-normal sm:text-xl md:text-3xl lg:text-[2.5rem] mt-4 md:mt-0">
            Beauty experts
          </h3>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center mt-10  gap-5">
          {teamMembers.map((member, index) => (
            <HoverCard
              key={index}
              image={member.image}
              name={member.name}
              role={member.role}
              socialLinks={member.socialLinks} // Pass socialLinks to HoverCard
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto my-40 px-4 md:px-0">
        <div className="flex gap-10">
          <div className="w-[30%]">
            <div className="flex flex-col  items-start gap-6 justify-center px-4 md:px-0">
              <h2 className="text-xl">
                <span className="bg-gradient-to-r from-[#2e3844] via-[#455161] to-[#e47256] text-transparent bg-clip-text font-bold">
                  Testimonial
                </span>
              </h2>
              <h3 className="text-[2.5rem] font-normal sm:text-xl md:text-3xl lg:text-[2.5rem] mt-4 md:mt-0">
                Our happy beauty lovers.
              </h3>
            </div>
          </div>
          <div className="w-[70%]">
            <div className="flex gap-4">
              <Card
                title="Lesley simms"
                description="Perfection isn't just any other salon. It's a complete cut above the rest. Highly recommended!"
                rating={4}
              />
              <Card
                title="Lesley simms"
                description="Perfection isn't just any other salon. It's a complete cut above the rest. Highly recommended!"
                rating={4}
              />
              <Card
                title="Lesley simms"
                description="Perfection isn't just any other salon. It's a complete cut above the rest. Highly recommended!"
                rating={4}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto my-40 px-4 md:px-0">
        <div className="flex items-end justify-end">
          <ContactCard
            name="Crafto beauty salon"
            address="401 Broadway, 24th Floor"
            city="New York, NY 10013"
            phone="1-800-222-000"
            email="info@yourdomain.com"
            mapLink="https://www.google.com/maps"
          />
        </div>
      </section>

      <Footer/>
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
      <h3 className="mt-6 text-2xl text-[#3C4550] font-medium">{title}</h3>
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

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Quality and safety as our absolute priority",
    answer:
      "For more than 110 years, we have devoted our energy and our competencies solely to one business beauty.",
  },
  {
    question: "Helping hundreds of millions of women",
    answer:
      "For more than 110 years, we have devoted our energy and our competencies solely to one business beauty.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 mt-7">
      {faqData.map((item, index) => (
        <div key={index} className="border-b pb-4">
          <div
            onClick={() => toggleFAQ(index)}
            className="cursor-pointer text-xl font-medium text-[#2e3844] flex justify-between items-center"
          >
            <span className="text-white text-lg font-medium">
              {item.question}
            </span>
            <span className=" text-white">
              {openIndex === index ? "-" : "+"}
            </span>
          </div>
          {openIndex === index && (
            <p className="mt-2 text-lg text-[#A88C87] transition-all delay-100">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

interface SliderItem {
  title: string;
  description: string;
}

const sliderData: SliderItem[] = [
  {
    title: "Turmeric:",
    description:
      "Its healing properties can repair sun damage and reduce sunburns.",
  },
  {
    title: "Avocado:",
    description:
      "The fruit is rich in antioxidants and contains anti-inflammatory properties.",
  },
  {
    title: "Honey:",
    description:
      "This golden potion is great for your health when taken externally.",
  },
];

const CustomSlider = () => {
  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} absolute top-0 right-4 transform -translate-y-1/2 hidden md:block`} // Hide on small screens, show on medium+
        style={{
          ...style,
          display: "block",
          background: "transparent",
          color: "black",
          fontSize: "2rem",
        }}
        onClick={onClick}
      >
        <FaArrowRight size={25} className="hidden md:block absolute top-0" />
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} absolute top-1/2 left-4 transform -translate-y-1/2 hidden lg:block`} // Hide on small screens, show on medium+
        style={{
          ...style,
          display: "block",
          background: "transparent",
          color: "black",
          fontSize: "2rem",
        }}
        onClick={onClick}
      >
        <FaArrowLeft size={25} className="hidden lg:block absolute top-0" />
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Slider {...settings}>
      {sliderData.map((item, index) => (
        <div
          key={index}
          className="relative h-full flex items-center justify-center"
        >
          {/* Center content horizontally and vertically inside the slide */}
          <div className="text-center flex gap-3 items-center justify-center h-full w-full px-4 md:px-16">
            <div className="w-full">
              <h3 className="text-[#404a54] font-semibold text-xl md:text-2xl">
                {item.title}
              </h3>
              {/* Title font size adjusts based on screen size */}
              <p className="text-base text-[#8d9095] font-medium mt-2 md:text-lg">
                {item.description}
              </p>
              {/* Description font size adjusts based on screen size */}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

// Define the SocialLink interface
interface SocialLink {
  platform: string; // Specific string types
  url: string;
}

interface HoverCardProps {
  image: string;
  name: string;
  role: string;
  socialLinks: SocialLink[]; // Array of SocialLink objects
}

const HoverCard: React.FC<HoverCardProps> = ({
  image,
  name,
  role,
  socialLinks,
}) => {
  return (
    <div className="max-w-sm w-full mx-auto">
      <div className="group relative w-full h-96">
        {/* Image Section */}
        <div
          className="w-full h-full bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${image})` }}
        >
          {/* Full Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <div className="flex justify-center gap-4">
              {socialLinks.map((link, index) => {
                const Icon =
                  link.platform === "facebook"
                    ? FaFacebook
                    : link.platform === "instagram"
                    ? FaInstagram
                    : link.platform === "twitter"
                    ? FaTwitter
                    : FaLinkedin;

                return (
                  <Link href={link.url} key={index} passHref>
                    <span className="text-white text-2xl hover:text-gray-400">
                      <Icon />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-600 mt-2">{role}</p>
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  description: string;
  rating: number; // Rating should be a number between 1 and 5
}

const Card: React.FC<CardProps> = ({ title, description, rating }) => {
  // Function to generate the star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array(fullStars).fill(<span className="text-[#394452]">★</span>)}
        {halfStar && <span className="text-[#394452]">☆</span>}
        {Array(emptyStars).fill(<span className="text-[#dc7f68]">★</span>)}
      </div>
    );
  };

  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-4">{description}</p>

        {/* Rating Section */}
        <div className="mt-4">{renderStars(rating)}</div>
      </div>
    </div>
  );
};

interface ContactCardProps {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  mapLink: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  name,
  address,
  city,
  phone,
  email,
  mapLink,
}) => {
  return (
    <div className="max-w-[300px] p-10 rounded-xl shadow-lg bg-white text-start">
      <h2 className="text-[#2E3844] text-[2.32rem] font-medium">Contact us</h2>
      <p className="mt-1  text-base font-medium">{name}</p>
      <p className="mt-1 text-base font-medium text-[#A0A3A7]">{address}</p>
      <p className="mt-1 text-base font-medium text-[#A0A3A7]">{city}</p>
      <Link
        href={`tel:${phone}`}
        className="pt-5 block text-base font-medium text-[#A0A3A7] hover:text-[#ffa085]"
      >
        <strong className="text-sm text-[#2E3844]">Phone:</strong> {phone}
      </Link>
      <p className="text-sm font-medium hover:text-[#ffa085]">
        <strong className="text-base text-[#2E3844]">Email:</strong>{" "}
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      <Link
        href={mapLink}
        className="mt-5 inline-block py-2 px-4 text-sm text-[#000] border border-[#ccc] rounded-md hover:bg-[#f7f7f7]"
      >
        📍 Show on Google Maps
      </Link>
    </div>
  );
};
