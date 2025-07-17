import { SimpleInput } from "@shared/ui-kits/inputs";
import styles from "./styles.module.scss";
import cn from "classnames";
import { SimpleButton } from "@shared/ui-kits/buttons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@shared/store/store";
import { setTitle } from "@shared/store/slices/filter.slice";
import { fetchBooks } from "@shared/store/thunks";
import type { RootState } from "@shared/store/store";

export const MainHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filterState = useSelector((state: RootState) => state.filter);

  const handleSearch = (query: string) => {
    dispatch(setTitle(query));
  };

  const handleSearchClick = () => {
    dispatch(fetchBooks(filterState));
  };

  return (
    <header className={styles.header}>
      <div className={cn(styles.header__wrapper, "wrapper")}>
        <div className={styles["header__logo-line"]}>
          <a href="#" className={styles["header__logo-text"]}>
            Library
          </a>
        </div>
        <nav className={styles.header__navigation}>
          <SimpleInput
            onSearch={handleSearch}
            placeholder="Find books..."
            debounce={400}
          />
          <SimpleButton text="Search" onClick={handleSearchClick} />
        </nav>
      </div>
    </header>
  );
};
