import { useState, useEffect } from "react";
import CurrencySelector from "../Components/CurrencySelector";
import { useGlobalContext } from "../Contexts/GlobalContext";
import type { CurrencyInput } from "../types";

export default function Home() {
  const { currencies, convert } = useGlobalContext();
  const [leftError, setLeftError] = useState(false);
  const [rightError, setRightError] = useState(false);

  // stato dei due componenti CurrencySelector
  const [left, setLeft] = useState<CurrencyInput>({
    code: "EUR",
    value: "1",
  });
  const [right, setRight] = useState<CurrencyInput>({
    code: "USD",
    value: "0",
  });
  // chi dei due sta chiamando la funzione di conversione
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");

  function isValidNumberInput(input: string): boolean {
    if (input.trim() === "") return true; // permetti input vuoto
    const cleaned = input.replace(",", "."); // accetta anche la virgola
    return /^(\d+([.,]\d*)?|[.,]\d+)$/.test(input);
  }

  useEffect(() => {
    if (leftError || rightError) return;

    const doConversion = async () => {
      try {
        if (activeSide === "left") {
          const result = await convert(
            left.code,
            left.code,
            parseFloat(right.value)
          );
          setRight((prev) => ({ ...prev, value: result }));
        } else {
          const result = await convert(
            left.code,
            right.code,
            parseFloat(left.value)
          );
          setLeft((prev) => ({ ...prev, value: result }));
        }
      } catch (err) {
        console.error("Conversion error:", err);
      }
    };

    // // Evita di fare la conversione se manca qualcosa
    // if (left.code && right.code && (left.value >= 0 || right.value >= 0)) {
    //   doConversion();
    // }
  }, [left, right, activeSide, convert]);

  return (
    <>
      <section id="currenciesSelect">
        <CurrencySelector
          error={leftError || rightError}
          code={left.code}
          value={left.value}
          currencies={currencies}
          onChangeCode={(code) => setLeft((prev) => ({ ...prev, code }))}
          onChangeValue={(val) => {
            const isValid = isValidNumberInput(val);
            setLeftError(!isValid);

            if (isValid) {
              setLeft((prev) => ({
                ...prev,
                value: val === "" ? "0" : val.replace(",", "."),
              }));
              setActiveSide("left");
            }
          }}
        />

        <CurrencySelector
          code={right.code}
          value={right.value}
          currencies={currencies}
          onChangeCode={(code) => setRight((prev) => ({ ...prev, code }))}
          onChangeValue={(val) => {
            const isValid = isValidNumberInput(val);
            setRightError(!isValid);

            if (isValid) {
              setRight((prev) => ({
                ...prev,
                value: val === "" ? "0" : val.replace(",", "."),
              }));
              setActiveSide("right");
            }
          }}
        />
      </section>

      <section id="resultsDisplay"></section>
    </>
  );
}
