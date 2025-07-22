import CurrencySelector from "../Components/CurrencySelector";

export default function Home() {
  return (
    <>
      <section id="currenciesSelect">
        <form action="">
          <CurrencySelector item={{ defaultCode: "Euro" }} />
          <CurrencySelector item={{ defaultCode: "United States Dollar" }} />
        </form>
      </section>
      <section id="resultsDisplay"></section>
    </>
  );
}
