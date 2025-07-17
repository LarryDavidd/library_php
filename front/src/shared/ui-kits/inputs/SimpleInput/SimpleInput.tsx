import React from "react";
import styles from "./styles.module.scss";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SimpleInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Поиск...",
}) => {
  return (
    <input
      type="text"
      onBlur={(e) => onSearch(e.target.value)}
      placeholder={placeholder}
      className={styles.input}
    />
  );
};
