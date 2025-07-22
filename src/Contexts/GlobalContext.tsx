import React, { createContext, useContext } from "react";
import type { Currency } from "../types";

type GlobalContextType = {
  currencies: Currency[] | null;
  startCurrency: Currency | null;
  endCurrency: Currency | null;
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[] | null>>;
  setStartCurrency: React.Dispatch<React.SetStateAction<Currency | null>>;
  setEndCurrency: React.Dispatch<React.SetStateAction<Currency | null>>;
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
  const [startCurrency, setStartCurrency] = React.useState<Currency | null>(
    null
  );
  const [endCurrency, setEndCurrency] = React.useState<Currency | null>(null);

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
