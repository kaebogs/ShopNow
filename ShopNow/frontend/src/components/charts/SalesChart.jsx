import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart({ salesData }) {
  const options = {
    responsive: true,
     maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales & Orders Data",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Sales Amount",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Number of Orders",
        },
        min: 0,
        max: 100, 
        ticks: {
          stepSize: 10, 
        },
      },
    },
  };

  const labels = salesData?.map((data) => data?.date);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: salesData?.map((data) => data?.sales),
        backgroundColor: "rgba(10, 167, 81, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: salesData?.map((data) => data?.numOrders),
        backgroundColor: "rgba(164, 7, 26, 0.5)",
        yAxisID: "y1",
      },
    ],
  };

   return (
    <div
      className="w-100"
      style={{
        height: window.innerWidth < 768 ? "500px" : "400px",
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
}
