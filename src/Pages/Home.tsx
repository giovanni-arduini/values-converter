import { useState, useEffect } from "react";
import CurrencySelector from "../Components/CurrencySelector";
import { useGlobalContext } from "../Contexts/GlobalContext";
import HistoryChart from "../Components/HistoryChart";
import type { CurrencyInput } from "../types";

export default function Home() {
  const {
    currencies,
    convert,
    setStartCurrency,
    setEndCurrency,
    fetchConversionHistory,
  } = useGlobalContext();
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
        setLeft((prev) => {
          const updated = { ...prev, value: normalized };
          setStartCurrency(updated); // <-- aggiorna context
          return updated;
        });
        setActiveSide("left");
      }
    } else {
      setRightError(!isValid);
      if (isValid) {
        setRight((prev) => {
          const updated = { ...prev, value: normalized };
          setEndCurrency(updated); // <-- aggiorna context
          return updated;
        });
        setActiveSide("right");
      }
    }
  }

  const handleChangeCode = (side: "left" | "right", newCode: string): void => {
    {
      if (side === "left") {
        setLeft((prev) => ({
          ...prev,
          code: newCode,
        }));
        fetchConversionHistory(newCode, right.code);
      } else {
        setRight((prev) => ({
          ...prev,
          code: newCode,
        }));
        fetchConversionHistory(newCode, left.code);
      }
    }
  };

  return (
    <>
      <section id="infos" className="my-10 flex justify-center">
        <div className=" flex flex-col justify-center ">
          <h4 className="text-lg">
            {left.value} {left.code}{" "}
            {left.value === "1" ||
            left.value === "1.0" ||
            left.value === "1.00" ||
            left.value === "1."
              ? "equivale a"
              : "equivalgono a"}
          </h4>
          <h2 className="text-3xl">
            {right.value} {right.code}
          </h2>
        </div>
      </section>

      <section id="currenciesSelect" className="container m-auto ">
        <div className="flex flex-col items-center gap-1 p-2 bg-gray-200">
          <CurrencySelector
            error={leftError}
            code={left.code}
            value={left.value}
            currencies={currencies}
            onChangeCode={(newCode) => handleChangeCode("left", newCode)}
            onChangeValue={(val) => handleChangeValue("left", val)}
            excludeCode={right.code} // <-- esclude questa valuta
          />

          <CurrencySelector
            error={rightError}
            code={right.code}
            value={right.value}
            currencies={currencies}
            onChangeCode={(newCode) => handleChangeCode("right", newCode)}
            onChangeValue={(val) => handleChangeValue("right", val)}
            excludeCode={left.code} // <-- esclude questa valuta
          />
        </div>
      </section>

      <section id="resultsDisplay" className="container m-auto">
        <HistoryChart></HistoryChart>
      </section>
    </>
  );
}
