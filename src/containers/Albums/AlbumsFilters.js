import React, { useCallback, useMemo, useState } from "react";
import styles from "./Albums.module.scss";
import classnames from "classnames";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import { debounce } from "lodash";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import dayjs from "dayjs";

function AlbumsFilters(props) {
  const { setFilters, categories, filters } = props;

  const handleSearchChange = useCallback(
    (searchTerm) => {
      setFilters({
        ...filters,
        searchTerm: searchTerm,
      });
    },
    [setFilters, filters]
  );

  const handleOnlyFavoritesChange = useCallback(
    (e) => {
      setFilters({
        ...filters,
        onlyFavorites: e.target.checked,
      });
    },
    [setFilters, filters]
  );

  const handleFiltersChange = useCallback(
    (newFilters) => {
      setFilters({
        ...filters,
        ...newFilters,
      });
    },
    [setFilters, filters]
  );

  const handleFiltersClear = useCallback(() => {
    setFilters({
      searchTerm: filters.searchTerm,
      onlyFavorites: filters.onlyFavorites,
    });
  }, [setFilters, filters]);

  return (
    <div className={classnames("card", styles.albumsFilterWrapper)}>
      <SearchFilter onChange={handleSearchChange} />
      <Divider
        style={{
          height: "1.5rem",
          margin: "0.5rem",
          borderColor: "var(--icon-color)",
        }}
        orientation="vertical"
      />
      <Checkbox
        className={styles.albumCardActionItem}
        checked={filters.onlyFavorites}
        onChange={handleOnlyFavoritesChange}
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite className="color-red" />}
      />
      <Divider
        style={{
          height: "1.5rem",
          margin: "0.5rem",
          borderColor: "var(--icon-color)",
        }}
        orientation="vertical"
      />
      <OtherFilters
        appliedFilters={filters}
        categories={categories}
        onApply={handleFiltersChange}
        onClear={handleFiltersClear}
      />
    </div>
  );
}

// SearchFilter Component
const SearchFilter = React.memo((props) => {
  const {
    searchPlaceholder = "Search by name of artist, song or album",
    onChange = () => {},
  } = props;

  const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange]);

  const [searchInput, setSearchInput] = useState("");

  const handleSearchInput = useCallback(
    (e) => {
      setSearchInput(e.target.value);
      debouncedOnChange(e.target.value);
    },
    [debouncedOnChange]
  );

  return (
    <div className={styles.searchFilter}>
      {/* <IconButton type="button" sx={{ p: "1rem" }} aria-label="search"> */}
      <SearchIcon style={{ padding: "1rem" }} />
      {/* </IconButton> */}
      <InputBase
        placeholder={searchPlaceholder}
        className={styles.searchInput}
        value={searchInput}
        onInput={handleSearchInput}
        inputProps={{ "aria-label": searchPlaceholder }}
      />
    </div>
  );
});

// Other Filters component
const OtherFilters = React.memo((props) => {
  const {
    categories = [],
    appliedFilters = {},
    onApply = () => {},
    onClear = () => {},
  } = props;

  const [selectedCategories, setSelectedCategories] = useState(
    new Set(appliedFilters.categories)
  );

  const [releaseDate, setReleaseDate] = useState({
    startDate: appliedFilters?.releaseDate?.startDate
      ? dayjs(appliedFilters?.releaseDate?.startDate)
      : dayjs().subtract(1, "year").startOf("day"),
    endDate: appliedFilters?.releaseDate?.endDate
      ? dayjs(appliedFilters?.releaseDate?.endDate)
      : dayjs().endOf("day"),
  });

  const [open, setOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    if (!open) {
      setSelectedCategories(new Set(appliedFilters.categories));
      setReleaseDate({
        startDate: appliedFilters?.releaseDate?.startDate
          ? dayjs(appliedFilters?.releaseDate?.startDate)
          : dayjs().subtract(1, "year").startOf("day"),
        endDate: appliedFilters?.releaseDate?.endDate
          ? dayjs(appliedFilters?.releaseDate?.endDate)
          : dayjs().endOf("day"),
      });
    }
    setOpen((old) => !old);
  }, [appliedFilters, open]);

  const handleCategoryChecked = useCallback((cat, checked) => {
    if (checked) {
      setSelectedCategories((old) => {
        old.add(cat);
        return new Set(old);
      });
    } else {
      setSelectedCategories((old) => {
        old.delete(cat);
        return new Set(old);
      });
    }
  }, []);

  const onFiltersApply = useCallback(() => {
    onApply({
      categories: Array.from(selectedCategories),
      releaseDate: {
        startDate: releaseDate.startDate.format(),
        endDate: releaseDate.endDate.format(),
      },
    });
    toggleDrawer();
  }, [selectedCategories, releaseDate, toggleDrawer, onApply]);

  const onFiltersClear = useCallback(() => {
    onClear();
    toggleDrawer();
  }, [toggleDrawer, onClear]);

  const filtersActive = useMemo(
    () => appliedFilters.releaseDate && appliedFilters.categories,
    [appliedFilters]
  );

  return (
    <div className={styles.otherFilters}>
      <IconButton
        type="button"
        sx={{ p: "1rem" }}
        aria-label="search"
        onClick={toggleDrawer}
      >
        <Badge
          classes={{
            badge: styles.otherFiltersBadge,
          }}
          variant="dot"
          invisible={!filtersActive}
        >
          <FilterListIcon style={{ color: "var(--icon-color)" }} />
        </Badge>
      </IconButton>

      {/* Filters Drawer */}
      <Drawer anchor={"bottom"} open={open} onClose={toggleDrawer}>
        <div className={styles.otherFiltersContainer}>
          <FormControl
            component="fieldset"
            className={styles.filterListWrapper}
            variant="standard"
          >
            <FormLabel component="legend">Categories</FormLabel>
            <FormGroup className={styles.categoryFilterList}>
              {categories.map((cat) => (
                <FormControlLabel
                  key={cat}
                  className={styles.categoryFilterListItem}
                  control={
                    <Checkbox
                      checked={selectedCategories.has(cat)}
                      onChange={(e) => {
                        handleCategoryChecked(cat, e.target.checked);
                      }}
                      name={"categories"}
                    />
                  }
                  label={cat}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl
            component="fieldset"
            className={styles.filterListWrapper}
            variant="standard"
          >
            <FormLabel component="legend">Release Date</FormLabel>
            <FormGroup className={styles.releaseDateFilter}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={releaseDate.startDate}
                  className={styles.datePicker}
                  onChange={(newValue) => {
                    setReleaseDate((old) => ({
                      ...old,
                      startDate: newValue,
                    }));
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={releaseDate.endDate}
                  className={styles.datePicker}
                  onChange={(newValue) => {
                    setReleaseDate((old) => ({
                      ...old,
                      endDate: newValue,
                    }));
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormGroup>
          </FormControl>

          <div className={styles.otherFiltersActions}>
            <Button
              className={"btn-primary"}
              onClick={onFiltersApply}
              variant="contained"
            >
              Apply
            </Button>
            <Button onClick={onFiltersClear} variant="outline">
              Clear
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
});

export default AlbumsFilters;
