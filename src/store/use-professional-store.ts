import { create } from "zustand";

// Define the interfaces
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

const loadFromLocalStorage = (): Services[] => {
  try {
    const savedServices = localStorage.getItem("services");
    if (savedServices) {
      return JSON.parse(savedServices);
    }
    return [];
  } catch (error) {
    console.error("Error loading from localStorage", error);
    return [];
  }
};

const saveToLocalStorage = (services: Services[]) => {
  try {
    localStorage.setItem("services", JSON.stringify(services));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const useServicesStore = create<Store>((set) => ({
  services: loadFromLocalStorage(), // Initialize services from localStorage
  addTreatment: (service) =>
    set((state) => {
      const isDuplicate = state.services.some(
        (existingService) => existingService.id === service.id
      );

      if (isDuplicate) {
        return state;
      }

      const updatedServices = [...state.services, service];
      saveToLocalStorage(updatedServices); // Save to localStorage when adding a service
      return { services: updatedServices };
    }),
  updateProfessional: (serviceId: number, newProfessional: Professional) =>
    set((state) => {
      const updatedServices = state.services.map((service) =>
        service.id === serviceId
          ? { ...service, professional: newProfessional }
          : service
      );
      saveToLocalStorage(updatedServices); // Save to localStorage when updating a service
      return { services: updatedServices };
    }),
}));
