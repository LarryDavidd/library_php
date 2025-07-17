import React from "react";
import styles from "./styles.module.scss";

interface SearchInputProps {
  onChange: (query: string) => void;
  onBlur: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SimpleInput: React.FC<SearchInputProps> = ({
  onChange = () => {},
  onBlur = () => {},
  placeholder = "Поиск...",
}) => {
  return (
    <input
      type="text"
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      placeholder={placeholder}
      className={styles.input}
    />
  );
};
