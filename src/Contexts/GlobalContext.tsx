import React, { createContext, useContext, useEffect } from "react";
import type { CurrencyInput } from "../types";

export interface CurrenciesResponse {
  [currencyCode: string]: string;
}

interface Currency {
  code: string;
  name: string;
}

type GlobalContextType = {
  currencies: Currency[] | null;
  startCurrency: CurrencyInput | null;
  endCurrency: CurrencyInput | null;

  setCurrencies: React.Dispatch<React.SetStateAction<Currency[] | null>>;
  setStartCurrency: React.Dispatch<React.SetStateAction<CurrencyInput | null>>;
  setEndCurrency: React.Dispatch<React.SetStateAction<CurrencyInput | null>>;

  convert: (from: string, to: string, amount: number) => Promise<string>;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

type GlobalContextProviderProps = {
  children: React.ReactNode;
};

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}

export function GlobalProvider({ children }: GlobalContextProviderProps) {
  const [currencies, setCurrencies] = React.useState<Currency[] | null>(null);
  const [startCurrency, setStartCurrency] =
    React.useState<CurrencyInput | null>(null);
  const [endCurrency, setEndCurrency] = React.useState<CurrencyInput | null>(
    null
  );

  const convert = async (
    from: string,
    to: string,
    amount: number
  ): Promise<string> => {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch API response. Status: ${response.status}`
      );
    }
    const data = await response.json();

    const formattedData = (amount * data.rates[to]).toFixed(2);

    return formattedData;
  };

  //   const defaultRate = async () => {
  //     const response = await fetch("https://api.frankfurter.dev/v1/currencies");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch the currencies list");
  //     }
  //     const data: CurrenciesResponse = await response.json();
  //     console.log(data);
  //     setCurrencies(data);
  //     console.log(currencies);
  //   };

  //   useEffect(() => {
  //     defaultRate();
  //   }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("https://api.frankfurter.dev/v1/currencies");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch currencies. Status: ${response.status}`
        );
      }
      const data: CurrenciesResponse = await response.json();
      // Converto in array { code, name }
      const mapped: Currency[] = Object.entries(data).map(([code, name]) => ({
        code,
        name,
      }));
      setCurrencies(mapped);
    } catch (err) {
      console.error("Error fetching currencies:", err);
    }
  };

  // Carico le valute al primo mount
  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        currencies,
        setCurrencies,
        startCurrency,
        setStartCurrency,
        endCurrency,
        setEndCurrency,
        convert,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
