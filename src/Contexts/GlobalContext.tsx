import React, { createContext, useContext, useEffect } from "react";
import type { CurrencyInput, Currency } from "../types";
import type { CurrencyHistoryResponse } from "../types";
export interface CurrenciesResponse {
  [currencyCode: string]: string;
}

type GlobalContextType = {
  currencies: Currency[] | null;
  currencyHistory: CurrencyHistoryResponse | null;
  startCurrency: CurrencyInput | null;
  endCurrency: CurrencyInput | null;

  setCurrencies: React.Dispatch<React.SetStateAction<Currency[] | null>>;
  setCurrencyHistory: React.Dispatch<
    React.SetStateAction<CurrencyHistoryResponse | null>
  >;
  setStartCurrency: React.Dispatch<React.SetStateAction<CurrencyInput | null>>;
  setEndCurrency: React.Dispatch<React.SetStateAction<CurrencyInput | null>>;

  convert: (from: string, to: string, amount: number) => Promise<string>;
  fetchConversionHistory: (from: string, to: string) => void;
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
  const [currencyHistory, setCurrencyHistory] =
    React.useState<CurrencyHistoryResponse | null>(null);
  const [startCurrency, setStartCurrency] =
    React.useState<CurrencyInput | null>(null);
  const [endCurrency, setEndCurrency] = React.useState<CurrencyInput | null>(
    null
  );

  // Funzione di conversione valute - usata in Home
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

    const formattedData = (amount * data.rates[to]).toFixed(2).toString();

    return formattedData;
  };

  // Funzione per ottenere storico tra due valute

  const fetchConversionHistory = async (from: string, to: string) => {
    try {
      const response = await fetch(
        `https://api.frankfurter.dev/v1/2024-01-01..?base=${from}&symbols=${to}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch conversion history for ${to}. Status:${response.status}`
        );
      }
      const data: CurrencyHistoryResponse = await response.json();
      setCurrencyHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Funzione per ottenere la lista delle valute -
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

  // Carico la history con le valute di default
  useEffect(() => {
    fetchConversionHistory("EUR", "USD");
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        currencies,
        setCurrencies,
        currencyHistory,
        setCurrencyHistory,
        startCurrency,
        setStartCurrency,
        endCurrency,
        setEndCurrency,
        convert,
        fetchConversionHistory,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
