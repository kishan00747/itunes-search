import React, { useCallback, useEffect, useRef } from "react";
import AlbumCard from "../AlbumCard/AlbumCard";
import styles from "./AlbumList.module.scss";
import classnames from "classnames";

function AlbumList(props) {
  const {
    title = "Albums",
    className = "",
    albumList = [],
    getAlbum = () => ({}),
    noResultsText = "No results found",
    addToFavorites = () => {},
    onAlbumClick = () => {},
    addToQueue = () => {},
    favorites = new Set(),
    queue = new Set(),
    showRank = false,
  } = props;

  const handleAlbumClick = useCallback(
    (e, albumId) => {
      onAlbumClick(albumId);
    },
    [onAlbumClick]
  );

  const cardsRef = useRef([]);

  const registerTargets = useCallback((element) => {
    element && cardsRef.current.push(element);
  }, []);

  useEffect(() => {
    const intObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animationZoomIn);
            intObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
      }
    );

    (cardsRef.current ?? []).forEach((cardEl) => {
      intObserver.observe(cardEl);
    });

    return () => {
      intObserver.disconnect();
    };
  }, [albumList]);

  return (
    <div className={classnames(styles.albumListWrapper, className)}>
      <h5 className={classnames(styles.albumListTitle)}>{title}</h5>
      <div className={styles.albumList}>
        {albumList.length > 0 ? (
          albumList.map((albumId) => {
            return (
              <AlbumCard
                ref={registerTargets}
                data={getAlbum(albumId)}
                key={albumId}
                className={styles.albumCardItem}
                addToFavorites={addToFavorites}
                addToQueue={addToQueue}
                favorite={favorites.has(albumId)}
                inQueue={queue.has(albumId)}
                onClick={handleAlbumClick}
                showRank={showRank}
              />
            );
          })
        ) : (
          <div className={styles.noResultsFound}>
            <p>{noResultsText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumList;
