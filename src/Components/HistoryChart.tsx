import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useGlobalContext } from "../Contexts/GlobalContext";

// Carico un grafico ad ogni cambiamento di currencies

type SeriesType = {
  name: string;
  data: number[];
}[];

const series: SeriesType = [
  {
    name: "series-1",
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
];

const options: ApexOptions = {
  chart: {
    id: "basic-bar",
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
  },
};

const HistoryChart: React.FC = () => {
  const { startCurrency, endCurrency, fetchConversionHistory } =
    useGlobalContext();

  useEffect(() => {
    fetchConversionHistory;
  }, [startCurrency, endCurrency]);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default HistoryChart;
