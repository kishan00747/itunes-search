import React, { useCallback, useMemo } from "react";
import styles from "./AlbumCard.module.scss";
import classnames from "classnames";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { stopPropagation } from "../../utils/common";
import PLACEHOLDER_IMAGE from "../../assets/album_img_placeholder.png";
import Badge from "@mui/material/Badge";
import LazyLoadImage from "../LazyLoadImage/LazyLoadImage";

const AlbumCard = React.forwardRef((props, ref) => {
  const {
    data,
    className,
    favorite = false,
    inQueue = false,
    addToFavorites = () => {},
    addToQueue = () => {},
    onClick = () => {},
    showRank = false,
  } = props;
  const { name, image, artist, rank } = data;

  const finalImage = useMemo(() => Object.values(image)[2], [image]);

  const handleFavoriteChange = useCallback(
    (e) => {
      addToFavorites(data.id, e.target.checked);
    },
    [addToFavorites, data]
  );

  const handleAddToQueueChange = useCallback(
    (e) => {
      addToQueue(data.id, e.target.checked);
    },
    [addToQueue, data]
  );

  const handleAlbumClick = useCallback(
    (e) => {
      onClick(e, data.id, data);
    },
    [onClick, data]
  );

  return (
    <div
      ref={ref}
      onClick={handleAlbumClick}
      className={classnames(styles.albumCard, "card", "card__grow", className)}
    >
      {showRank && (
        <Badge
          classes={{
            root: styles.albumCardBadge,
            badge: styles.albumCardBadge__badge,
          }}
          badgeContent={`#${rank}`}
          variant="standard"
          invisible={!showRank || rank === undefined}
        ></Badge>
      )}
      <div className={styles.albumCardHeader}>
        <div className={styles.albumCardImg}>
          <LazyLoadImage
            placeholder={PLACEHOLDER_IMAGE}
            src={finalImage.href}
          />
        </div>
      </div>
      <div className={styles.albumCardBody}>
        <div className={classnames(styles.albumCardName, "text-ellipsis")}>
          {name}
        </div>
        <div className={classnames(styles.albumCardArtist, "text-ellipsis")}>
          {artist.label}
        </div>
      </div>

      <div className={styles.albumCardFooter}>
        <div className={styles.albumCardActions}>
          <Checkbox
            className={styles.albumCardActionItem}
            checked={favorite}
            onChange={handleFavoriteChange}
            onClick={stopPropagation}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite className="color-red" />}
          />

          <Checkbox
            className={styles.albumCardActionItem}
            checked={inQueue}
            onChange={handleAddToQueueChange}
            onClick={stopPropagation}
            icon={<PlaylistAddIcon />}
            checkedIcon={<PlaylistAddCheckIcon className="color-accent" />}
          />
        </div>
      </div>
    </div>
  );
});

export default AlbumCard;
