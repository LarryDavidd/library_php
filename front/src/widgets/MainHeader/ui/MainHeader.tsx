import { SimpleInput } from "@shared/ui-kits/inputs";
import styles from "./styles.module.scss";
import cn from "classnames";
import { SimpleButton } from "@shared/ui-kits/buttons";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@shared/store/store";
import { setTitle } from "@shared/store/slices/filter.slice";

export const MainHeader = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (query: string) => {
    dispatch(setTitle(query));
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
            onChange={() => {}}
            onBlur={handleSearch}
            placeholder="Find books..."
            debounce={400}
          />
          <SimpleButton text="Search" onClick={() => {}} />
        </nav>
      </div>
    </header>
  );
};
