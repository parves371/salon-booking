import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  isServicesModalOpen: boolean;
}

const initialState: CounterState = {
  isServicesModalOpen: false,
};

export const counterSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    toggleServicesModal: (state) => {
      state.isServicesModalOpen = !state.isServicesModalOpen;
    },
  },
});

// Action creators are generated for each case reducer function
export const {toggleServicesModal} = counterSlice.actions;

export default counterSlice.reducer;
