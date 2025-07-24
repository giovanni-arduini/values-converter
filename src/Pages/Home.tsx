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
    if (leftError || rightError || left.value === "" || right.value === "")
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
            // Se vuoto, svuota anche il campo opposto e blocca API
            if (val.trim() === "") {
              setLeft((prev) => ({ ...prev, value: "" }));
              setRight((prev) => ({ ...prev, value: "" }));

              return;
            }

            const normalized = normalizeInput(val);

            const isValid = isValidNumberInput(normalized);
            setLeftError(!isValid);
            if (isValid) {
              setLeft((prev) => ({ ...prev, value: normalized }));
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
            if (val.trim() === "") {
              setRight((prev) => ({ ...prev, value: "" }));
              setLeft((prev) => ({ ...prev, value: "" }));
              return;
            }

            const normalized = normalizeInput(val);

            const isValid = isValidNumberInput(normalized);
            setRightError(!isValid);

            if (isValid) {
              setRight((prev) => ({ ...prev, value: normalized }));
              setActiveSide("right");
            }
          }}
        />
      </section>

      <section id="resultsDisplay"></section>
    </>
  );
}
