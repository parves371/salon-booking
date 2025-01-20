interface Professional {
  id: number;
  position: string;
  available: boolean;
  skills: string[] | null;
  name: string;
  role: string; // Add 'role' to the Professional interface
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

// if (selectedSlot) {
//   payload = generatePayload(services, userId, date, selectedSlot);
// }
