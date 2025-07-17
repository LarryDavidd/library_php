import React from "react";
import styles from "./styles.module.scss";
import { SimpleButton } from "../../../shared/ui-kits/buttons";

interface BookCardProps {
  book: {
    id: number;
    title: string;
    description: string;
    image_path: string;
    authors: string;
    genres: string;
  };
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <article className={styles["book-card"]}>
      <div className={styles["book-card__image-container"]}>
        <img
          src={book.image_path}
          alt={book.title}
          className={styles["book-card__image"]}
        />
      </div>

      <div className={styles["book-card__content"]}>
        <h3 className={styles["book-card__title"]}>{book.title}</h3>

        <div className={styles["book-card__meta"]}>
          <span className={styles["book-card__author"]}>{book.authors}</span>
          <span className={styles["book-card__genres"]}>{book.genres}</span>
        </div>

        <p className={styles["book-card__description"]}>
          {book.description.length > 150
            ? `${book.description.substring(0, 150)}...`
            : book.description}
        </p>

        <SimpleButton onClick={() => {}} text="More ditales" />
      </div>
    </article>
  );
};
