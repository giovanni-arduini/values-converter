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

  let data: number[] = [];
  let categories: string[] = [];

  if (currencyHistory) {
    categories = Object.keys(currencyHistory.rates); // ["2023-12-29", "2024-01-02", "2024-01-03"]
    data = Object.values(currencyHistory.rates).map(
      (rateObj) => Object.values(rateObj)[0]
    ); // [1.1, 1.12, 1.15]
  }

  const series: SeriesType = [
    {
      name: "series-1",
      data: data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
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
