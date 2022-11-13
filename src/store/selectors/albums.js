import { createSelector } from "@reduxjs/toolkit";
import { KMPStringMatch } from "../../utils/string";
import dayjs from "dayjs";

export const selectAlbumList = (state) => state.albums.albumList;
export const selectAlbumMap = (state) => state.albums.albumMap;
export const selectFilters = (state) => state.albums.filters;
export const selectFavorites = (state) => state.albums.favorites;
export const selectQueue = (state) => state.albums.queue;
export const selectSearchIndex = (state) => state.albums.searchIndex;
export const selectFeedData = (state) => state.albums.feedData;
export const selectSelectedAlbum = (state) => state.albums.selectedAlbum;

export const selectFilteredAlbums = createSelector(
  selectAlbumList,
  selectAlbumMap,
  selectSearchIndex,
  selectFilters,
  selectFavorites,
  (albumList, albumMap, searchIndex, filters, favorites) => {
    const { searchTerm, onlyFavorites, categories = [], releaseDate } = filters;

    const searchVal = searchTerm.trim().toLowerCase();
    const matcher = new KMPStringMatch(searchVal);

    const categorySet = new Set(categories);
    const releaseDateObj = releaseDate
      ? {
          startDate: dayjs(releaseDate?.startDate),
          endDate: dayjs(releaseDate?.endDate),
        }
      : undefined;

    // Applying Only Favorites Filter
    const finalList = onlyFavorites ? favorites : albumList;

    // Search Filter
    const searchFilter = (albumId) => {
      return searchVal === "" || matcher.match(searchIndex[albumId]).length > 0;
    };

    // Category Filter
    const categoryFilter = (albumId) => {
      return (
        categorySet.size === 0 ||
        categorySet.has(albumMap[albumId].category.term)
      );
    };

    // Release Date Filter
    const releaseDateFilter = (albumId) => {
      const album = albumMap[albumId];
      const date = dayjs(album.releaseDate.timestamp);
      return (
        !releaseDateObj ||
        (date.isAfter(releaseDateObj.startDate) &&
          date.isBefore(releaseDateObj.endDate))
      );
    };

    const filtersToApply = [searchFilter, categoryFilter, releaseDateFilter];

    return finalList.filter((albumId) => {
      return filtersToApply.every((filterFn) => filterFn(albumId));
    });
  }
);

export const selectCategories = createSelector(
  selectAlbumList,
  selectAlbumMap,
  (albumList, albumMap) => {
    return Array.from(
      albumList.reduce((acc, albumId) => {
        acc.add(albumMap[albumId].category.term);
        return acc;
      }, new Set())
    );
  }
);
