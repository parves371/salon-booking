import { ProfileCardProps } from "@/components/professional/select-professional";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getFromLocalStorage,
  setToLocalStorage,
} from "@/utils/localStorageUtils";

// Interfaces
interface TreatmentOption {
  id: number;
  name: string;
  price: number;
  time: string;
}

interface Treatment {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: TreatmentOption[];
}

interface SelectedTreatmentOption {
  id: number;
  name: string;
  time: string;
  price: number;
}

interface SelectedTreatment extends Treatment {
  selectedOption?: TreatmentOption; // selectedOption is optional
}

interface FinaleDataProps {
  id: number;
  name: string;
  time: string;
  price: number;
  professional: ProfileCardProps;
}

interface TreatmentState {
  selectedTreatments: SelectedTreatment[];
  totalPrice: number;
  finaldata: FinaleDataProps[];
}

// Initial state with `localStorage` data
const initialState: TreatmentState = {
  selectedTreatments:
    getFromLocalStorage<SelectedTreatment[]>("selectedTreatments") || [],
  totalPrice: 0,
  finaldata: getFromLocalStorage<FinaleDataProps[]>("finaldata") || [],
};

// Helper function to calculate total price
const calculateTotalPrice = (treatments: SelectedTreatment[]) => {
  return treatments.reduce((sum, treatment) => {
    const price = treatment.selectedOption?.price ?? treatment.price;
    return sum + price;
  }, 0);
};

const treatmentSlice = createSlice({
  name: "treatments",
  initialState,
  reducers: {
    addTreatment: (state, action: PayloadAction<SelectedTreatment[]>) => {
      state.selectedTreatments = [
        ...state.selectedTreatments,
        ...action.payload,
      ];

      const selectedIds = action.payload.map((treatment) => treatment.id);

      const data = state.finaldata.filter((item) => item.id !== selectedIds);

  
      // console.log(finalData);
      state.totalPrice = calculateTotalPrice(state.selectedTreatments);
      setToLocalStorage("selectedTreatments", state.selectedTreatments); // Save to localStorage
    },
    removeTreatment: (state, action: PayloadAction<number>) => {
      state.selectedTreatments = state.selectedTreatments.filter(
        (treatment) => treatment.id !== action.payload
      );
      state.totalPrice = calculateTotalPrice(state.selectedTreatments);
      setToLocalStorage("selectedTreatments", state.selectedTreatments); // Save to localStorage
    },
    updateTreatment: (state, action: PayloadAction<SelectedTreatment[]>) => {
      action.payload.forEach((updatedTreatment) => {
        const index = state.selectedTreatments.findIndex(
          (treatment) => treatment.id === updatedTreatment.id
        );
        if (index !== -1) {
          state.selectedTreatments[index] = updatedTreatment;
        }
      });
      state.totalPrice = calculateTotalPrice(state.selectedTreatments);
      setToLocalStorage("selectedTreatments", state.selectedTreatments); // Save to localStorage
    },
    updateTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    addProfession: (
      state,
      action: PayloadAction<{
        selectedProfessional: ProfileCardProps;
        data: SelectedTreatmentOption[];
      }>
    ) => {
      const { selectedProfessional, data } = action.payload;

      // Prepare the new treatment items with the professional data
      const newFinalData = data.map((treatment) => ({
        id: treatment.id,
        name: treatment.name,
        time: treatment.time,
        price: treatment.price,
        professional: selectedProfessional, // Add the selected professional to each treatment
      }));

      // Update finaldata by spreading the new items
      state.finaldata = [...newFinalData];
      setToLocalStorage("finaldata", state.finaldata);
      console.log(state.finaldata);
    },
    updateProfession: (
      state,
      action: PayloadAction<{
        treatmentId: number;
        newProfessional: ProfileCardProps;
      }>
    ) => {
      const { treatmentId, newProfessional } = action.payload;

      // Find the treatment to update by ID
      const treatmentToUpdate = state.finaldata.find(
        (treatment) => treatment.id === treatmentId
      );

      if (treatmentToUpdate) {
        // Update the professional for the selected treatment
        treatmentToUpdate.professional = newProfessional;

        // Save the updated state to localStorage
        setToLocalStorage("finaldata", state.finaldata);
      }

      console.log(
        "Updated treatment with new professional:",
        treatmentToUpdate
      );
    },
    updateAllProfession: (state, action: PayloadAction<ProfileCardProps>) => {
      const newProfessional = action.payload;

      // Update the professional for each treatment in finaldata
      state.finaldata = state.finaldata.map((treatment) => ({
        ...treatment,
        professional: newProfessional, // Replace professional for all treatments
      }));

      // Save the updated state to localStorage
      setToLocalStorage("finaldata", state.finaldata);

      console.log(
        "Updated all treatments with new professional:",
        state.finaldata
      );
    },
    anyProfession: (state, action: PayloadAction<boolean>) => {
      console.log(action.payload);
    },
  },
});

export const {
  addTreatment,
  removeTreatment,
  updateTreatment,
  updateTotalPrice,
  addProfession,
  anyProfession,
  updateAllProfession,
} = treatmentSlice.actions;

export default treatmentSlice.reducer;
