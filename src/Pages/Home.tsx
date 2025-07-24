import { useState, useEffect } from "react";
import CurrencySelector from "../Components/CurrencySelector";
import { useGlobalContext } from "../Contexts/GlobalContext";
import HistoryChart from "../Components/HistoryChart";
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
    return /^(\d+([.,]\d*)?|[.,]\d+)$/.test(cleaned);
  }

  function normalizeInput(val: string): string {
    let cleaned = val.replace(",", ".");

    if (/^0\d/.test(cleaned)) {
      cleaned = cleaned.replace(/^0(\d+)/, "0.$1");
    }

    return cleaned;
  }

  useEffect(() => {
    if (leftError || rightError) return;

    if (
      (activeSide === "left" && left.value === "") ||
      (activeSide === "right" && right.value === "")
    )
      return;

    const doConversion = async () => {
      try {
        if (activeSide === "left") {
          const result = await convert(
            left.code,
            right.code,
            parseFloat(left.value)
          );
          setRight((prev) => ({ ...prev, value: result.toString() }));
        } else {
          const result = await convert(
            right.code,
            left.code,
            parseFloat(right.value)
          );
          setLeft((prev) => ({ ...prev, value: result.toString() }));
        }
      } catch (err) {
        console.error("Conversion error:", err);
      }
    };

    doConversion();
  }, [
    left.code,
    left.value,
    right.code,
    right.value,
    activeSide,
    leftError,
    rightError,
    convert,
  ]);

  function handleChangeValue(side: "left" | "right", val: string) {
    setLeftError(false);
    setRightError(false);

    // Se vuoto, svuota anche il campo opposto e blocca API
    if (val.trim() === "") {
      setLeft((prev) => ({ ...prev, value: "" }));
      setRight((prev) => ({ ...prev, value: "" }));
      return;
    }

    const normalized = normalizeInput(val);
    const isValid = isValidNumberInput(normalized);

    if (side === "left") {
      setLeftError(!isValid);
      if (isValid) {
        setLeft((prev) => ({ ...prev, value: normalized }));
        setActiveSide("left");
      }
    } else {
      setRightError(!isValid);
      if (isValid) {
        setRight((prev) => ({ ...prev, value: normalized }));
        setActiveSide("right");
      }
    }
  }

  return (
    <>
      <section id="infos">
        <div>
          <h4>
            {left.value} {left.code} é uguale a
          </h4>
          <h2>
            {right.value} {right.code}
          </h2>
        </div>
      </section>

      <section id="currenciesSelect">
        <CurrencySelector
          error={leftError}
          code={left.code}
          value={left.value}
          currencies={currencies}
          onChangeCode={(code) => setLeft((prev) => ({ ...prev, code }))}
          onChangeValue={(val) => handleChangeValue("left", val)}
        />

        <CurrencySelector
          error={rightError}
          code={right.code}
          value={right.value}
          currencies={currencies}
          onChangeCode={(code) => setRight((prev) => ({ ...prev, code }))}
          onChangeValue={(val) => handleChangeValue("right", val)}
        />
      </section>

      <section id="resultsDisplay">
        <HistoryChart></HistoryChart>
      </section>
    </>
  );
}
