import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import classnames from "classnames";
import styles from "./Header.module.scss";
import ThemeSwitch from "../../components/ThemeSwitch/ThemeSwitch";
import { THEMES } from "../../constants/preferences";
import { changeTheme } from "../../store/features/preferences.slice";

function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.preferences.theme);
  const app = useSelector((state) => state.app);

  const onThemeChange = useCallback(() => {
    if (theme === THEMES.DARK) {
      dispatch(changeTheme(THEMES.LIGHT));
    } else {
      dispatch(changeTheme(THEMES.DARK));
    }
  }, [theme]);

  useEffect(() => {
    // Checking for dark theme in browser
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      dispatch(changeTheme(THEMES.DARK));
    }
  }, []);

  return (
    <header className={classnames(styles.itunesSearchHeader)}>
      <h2 className={styles.headerLogo}>
        <MusicNoteIcon />
        <span>{app.name}</span>
      </h2>
      <div className={classnames(styles.headerActions)}>
        <ThemeSwitch
          checked={theme === THEMES.DARK}
          theme={theme}
          onChange={onThemeChange}
        />
      </div>
    </header>
  );
}

export default Header;
