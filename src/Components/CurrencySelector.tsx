import { useState, useEffect } from "react";
import type { Currency } from "../types";

type CurrencySelectorProps = {
  item: { defaultCode: string; currencies: Currency[] | null };
};

export default function CurrencySelector({ item }: CurrencySelectorProps) {
  const { defaultCode, currencies } = item;
  const [value, setValue] = useState(defaultCode);

  useEffect(() => {
    if (currencies && currencies.some((curr) => curr.code === defaultCode)) {
      setValue(defaultCode);
    }
  }, [currencies, defaultCode]);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className="">
        <select
          name="currencySelector"
          value={value}
          onChange={handleSelectChange}
        >
          {currencies?.map((curr) => {
            return (
              <option key={curr.code} value={curr.code}>
                {curr.name}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}
