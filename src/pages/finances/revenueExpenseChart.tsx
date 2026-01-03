import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

type Transaction = {
  id: string;
  type: "Income" | "Expense";
  amount: string;
  transactionDate: string;
};

type Props = {
  transactions: Transaction[];
};

export default function RevenueExpenseChart({ transactions }: Props) {
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    const sortedTxns = [...transactions].sort(
      (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    );
    
    const latestDate = sortedTxns.length > 0 ? new Date(sortedTxns[0].transactionDate) : new Date();
    
    const anchorYear = latestDate.getFullYear();
    const anchorMonth = latestDate.getMonth();

    const buckets = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(anchorYear, anchorMonth - 5 + i, 1);
      return {
        monthKey: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("default", { month: "short" }),
        Income: 0,
        Expense: 0,
      };
    });

    transactions.forEach((t) => {
      const tDate = new Date(t.transactionDate);
      const tKey = `${tDate.getFullYear()}-${tDate.getMonth()}`;
      const amount = Number(t.amount);

      const bucket = buckets.find((b) => b.monthKey === tKey);
      if (bucket) {
        if (t.type === "Income") {
          bucket.Income += amount;
        } else {
          bucket.Expense += amount;
        }
      }
    });

    return buckets;
  }, [transactions]);

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
            tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}jt`}
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
            formatter={(value, name) => [
              `Rp${Number(value).toLocaleString()}`, 
              name
            ]}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          
          <Line
            type="monotone"
            dataKey="Income"
            name="Revenue"
            stroke="#eab308"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Expense"
            name="Expenses"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}