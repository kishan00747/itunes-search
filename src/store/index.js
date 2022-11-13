import { configureStore } from "@reduxjs/toolkit";
import albumsReducer from "./features/albums.slice";
import preferencesReducer from "./features/preferences.slice";
import appReducer from "./features/app.slice";

export default configureStore({
  reducer: {
    albums: albumsReducer,
    preferences: preferencesReducer,
    app: appReducer,
  },
});
