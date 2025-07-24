import { useState, useEffect } from "react";
import CurrencySelector from "../Components/CurrencySelector";
import { useGlobalContext } from "../Contexts/GlobalContext";
import type { CurrencyInput } from "../types";

export default function Home() {
  const { currencies, convert } = useGlobalContext();

  // stato dei due componenti CurrencySelector
  const [left, setLeft] = useState<CurrencyInput>({
    code: "EUR",
    value: 1,
  });
  const [right, setRight] = useState<CurrencyInput>({
    code: "USD",
    value: 0,
  });
  // chi dei due sta chiamando la funzione di conversione
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");

  useEffect(() => {
    const doConversion = async () => {
      try {
        if (activeSide === "left") {
          const result = await convert(left.code, right.code, left.value);
          setRight((prev) => ({ ...prev, value: Number(result) }));
        } else {
          const result = await convert(right.code, left.code, right.value);
          setLeft((prev) => ({ ...prev, value: Number(result) }));
        }
      } catch (err) {
        console.error("Conversion error:", err);
      }
    };

    // Evita di fare la conversione se manca qualcosa
    if (left.code && right.code && (left.value >= 0 || right.value >= 0)) {
      doConversion();
    }
  }, [left, right, activeSide, convert]);

  return (
    <>
      <section id="currenciesSelect">
        <CurrencySelector
          code={left.code}
          value={left.value}
          currencies={currencies}
          onChangeCode={(code) => setLeft((prev) => ({ ...prev, code }))}
          onChangeValue={(value) => {
            setLeft((prev) => ({ ...prev, value: Number(value) }));
            setActiveSide("left");
          }}
        />

        <CurrencySelector
          code={right.code}
          value={right.value}
          currencies={currencies}
          onChangeCode={(code) => setRight((prev) => ({ ...prev, code }))}
          onChangeValue={(value) => {
            setRight((prev) => ({ ...prev, value: Number(value) }));
            setActiveSide("right");
          }}
        />
      </section>

      <section id="resultsDisplay"></section>
    </>
  );
}
