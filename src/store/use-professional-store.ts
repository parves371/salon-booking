import { create } from "zustand";

// Define the interfaces
interface Professional {
  id: number;
  position: string;
  available: boolean;
  skills: string[] | null;
  name: string;
  role: string;
}

interface Services {
  id: number;
  name: string;
  time: string;
  price: number; // price is a number
  professional: Professional;
}

interface Store {
  services: Services[];
  addTreatment: (treatment: Services) => void;
  updateTreatmentById: (serviceId: number, updatedTreatment: Services) => void;
  updateProfessional: (
    serviceId: number,
    newProfessional: Professional
  ) => void;
  setServices: (services: Services[]) => void; // A method to set the services directly
}

// Load services from localStorage
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

// Save services to localStorage
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
        return state; // Do nothing if the service already exists
      }

      const updatedServices = [...state.services, service];
      saveToLocalStorage(updatedServices); // Save to localStorage when adding a service
      return { services: updatedServices };
    }),

  // Update the entire treatment (name, time, price, professional)
  updateTreatmentById: (serviceId: number, updatedTreatment: Services) =>
    set((state) => {
      const updatedServices = state.services.map((service) =>
        service.id === serviceId ? { ...service, ...updatedTreatment } : service
      );
      saveToLocalStorage(updatedServices); // Save to localStorage after updating
      return { services: updatedServices };
    }),

  // Update only the professional for a given service
  updateProfessional: (serviceId: number, newProfessional: Professional) =>
    set((state) => {
      const updatedServices = state.services.map((service) =>
        service.id === serviceId
          ? { ...service, professional: newProfessional }
          : service
      );
      saveToLocalStorage(updatedServices); // Save to localStorage after updating
      return { services: updatedServices };
    }),

  setServices: (services: Services[]) => {
    set({ services });
    saveToLocalStorage(services); // Save updated services to localStorage
  },
}));
