import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../service/api";

type Transaction = {
  id: string;
  type: "Income" | "Expense";
  amount: string;
  transactionDate: string;
};

export default function RevenueChart() {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await API.get("/transactions");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { chartData, totalRevenue, percentageChange } = useMemo(() => {
    const incomeTransactions = transactions.filter((t) => t.type === "Income");

    const latestTransactionDate =
      incomeTransactions.length > 0
        ? new Date(
            Math.max(
              ...incomeTransactions.map((t) =>
                new Date(t.transactionDate).getTime()
              )
            )
          )
        : new Date();

    const anchorYear = latestTransactionDate.getFullYear();
    const anchorMonth = latestTransactionDate.getMonth();

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(anchorYear, anchorMonth - 5 + i, 1);
      return {
        monthKey: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("default", { month: "short" }),
        revenue: 0,
      };
    });

    let totalRev = 0;

    incomeTransactions.forEach((t) => {
      const tDate = new Date(t.transactionDate);
      const tKey = `${tDate.getFullYear()}-${tDate.getMonth()}`;
      const amount = Number(t.amount);

      const bucket = last6Months.find((b) => b.monthKey === tKey);

      if (bucket) {
        bucket.revenue += amount;
        totalRev += amount;
      }
    });

    const currentMetric = last6Months[last6Months.length - 1].revenue;
    const previousMetric = last6Months[last6Months.length - 2].revenue;

    let pctChange = 0;
    if (previousMetric > 0) {
      pctChange = ((currentMetric - previousMetric) / previousMetric) * 100;
    } else if (currentMetric > 0) {
      pctChange = 100;
    }

    return {
      chartData: last6Months,
      totalRevenue: totalRev,
      percentageChange: pctChange.toFixed(1),
    };
  }, [transactions]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white font-semibold">Tren Pendapatan</p>
          <p className="text-gray-400 text-xs">6 Bulan Terakhir</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">
            RP. {totalRevenue.toLocaleString()}
          </p>
          <p
            className={`text-xs font-medium ${
              Number(percentageChange) >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {Number(percentageChange) >= 0 ? "+" : ""}
            {percentageChange}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
              tickFormatter={(v) => `RP. ${v / 1000}k`}
              axisLine={false}
              tickLine={false}
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
                  return [`RP. ${value.toLocaleString()}`, "Revenue"];
                }
                return [value, "Revenue"];
              }}
              labelStyle={{ color: "#aaa", marginBottom: "0.5rem" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#eab308"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#eab308",
                stroke: "#161618",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
