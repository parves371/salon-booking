"use client";
import { useSlots } from "@/hooks/product/use-slot";
import { useUser } from "@/hooks/use-user";
import { useServicesStore } from "@/store/use-professional-store";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useStaff } from "@/hooks/use-staff";
import { LoaderIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProfileCard from "../professional/profile-card";
import { StaffProps } from "../professional/select-professional";

interface Professional {
  id: number;
  position: string;
  available: boolean;
  skills: string[] | null;
  name: string;
  role: string; // Add 'role' to the Professional interface
  avatar_path?: string;
}

interface Service {
  id: number;
  name: string;
  time: string;
  price: number; // Changed price to number to match SelectProfessional
  professional: Professional;
}

export interface Payload {
  staffId: number;
  userId: number;
  startTime: string;
  endTime: string;
  serviceId: number;
  price?: string; // Optional if not always provided
  time: string;
}

import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { priceCurrency } from "@/utils/constants";
import { useWizardStore } from "@/store/wizardStore";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export const SelectTime = () => {
  const [refreshFlag, setRefreshFlag] = useState(false); // New state for re-rendering
  const [date, setDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(
    null
  );
  const [isPaymentTriggered, setIsPaymentTriggered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { step, setStep } = useWizardStore();
  const hasHydrated = useWizardStore.persist.hasHydrated;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || pathname;

  const { services } = useServicesStore.getState();

  const staffIds = services?.map(
    (professional) => professional.professional.id
  );
  const servicesIdsAndTime = services?.map((service) => ({
    id: service.id,
    time: service.time,
  }));

  const professionalInfo = services?.map((service) => service.professional);
  const professionalavatars = professionalInfo?.map((info) =>
    info.id ? info.avatar_path : null
  );
  const uniqueAvatars = [...new Set(professionalavatars)];

  const {
    data: slotsData,
    isLoading,
    error,
    isError,
  } = useSlots(staffIds, date, servicesIdsAndTime);

  const { data: user } = useUser();
  const userId = user?.user?.id;

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  // If user hasn't unlocked step3, push them back to step2
  useEffect(() => {
    if (step < 3) {
      router.replace("/professional");
    }
  }, [step, router, hasHydrated]);
  useEffect(() => {
    if (step < 2) {
      router.replace("/appointment");
    }
  }, [step, router, hasHydrated]);

  const getEndTime = (startTime: string, durationMinutes: string) => {
    const [hours, minutes] = durationMinutes.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + totalMinutes);

    const endHours = String(startDate.getHours()).padStart(2, "0");
    const endMinutes = String(startDate.getMinutes()).padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  };

  const generatePayload = (
    services: Service[],
    userId: number,
    date: string,
    selectedSlot: string
  ): Payload[] => {
    let currentStartTime = selectedSlot;

    const payload = services.map((service) => {
      const endTime = getEndTime(currentStartTime, service.time);
      const servicePayload: Payload = {
        staffId: service.professional.id,
        userId,
        startTime: `${date}T${currentStartTime}`,
        endTime: `${date}T${endTime}`,
        serviceId: service.id,
        time: service.time,
        price: service.price.toString(),
      };

      currentStartTime = endTime;

      return servicePayload;
    });

    return payload;
  };

  let payload: Payload[] = [];

  if (selectedSlot) {
    payload = generatePayload(services, userId, date, selectedSlot);
  }

  const handleBooking = async () => {
    if (!selectedSlot) return;

    if (user) {
      setIsPaymentTriggered(true);
      setIsModalOpen(true);
    } else {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  };

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev); // Toggle the flag to trigger re-render
  };
  const { getTotalPrice } = useServicesStore.getState();

  const totalPrice = getTotalPrice();

  function handleBackToStep2() {
    // If you only want to move them back one step,
    // do setStep(2) so they must re-complete step2 to return to step3.
    setStep(2);
    router.push("/professional");
  }

  function handleBackToStep1() {
    // If you want going back to step1 to fully reset progress:
    setStep(1);
    router.push("/appointments");
  }

  if (!date || !services || isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderIcon className="size-5 spin-in-1" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-2xl">{error?.message}</span>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto flex gap-16">
        {/* Left Panel */}
        <div className="w-1/2">
          <h1 className="text-4xl font-bold bg-white sticky top-0 p-7">
            Select time
          </h1>

          {/* Professional Selection */}
          <div
            className="flex gap-2 items-center justify-center border p-2 rounded-full mt-6 w-[300px]"
            onClick={() => setSelectedProfessional(null)}
          >
            {uniqueAvatars ? (
              uniqueAvatars.map((avatar, index) => (
                <Avatar key={index}>
                  {avatar ? <AvatarImage src={avatar} /> : <RxAvatar />}
                </Avatar>
              ))
            ) : (
              <>
                <RxAvatar className="text-2xl" />
                Select a Professional
                <IoChevronDown />
              </>
            )}
          </div>

          {/* Date Selection */}
          <div className="mt-6 flex gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Disable past dates
            />
          </div>

          {/* Time Slot Selection */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Available Times</h2>
            <div className="flex gap-4 flex-wrap">
              {slotsData &&
                slotsData.map((slot) => (
                  <div
                    key={slot}
                    className={`w-full p-4 border border-[#d3d3d3] rounded-lg hover:bg-[#5847c7] hover:text-white text-lg font-semibold text-start ${
                      selectedSlot === slot
                        ? "bg-[#5847c7] text-white"
                        : "bg-white text-gray-600"
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[40%] border border-gray-600 rounded-lg p-4 lg:h-[600px] h-[200px] overflow-y-auto sticky lg:top-10 bottom-0 bg-white scrollbar-thin">
          {services.map((treatment) => (
            <div
              key={treatment.id}
              className="flex justify-between items-center mb-4 px-3"
            >
              <div className="w-[50%] flex flex-col">
                <span>{treatment.name}</span>
                <span>{treatment.time}</span>
                <span className="">
                  with{" "}
                  <DialogProfessional
                    services={treatment}
                    onRefresh={handleRefresh}
                  />
                </span>
              </div>
              <div>
                <span>
                  {priceCurrency.currency} {treatment.price}
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
              {priceCurrency.currency} {totalPrice}
            </h3>
          </div>

          {/* Confirm Booking Button */}
          <Button
            className="w-full mt-16"
            onClick={handleBooking}
            disabled={!selectedSlot} // Disable if no slot or professional is selected
          >
            Confirm Booking
          </Button>

          <Dialog
            open={isModalOpen}
            onOpenChange={() => setIsModalOpen((prev) => !prev)}
          >
            {/* <DialogTrigger>open</DialogTrigger> */}
            <DialogContent>
              <DialogTitle></DialogTitle>
              <DialogHeader>
                <DialogDescription>
                  {isPaymentTriggered && (
                    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
                      <div className="mb-10">
                        <h1 className="text-4xl font-extrabold mb-2">Sonny</h1>
                        <h2 className="text-2xl">
                          has requested
                          <span className="font-bold">
                            {" "}
                            {priceCurrency.currency} {totalPrice}
                          </span>
                        </h2>
                      </div>

                      <Elements
                        stripe={stripePromise}
                        options={{
                          mode: "payment",
                          amount: convertToSubcurrency(totalPrice),
                          currency: "usd",
                        }}
                      >
                        <CheckoutPage
                          customerId={userId}
                          services={payload}
                          totalPrice={totalPrice}
                          // paymentMethod={paymentMethod}
                        />
                      </Elements>
                    </main>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

const DialogProfessional = ({
  services,
  onRefresh,
}: {
  services: Service;
  onRefresh: () => void;
}) => {
  //dialog
  const [isOpen, setIsOpen] = useState(false);
  const [activeProfessional, setActiveProfessional] =
    useState<StaffProps | null>(null);

  // Fetch staff data based on selected professional skills
  const { data: staff } = useStaff([services.name]);
  const handleProfessionalSelect = (professional: StaffProps) => {
    setActiveProfessional(professional);
  };

  const updatedProfessionalByid = (professional: StaffProps, id: number) => {
    if (!professional) return;
    const { updateProfessional } = useServicesStore.getState();
    updateProfessional(id, professional);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
        <DialogTrigger>
          <span className="text-[#7C6DD8] font-semibold text-sm">
            {services?.professional.name || "Any Professional"}
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              {staff?.data?.map((i: StaffProps) => (
                <ProfileCard
                  key={i.id}
                  title={i.name}
                  professional={i.position}
                  isActive={activeProfessional?.id === i.id}
                  onClick={() => {
                    handleProfessionalSelect(i);
                    updatedProfessionalByid(i, services.id);
                    onRefresh();
                  }}
                />
              ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
