import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FuelCostChart = ({ data }) => {
  const chartData = [
    { name: "Base Cost", cost: data.base },
    { name: "Traffic Surcharge", cost: data.surcharge },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h4>Fuel Cost Breakdown</h4>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: "Cost (₹)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="cost" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuelCostChart;
