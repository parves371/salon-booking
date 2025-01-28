// store/wizardStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WizardState {
  step: number;             // 1..3
  setStep: (step: number) => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      step: 1,
      setStep: (step: number) => set({ step }),
    }),
    {
      name: "wizard-storage", // Key for localStorage
    }
  )
);
