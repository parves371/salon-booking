import { create } from "zustand";
import Cookies from "js-cookie";

interface WizardState {
  step: number;
  setStep: (step: number) => void;
  resetStep: () => void;  // Add reset method
}

export const useWizardStore = create<WizardState>((set) => ({
  step: parseInt(Cookies.get("step") || "1", 10), // Read from cookie or default to 1
  setStep: (step) => {
    Cookies.set("step", step.toString(), { expires: 1 }); // Store step in cookie for 1 day
    set({ step });
  },
  resetStep: () => {
    Cookies.remove("step");  // Remove the cookie
    set({ step: 1 });         // Reset the step to 1 in the store
  },
}));
