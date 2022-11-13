import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAlbums } from "../apis/albums";
import {
  setAlbums,
  updateFilters,
  updateSearchTerm,
  addToFavorites as favoriteInStore,
  addToQueue as addToQueueInStore,
  updateSelectedAlbum,
} from "../store/features/albums.slice";
import {
  selectAlbumList,
  selectAlbumMap,
  selectCategories,
  selectFavorites,
  selectFeedData,
  selectFilteredAlbums,
  selectFilters,
  selectQueue,
  selectSelectedAlbum,
} from "../store/selectors/albums";
import { transformFeed } from "../utils/albums";
import { retryNTimes } from "../utils/common";

const retryTwice = retryNTimes(2);

export default function useAlbums() {
  const dispatch = useDispatch();

  const albumList = useSelector(selectFilteredAlbums);
  const feedData = useSelector(selectFeedData);
  const albumMap = useSelector(selectAlbumMap);
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectFilters);
  const favorites = useSelector(selectFavorites);
  const queue = useSelector(selectQueue);
  const selectedAlbumId = useSelector(selectSelectedAlbum);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const queueSet = useMemo(() => new Set(queue), [queue]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const result = await retryTwice(getAlbums)();
        const { feed } = result;
        const feedData = transformFeed(feed);
        const { albumList, albumMap, searchIndex, rank, ...rest } = feedData;
        dispatch(
          setAlbums({
            albumList: albumList,
            albumMap: albumMap,
            searchIndex: searchIndex,
            rank: rank,
            feedData: rest,
          })
        );
      } catch (e) {
        console.error(e);
        dispatch(
          setAlbums({
            albumList: [],
            albumMap: {},
            feedData: {},
            searchIndex: {},
            rank: {},
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const setFilters = useCallback((newFilters) => {
    dispatch(updateFilters(newFilters));
  }, []);

  const setSelectedAlbum = useCallback((newFilters) => {
    dispatch(updateSelectedAlbum(newFilters));
  }, []);

  const addToFavorites = useCallback((albumId, checked) => {
    dispatch(favoriteInStore({ albumId, favorite: checked }));
  }, []);

  const addToQueue = useCallback((albumId, checked) => {
    dispatch(addToQueueInStore({ albumId, add: checked }));
  }, []);

  const getAlbum = useCallback(
    (albumId) => {
      return albumMap?.[albumId];
    },
    [albumMap]
  );

  return {
    albumList,
    feedData,
    getAlbum,
    loading,
    favorites,
    queue,
    favoriteSet,
    queueSet,
    filters,
    categories,
    selectedAlbumId,
    setSelectedAlbum,
    setFilters,
    addToFavorites,
    addToQueue,
  };
}
