import { create } from "zustand";

interface Professional {
  id: number;
  position: string;
  available: boolean;
  skills: string[] | null;
  name: string;
  role: string; // Add 'role' to the Professional interface
}

interface Services {
  id: number;
  name: string;
  time: string;
  price: number; // Changed price to number to match SelectProfessional
  professional: Professional;
}

interface Store {
  services: Services[];
  addTreatment: (treatment: Services) => void;
  updateProfessional: (
    serviceId: number,
    newProfessional: Professional
  ) => void;
}

export const useServicesStore = create<Store>((set) => ({
  services: [],
  addTreatment: (service) =>
    set((state) => {
      // Check if the service already exists in the store
      const isDuplicate = state.services.some(
        (existingService) => existingService.id === service.id
      );

      if (isDuplicate) {
        // If it's a duplicate, don't add it again
        return state;
      }

      // If it's not a duplicate, add it to the store
      return { services: [...state.services, service] };
    }),
  updateProfessional: (serviceId: number, newProfessional: Professional) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === serviceId
          ? { ...service, professional: newProfessional } // Update the professional for the selected service
          : service
      ),
    })),
}));
