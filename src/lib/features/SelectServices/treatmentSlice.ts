import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface SelectedTreatment extends Treatment {
  selectedOption?: TreatmentOption; // selectedOption is optional
}

interface TreatmentState {
  selectedTreatments: SelectedTreatment[]; // Now this is an array of SelectedTreatment
  totalPrice: number;
}

const initialState: TreatmentState = {
  selectedTreatments: JSON.parse(localStorage.getItem('selectedTreatments') || '[]'),
  totalPrice: 0,
};

// Helper function to calculate total price
const calculateTotalPrice = (treatments: SelectedTreatment[]) => {
  return treatments.reduce((sum, treatment) => {
    // Use optional chaining to access selectedOption safely
    const price = treatment.selectedOption?.price ?? treatment.price;
    return sum + price;
  }, 0);
};

const treatmentSlice = createSlice({
  name: 'treatments',
  initialState,
  reducers: {
    addTreatment: (state, action: PayloadAction<SelectedTreatment[]>) => {
      state.selectedTreatments = [...state.selectedTreatments, ...action.payload];
      state.totalPrice = calculateTotalPrice(state.selectedTreatments);
      localStorage.setItem('selectedTreatments', JSON.stringify(state.selectedTreatments)); // Save to localStorage
    },
    removeTreatment: (state, action: PayloadAction<number>) => {
      state.selectedTreatments = state.selectedTreatments.filter(treatment => treatment.id !== action.payload);
      state.totalPrice = calculateTotalPrice(state.selectedTreatments);
      localStorage.setItem('selectedTreatments', JSON.stringify(state.selectedTreatments));
    },
    updateTreatment: (state, action: PayloadAction<SelectedTreatment[]>) => {
      action.payload.forEach(updatedTreatment => {
        const index = state.selectedTreatments.findIndex(treatment => treatment.id === updatedTreatment.id);
        if (index !== -1) {
          state.selectedTreatments[index] = updatedTreatment;
        }
      });
      state.totalPrice = calculateTotalPrice(state.selectedTreatments);
      localStorage.setItem('selectedTreatments', JSON.stringify(state.selectedTreatments));
    },
    updateTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
  },
});

export const { addTreatment, removeTreatment, updateTreatment, updateTotalPrice } = treatmentSlice.actions;

export default treatmentSlice.reducer;
