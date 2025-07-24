import type { Currency } from "../types";

// Passo come props all'input il valore, il codice valuta e la funzione onChangeValue
// e alla select la lista di valute e la funzone onChangeCode
type CurrencySelectorProps = {
  code: string;
  value: number;
  currencies: Currency[] | null;
  onChangeCode: (code: string) => void;
  onChangeValue: (value: string) => void;
};

export default function CurrencySelector({
  code,
  value,
  currencies,
  onChangeCode,
  onChangeValue,
}: CurrencySelectorProps) {
  const isValidDecimal = /^[0-9]\d+(\.\d+)?$/.test(value.toString());

  return (
    <div>
      <input
        type="text"
        pattern="^[0-9]\d+(\.\d+)?$"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
      />
      <select value={code} onChange={(e) => onChangeCode(e.target.value)}>
        {currencies?.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.name}
          </option>
        ))}
      </select>
    </div>
  );
}
