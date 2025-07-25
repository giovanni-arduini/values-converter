import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useGlobalContext } from "../Contexts/GlobalContext";

// Carico un grafico ad ogni cambiamento di currencies

type SeriesType = {
  name: string;
  data: number[];
}[];

const HistoryChart: React.FC = () => {
  const {
    startCurrency,
    endCurrency,
    fetchConversionHistory,
    currencyHistory,
  } = useGlobalContext();

  let categories: string[] = [];
  let data: number[] = [];

  if (currencyHistory) {
    categories = Object.keys(currencyHistory.rates).map((dateStr) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("it-IT").format(date); // array di stringhe con formato di data italiana
    });

    data = Object.values(currencyHistory.rates).map(
      (rateObj) => Object.values(rateObj)[0]
    ); // Array di numeri decimali
  }

  //
  const series: SeriesType = [
    {
      name: "conversion-rate",
      data: data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      id: "currency-conversion",
    },
    // dataLabels: { enabled: true },
    xaxis: {
      tickAmount: 10,
      // range: 390,
      // stepSize: 10,
      categories: categories,
    },
  };

  useEffect(() => {
    if (startCurrency && endCurrency) {
      fetchConversionHistory(startCurrency.code, endCurrency.code);
    }
  }, [startCurrency, endCurrency]);

  useEffect(() => {
    console.log("currencyHistory updated:", currencyHistory);
  }, [currencyHistory]);

  return (
    currencyHistory && (
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    )
  );
};

export default HistoryChart;
