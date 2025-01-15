import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

interface Option {
  id: number;
  name: string;
  time: string;
  price: number;
}

interface Service {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: Option[];
  selectedOption?: Option;
}

interface TreatmentsState {
  selectedTreatments: Service[];
  activeSection: number | null;
  hydrated: boolean;
  setSelectedTreatments: (treatments: Service[]) => void;
  setActiveSection: (sectionId: number | null) => void;
  setHydrated: (hydrated: boolean) => void;
  addOrUpdateTreatment: (treatment: Service) => void;
  removeTreatment: (treatmentId: number) => void;
  reset: () => void; // Add reset function to interface
}

export const useProductStore = create<TreatmentsState>()(
  devtools(
    persist(
      (set, get) => ({
        selectedTreatments: [],
        activeSection: null,
        hydrated: false,
        setSelectedTreatments: (treatments: Service[]) =>
          set({ selectedTreatments: treatments }),
        setActiveSection: (sectionId: number | null) =>
          set({ activeSection: sectionId }),
        setHydrated: (hydrated: boolean) => set({ hydrated }),
        addOrUpdateTreatment: (treatment: Service) => {
          const treatments = [...get().selectedTreatments];
          const index = treatments.findIndex(
            (t: Service) => t.id === treatment.id
          );
          if (index >= 0) {
            treatments[index] = { ...treatments[index], ...treatment };
          } else {
            treatments.push(treatment);
          }
          set({ selectedTreatments: treatments });
        },
        removeTreatment: (treatmentId: number) => {
          const filteredTreatments = get().selectedTreatments.filter(
            (t: Service) => t.id !== treatmentId
          );
          set({ selectedTreatments: filteredTreatments });
        },
        reset: () => {
          set({ selectedTreatments: [], activeSection: null, hydrated: false });
        },
      }),
      {
        name: "treatment-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
