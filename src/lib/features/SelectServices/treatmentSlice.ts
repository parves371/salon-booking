import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  selectedOption?: TreatmentOption; // Optional selected option
}

interface TreatmentState {
  selectedTreatments: Treatment[];
}

const initialState: TreatmentState = {
  selectedTreatments: JSON.parse(localStorage.getItem('selectedTreatments') || '[]'),
};

const treatmentSlice = createSlice({
  name: 'treatments',
  initialState,
  reducers: {
    addTreatment: (state, action: PayloadAction<Treatment>) => {
      const index = state.selectedTreatments.findIndex(treatment => treatment.id === action.payload.id);
      if (index !== -1) {
        state.selectedTreatments[index] = action.payload;
      } else {
        state.selectedTreatments.push(action.payload);
      }
      // Save to localStorage
      localStorage.setItem('selectedTreatments', JSON.stringify(state.selectedTreatments));
    },
    
    removeTreatment: (state, action: PayloadAction<number>) => {
      state.selectedTreatments = state.selectedTreatments.filter(treatment => treatment.id !== action.payload);
      // Save to localStorage
      localStorage.setItem('selectedTreatments', JSON.stringify(state.selectedTreatments));
    },

    updateTreatment: (state, action: PayloadAction<Treatment>) => {
      const index = state.selectedTreatments.findIndex(treatment => treatment.id === action.payload.id);
      if (index !== -1) {
        // Update the selected treatment with the new data
        state.selectedTreatments[index] = { ...state.selectedTreatments[index], ...action.payload };
      }
      // Save to localStorage
      localStorage.setItem('selectedTreatments', JSON.stringify(state.selectedTreatments));
    },
  },
});

export const { addTreatment, removeTreatment, updateTreatment } = treatmentSlice.actions;

export default treatmentSlice.reducer;
