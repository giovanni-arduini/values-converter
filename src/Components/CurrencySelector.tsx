import { useGlobalContext } from "../Contexts/GlobalContext";
import { useState } from "react";

type CurrencySelectorProps = {
  item: { defaultCode: string };
};

export default function CurrencySelector({ item }: CurrencySelectorProps) {
  const { defaultCode } = item;
  const { currencies } = useGlobalContext();
  console.log(defaultCode);

  const [value, setValue] = useState(defaultCode);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setValue(e.target.value);
  };

  console.log(value);

  return (
    <>
      <div className="">
        <select
          name="currencySelector"
          defaultValue={value}
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
