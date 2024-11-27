import { configureStore } from "@reduxjs/toolkit";
import miscSliceReducer from "./features/misc/miscSlice";
import treatmentReducer from "./features/SelectServices/treatmentSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      misc: miscSliceReducer,
      treatments: treatmentReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
