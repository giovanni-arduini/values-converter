import type { Currency } from "../types";

// Passo come props all'input il valore, il codice valuta e la funzione onChangeValue
// e alla select la lista di valute e la funzone onChangeCode
type CurrencySelectorProps = {
  code: string;
  value: string;
  currencies: Currency[] | null;
  onChangeCode: (code: string) => void;
  onChangeValue: (value: string) => void;
  excludeCode?: string;
  error?: boolean;
};

export default function CurrencySelector({
  code,
  value,
  currencies,
  onChangeCode,
  onChangeValue,
  excludeCode,
  error,
}: CurrencySelectorProps) {
  return (
    <div className="p-3 bg-white rounded-md flex items-center flex-col	">
      <input
        type="text"
        pattern="^[0-9]\d+(\.\d+)?$"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
      />
      <select value={code} onChange={(e) => onChangeCode(e.target.value)}>
        {currencies?.map((curr) => {
          if (curr.code === excludeCode) return null;
          return (
            <option key={curr.code} value={curr.code}>
              {curr.name}
            </option>
          );
        })}
      </select>
      {error && (
        <p style={{ color: "red" }}>Inserisci solo numeri intero o decimali</p>
      )}
    </div>
  );
}
