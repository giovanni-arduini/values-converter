import React, { createContext, useContext } from "react";
import type { Currency } from "../types";

type GlobalContextType = {
  currencies: Currency[] | null;
  startCurrency: Currency | null;
  endCurrency: Currency | null;
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[] | null>>;
  setStartCurrency: React.Dispatch<React.SetStateAction<Currency | null>>;
  setEndCurrency: React.Dispatch<React.SetStateAction<Currency | null>>;
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

  return (
    <GlobalContext.Provider
      value={{
        currencies,
        setCurrencies,
        startCurrency,
        setStartCurrency,
        endCurrency,
        setEndCurrency,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
