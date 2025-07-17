import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookCard } from "./Book";
import styles from "./styles.module.scss";
import { fetchBooks } from "../../../shared/store/thunks";
import type { RootState } from "../../../shared/store/store";

export const BookList = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector(
    (state: RootState) => state.books
  );
  const { authors, genres, title } = useSelector(
    (state: RootState) => state.filter
  );

  // Загружаем книги при монтировании и изменении фильтров
  useEffect(() => {
    dispatch(fetchBooks({ authors, genres, title }));
  }, [authors, genres, title, dispatch]);

  if (loading) {
    return <div className={styles["book-list__loading"]}>Загрузка книг...</div>;
  }

  if (error) {
    return <div className={styles["book-list__error"]}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles["book-list"]}>
      {books.length > 0 ? (
        <div className={styles["book-list__grid"]}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className={styles["book-list__empty"]}>
          Книги по выбранным фильтрам не найдены
        </div>
      )}
    </div>
  );
};
