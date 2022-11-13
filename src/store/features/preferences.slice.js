import { createSlice } from "@reduxjs/toolkit";
import { THEMES } from "../../constants/preferences";

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    theme: THEMES.LIGHT,
  },
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { changeTheme } = preferencesSlice.actions;

export default preferencesSlice.reducer;
