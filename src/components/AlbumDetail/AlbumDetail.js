import React, { useCallback, useMemo } from "react";
import classnames from "classnames";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import Chip from "@mui/material/Chip";
import styles from "./AlbumDetail.module.scss";
import Badge from "@mui/material/Badge";
import LazyLoadImage from "../LazyLoadImage/LazyLoadImage";
import PLACEHOLDER_IMAGE from "../../assets/album_img_placeholder.png";

function AlbumDetails(props) {
  const {
    data,
    className,
    favorite = false,
    inQueue = false,
    addToFavorites = () => {},
    addToQueue = () => {},
    showRank = false,
    onClick = () => {},
  } = props;
  const { name, image, artist, category, itemCount, releaseDate, price, rank } =
    data;

  const finalImage = useMemo(() => Object.values(image)[2], [image]);

  const handleFavoriteChange = useCallback((e) => {
    addToFavorites(data.id, e.target.checked);
  }, []);
  const handleAddToQueueChange = useCallback((e) => {
    addToQueue(data.id, e.target.checked);
  }, []);

  return (
    <div className={classnames(styles.albumDetailWrapper, className)}>
      <div className={styles.albumDetailImg}>
        <LazyLoadImage placeholder={PLACEHOLDER_IMAGE} src={finalImage.href} />
        <Badge
          classes={{
            root: styles.albumDetailBadge,
            badge: styles.albumDetailBadge__badge,
          }}
          badgeContent={`#${rank}`}
          variant="standard"
          invisible={!showRank || rank === undefined}
        ></Badge>
      </div>
      <div className={styles.albumDetailInfo}>
        <div className={classnames(styles.albumDetailName)}>{name}</div>
        <div className={classnames(styles.albumDetailArtist)}>
          {artist.label}
        </div>

        <div className={classnames(styles.albumDetailCategories)}>
          {
            <Chip
              className={styles.albumDetailCategoryChip}
              size="small"
              label={category.label}
            />
          }
        </div>
        <div
          className={classnames(
            styles.albumDetailSubInfo,
            styles.albumDetailItemCount
          )}
        >
          <span>Tracks/Songs: </span>
          <span>{itemCount}</span>
        </div>

        <div className={styles.albumDetailSubInfo}>
          <span>Release Date: </span>
          <span>{releaseDate.label}</span>
        </div>

        <div className={styles.albumDetailSubInfo}>
          <span>Available to buy for </span>
          <span>{price.label}</span>
        </div>

        <div className={styles.albumDetailActions}>
          <Checkbox
            className={styles.albumDetailActionItem}
            checked={favorite}
            onChange={handleFavoriteChange}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite className="color-red" />}
          />

          <Checkbox
            className={styles.albumDetailActionItem}
            checked={inQueue}
            onChange={handleAddToQueueChange}
            icon={<PlaylistAddIcon />}
            checkedIcon={<PlaylistAddCheckIcon className="color-accent" />}
          />
        </div>
      </div>
    </div>
  );
}

export default AlbumDetails;
