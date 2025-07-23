type CurrencyInput = {
  name: string;
  date: string;
  rates: {};
};

type Currency = {
  code: string;
  name: string;
};

export type { CurrencyInput, Currency };
