import { createSlice } from "@reduxjs/toolkit";

export const albumsSlice = createSlice({
  name: "albums",
  initialState: {
    albumList: [],
    albumMap: {},
    feedData: {},
    searchIndex: {},
    filters: {
      searchTerm: "",
      onlyFavorites: false,
    },
    favorites: [],
    queue: [],
    selectedAlbum: null,
    rank: {},
  },
  reducers: {
    setAlbums: (state, action) => {
      const { albumList, albumMap, feedData, rank, searchIndex } =
        action.payload;
      state.albumList = albumList;
      state.albumMap = albumMap;
      state.feedData = feedData;
      state.rank = rank;
      state.searchIndex = searchIndex;
    },
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateSelectedAlbum: (state, action) => {
      state.selectedAlbum = action.payload;
    },
    addToQueue: (state, action) => {
      const { albumId, add } = action.payload;

      if (add) {
        state.queue.push(albumId);
      } else {
        state.queue = state.queue.filter((id) => albumId !== id);
      }
    },
    addToFavorites: (state, action) => {
      const { albumId, favorite } = action.payload;
      if (favorite) {
        state.favorites.push(albumId);
      } else {
        state.favorites = state.favorites.filter((id) => albumId !== id);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAlbums,
  updateSearchTerm,
  updateFilters,
  updateOnlyFavorites,
  addToFavorites,
  addToQueue,
  updateSelectedAlbum,
} = albumsSlice.actions;

export default albumsSlice.reducer;
