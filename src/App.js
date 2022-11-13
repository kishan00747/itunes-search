import "./App.scss";
import Header from "./containers/Header/Header";
import classnames from "classnames";
import { useSelector } from "react-redux";
import { THEMES } from "./constants/preferences";
import Albums from "./containers/Albums/Albums";
import { useEffect } from "react";

function App() {
  const theme = useSelector((state) => state.preferences.theme);

  useEffect(() => {
    if (theme === THEMES.DARK) {
      document.documentElement.classList.add("theme-dark");
    } else {
      document.documentElement.classList.remove("theme-dark");
    }
  }, [theme]);

  return (
    <div className={classnames("itunes-search-app")}>
      <Header />
      <main className="itunes-search-app-body">
        <Albums />
      </main>
    </div>
  );
}

export default App;
