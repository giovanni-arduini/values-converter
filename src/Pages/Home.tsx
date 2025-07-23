import CurrencySelector from "../Components/CurrencySelector";
import { useGlobalContext } from "../Contexts/GlobalContext";

export default function Home() {
  const { currencies } = useGlobalContext();

  return (
    <>
      <section id="currenciesSelect">
        <form action="">
          <CurrencySelector item={{ defaultCode: "EUR", currencies }} />
          <CurrencySelector item={{ defaultCode: "USD", currencies }} />
        </form>
      </section>
      <section id="resultsDisplay"></section>
    </>
  );
}
