import React, { useCallback, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import useAlbums from "../../hooks/useAlbums";
import classnames from "classnames";
import styles from "./Albums.module.scss";
import AlbumsFilters from "./AlbumsFilters";
import AlbumList from "../../components/AlbumList/AlbumList";
import Drawer from "@mui/material/Drawer";
import AlbumDetail from "../../components/AlbumDetail/AlbumDetail";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import Fab from "@mui/material/Fab";

function Albums(props) {
  const { loadingText = "Hang on, fetching the best for you!" } = props;

  const [queueDrawerOpen, setQueueDrawerOpen] = useState(false);

  const albumData = useAlbums();
  const {
    albumList,
    loading,
    getAlbum,
    feedData,
    setFilters,
    favoriteSet,
    queueSet,
    queue: queueArr,
    categories,
    filters,
    addToFavorites,
    addToQueue,
    setSelectedAlbum,
    selectedAlbumId,
  } = albumData;

  const closeDrawer = useCallback(() => {
    setSelectedAlbum(null);
  }, [setSelectedAlbum]);

  const toggleQueueDrawer = useCallback(
    (value) => () => {
      setQueueDrawerOpen(value);
    },
    []
  );

  return (
    <div className={classnames(styles.albumsWrapper)}>
      {loading ? (
        <div className={styles.albumsLoadingWrapper}>
          <p>{loadingText}</p>
          <CircularProgress style={{ color: "var(--accent-color)  " }} />
        </div>
      ) : (
        <>
          <AlbumsFilters
            setFilters={setFilters}
            filters={filters}
            categories={categories}
          />
          <AlbumList
            albumList={albumList}
            getAlbum={getAlbum}
            title={feedData.title}
            addToFavorites={addToFavorites}
            addToQueue={addToQueue}
            favorites={favoriteSet}
            queue={queueSet}
            onAlbumClick={setSelectedAlbum}
            showRank={true}
          />

          {/* Album Detail Drawer */}
          <Drawer
            anchor={"bottom"}
            open={selectedAlbumId !== null}
            onClose={closeDrawer}
          >
            {selectedAlbumId !== null && (
              <AlbumDetail
                addToFavorites={addToFavorites}
                addToQueue={addToQueue}
                favorite={favoriteSet.has(selectedAlbumId)}
                inQueue={queueSet.has(selectedAlbumId)}
                data={getAlbum(selectedAlbumId)}
                showRank={true}
              />
            )}
          </Drawer>

          {/* Queue Drawer */}
          <Drawer
            anchor={"right"}
            open={queueDrawerOpen}
            onClose={toggleQueueDrawer(false)}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <AlbumList
              className={styles.queueAlbumList}
              albumList={queueArr}
              getAlbum={getAlbum}
              title={"Queue"}
              addToFavorites={addToFavorites}
              addToQueue={addToQueue}
              favorites={favoriteSet}
              queue={queueSet}
              onAlbumClick={setSelectedAlbum}
            />
          </Drawer>

          {queueArr.length > 0 && !queueDrawerOpen && (
            <Fab
              className={styles.queueFab}
              sx={[
                {
                  position: "fixed",
                  bottom: "1.5rem",
                  right: "1.5rem",
                  backgroundColor: "var(--accent-color)",
                },
                {
                  "&:hover": {
                    backgroundColor: "var(--accent-color)",
                    filter: "brightness(1.2)",
                  },
                },
              ]}
              aria-label="queue"
              onClick={toggleQueueDrawer(true)}
            >
              <PlaylistPlayOutlinedIcon />
            </Fab>
          )}
        </>
      )}
    </div>
  );
}

export default Albums;
