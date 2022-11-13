import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    name: "iTunes",
  },
  reducers: {},
});

export default appSlice.reducer;
