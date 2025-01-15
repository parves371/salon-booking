import { create } from "zustand";

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
  price: number; // Price is a number
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
  setServices: (services: Services[]) => void;
  reset: () => void;
  getTotalPrice: () => number; // Function to get the total price
}

const loadFromLocalStorage = (): Services[] => {
  try {
    const savedServices = localStorage.getItem("services");
    return savedServices ? JSON.parse(savedServices) : [];
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

export const useServicesStore = create<Store>((set, get) => ({
  services: loadFromLocalStorage(),
  addTreatment: (service) => {
    set((state) => {
      const isDuplicate = state.services.some(
        (existingService) => existingService.id === service.id
      );
      if (isDuplicate) return state;
      const updatedServices = [...state.services, service];
      saveToLocalStorage(updatedServices);
      return { services: updatedServices };
    });
  },
  updateTreatmentById: (serviceId, updatedTreatment) => {
    set((state) => {
      const updatedServices = state.services.map((service) =>
        service.id === serviceId ? { ...service, ...updatedTreatment } : service
      );
      saveToLocalStorage(updatedServices);
      return { services: updatedServices };
    });
  },
  updateProfessional: (serviceId, newProfessional) => {
    set((state) => {
      const updatedServices = state.services.map((service) =>
        service.id === serviceId
          ? { ...service, professional: newProfessional }
          : service
      );
      saveToLocalStorage(updatedServices);
      return { services: updatedServices };
    }); 
  },
  setServices: (services) => {
    set({ services });
    saveToLocalStorage(services);
  },
  reset: () => {
    const clearedServices: Services[] = [];
    saveToLocalStorage(clearedServices);
    set({ services: clearedServices });
  },
  getTotalPrice: () => {
    const services = get().services;
    const totalPrice = services.reduce((total, service) => {
      const price = Number(service.price); // Ensure it's a number
      return total + (isNaN(price) ? 0 : price); // Add to total if valid
    }, 0);
    return totalPrice; // Return the number directly, no need to use .toFixed()
  },
}));
