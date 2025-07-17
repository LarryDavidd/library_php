import { useState } from "react";
import { SimpleInput } from "@shared/ui-kits/inputs";
import { SimpleButton } from "@shared/ui-kits/buttons";
import styles from "./styles.module.scss";
import { fetchInitialData } from "@shared/store/thunks";
import { useDispatch } from "react-redux";

export const ParseSection = () => {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setInputValue(numericValue);
  };

  const handleSubmit = async () => {
    if (!inputValue) {
      setError("Please enter a number");
      return;
    }

    const numericValue = parseInt(inputValue, 10);
    if (isNaN(numericValue)) {
      setError("Invalid number");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost/library_php/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pages_num: numericValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.message);
      dispatch(fetchInitialData());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.numberSection}>
      <div className={styles.numberSection__controls}>
        <SimpleInput
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a number..."
          type="number"
        />
        <SimpleButton
          text={isLoading ? "Loading..." : "Submit"}
          onClick={handleSubmit}
          disabled={!inputValue || isLoading}
        />
      </div>

      {error && (
        <div className={styles.numberSection__error}>Error: {error}</div>
      )}

      {result && <div className={styles.numberSection__result}>{result}</div>}
    </section>
  );
};
