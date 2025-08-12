import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DeliveryStatusChart = ({ data }) => {
  const chartData = [
    { name: "On-Time", value: data.on_time_deliveries },
    { name: "Late", value: data.late_deliveries },
  ];

  const COLORS = ["#28a745", "#dc3545"]; 

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h4>On-Time vs. Late Deliveries</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeliveryStatusChart;
