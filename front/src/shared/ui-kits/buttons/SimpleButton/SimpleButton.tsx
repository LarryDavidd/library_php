import styles from "./styles.module.scss";

interface ButtonProps {
  onClick: () => void;
  text: string;
}

export const SimpleButton = ({ onClick, text }: ButtonProps) => {
  return (
    <button className={styles.button} onClick={() => onClick()}>
      {text}
    </button>
  );
};
