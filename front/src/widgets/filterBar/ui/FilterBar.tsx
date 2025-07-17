import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import { fetchAuthors, fetchGenres } from "@shared/store/thunks";
import type { RootState } from "@shared/store/store";
import { toggleAuthor, toggleGenre } from "@shared/store/slices/filter.slice";

export const FilterBar = () => {
  const dispatch = useDispatch();

  const { authors } = useSelector((state: RootState) => state.authors);
  const { genres } = useSelector((state: RootState) => state.genres);

  const { authors: selectedAuthors, genres: selectedGenres } = useSelector(
    (state: RootState) => state.filter
  );

  useEffect(() => {
    dispatch(fetchAuthors());
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleAuthorToggle = (authorId: number) => {
    dispatch(toggleAuthor(authorId));
  };

  const handleGenreToggle = (genreId: number) => {
    dispatch(toggleGenre(genreId));
  };

  return (
    <div className={styles["filter-bar"]}>
      <div className={styles["filter-bar__sections"]}>
        <div className={styles["filter-bar__section"]}>
          <h3 className={styles["filter-bar__title"]}>Authors</h3>
          <div className={styles["filter-bar__options"]}>
            {authors.map((author) => (
              <label key={author.id} className={styles["filter-bar__option"]}>
                <input
                  type="checkbox"
                  className={styles["filter-bar__checkbox"]}
                  checked={selectedAuthors.includes(author.id)}
                  onChange={() => handleAuthorToggle(author.id)}
                />
                <span className={styles["filter-bar__label"]}>
                  {`${author.first_name} ${author.last_name || ""}`.trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles["filter-bar__section"]}>
          <h3 className={styles["filter-bar__title"]}>Genres</h3>
          <div className={styles["filter-bar__options"]}>
            {genres.map((genre) => (
              <label key={genre.id} className={styles["filter-bar__option"]}>
                <input
                  type="checkbox"
                  className={styles["filter-bar__checkbox"]}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                />
                <span className={styles["filter-bar__label"]}>
                  {genre.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
