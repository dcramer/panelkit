import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// import counterReducer from "../features/counter/counterSlice";

import hassMiddleware, { hassReducer } from "./features/hass";

export default configureStore({
  reducer: {
    hass: hassReducer,
  },
  middleware: [...getDefaultMiddleware(), hassMiddleware],
});
