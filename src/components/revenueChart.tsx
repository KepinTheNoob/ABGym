import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 42000 },
  { month: "Apr", revenue: 39000 },
  { month: "May", revenue: 43000 },
  { month: "Jun", revenue: 45200 },
  // { month: "Jul", revenue: 48200 },
  // { month: "aug", revenue: 56200 },
  // { month: "sep", revenue: 88200 },
  // { month: "oct", revenue: 92200 },
  // { month: "nov", revenue: 45200 },
  // { month: "dec", revenue: 74200 },
];

export default function RevenueChart() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white font-semibold">Revenue Trends</p>
          <p className="text-gray-400 text-xs">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">$245,000</p>
          <p className="text-green-500 text-xs">+13%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#161618",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => {
                if (typeof value === "number") {
                  return `$${value.toLocaleString()}`;
                }
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#eab308"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}