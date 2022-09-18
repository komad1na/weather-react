import { configureStore } from "@reduxjs/toolkit";
import dataSliceReducer from "./dataSlice/dataSlice";

export const store = configureStore({
    reducer: {
        data: dataSliceReducer
    }
});
