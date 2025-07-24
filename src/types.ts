type CurrencyInput = {
  code: string;
  value: string;
};

type Currency = {
  code: string;
  name: string;
};

export interface CurrencyHistoryResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: {
    [date: string]: {
      [currencyCode: string]: number;
    };
  };
}

export type { CurrencyInput, Currency };
