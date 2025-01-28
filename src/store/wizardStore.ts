import { create } from 'zustand';

interface WizardState {
  // Tracks which steps have been completed
  appointmentDone: boolean;
  professionalDone: boolean;

  // Actions to set those states
  setAppointmentDone: (val: boolean) => void;
  setProfessionalDone: (val: boolean) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  appointmentDone: false,
  professionalDone: false,

  setAppointmentDone: (val) => set({ appointmentDone: val }),
  setProfessionalDone: (val) => set({ professionalDone: val }),
}));
