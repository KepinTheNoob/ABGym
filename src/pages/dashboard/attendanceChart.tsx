import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../service/api";
import { Attendance } from "../../types/types";

export default function AttendanceChart() {
  const { data: attendanceData = [] } = useQuery<Attendance[]>({
    queryKey: ["attendance"],
    queryFn: async () => {
      const res = await API.get("/attendances");
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { chartData, totalToday, maxVisits } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const todaysRecords = attendanceData.filter((record) => {
      const recordDate = new Date(record.checkInTime);
      return recordDate >= startOfToday && recordDate < endOfToday;
    });

    const buckets = [
      { time: "6am", visits: 0, start: 6, end: 8 },
      { time: "9am", visits: 0, start: 9, end: 11 },
      { time: "12pm", visits: 0, start: 12, end: 14 },
      { time: "3pm", visits: 0, start: 15, end: 16 },
      { time: "5pm", visits: 0, start: 17, end: 18 },
      { time: "7pm", visits: 0, start: 19, end: 20 },
      { time: "9pm", visits: 0, start: 21, end: 23 },
    ];

    todaysRecords.forEach((record) => {
      const hour = new Date(record.checkInTime).getHours();

      const bucket = buckets.find((b) => hour >= b.start && hour <= b.end);
      if (bucket) {
        bucket.visits++;
      }
    });

    const max = Math.max(...buckets.map((b) => b.visits));

    return {
      chartData: buckets,
      totalToday: todaysRecords.length,
      maxVisits: max,
    };
  }, [attendanceData]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white font-semibold">Daily Attendance</p>
          <p className="text-gray-400 text-xs">Peak hours today</p>
        </div>
        <span className="text-yellow-400 text-xs bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
          {totalToday} Check-ins
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} tabIndex={-1}>
            <CartesianGrid stroke="#2a2a2a" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            <YAxis hide />

            <Tooltip
              cursor={{ fill: "#ffffff05" }}
              contentStyle={{
                backgroundColor: "#161618",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#F0B100" }}
            />

            <Bar dataKey="visits" radius={[4, 4, 0, 0]} tabIndex={-1}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.visits === maxVisits && maxVisits > 0
                      ? "#F0B100"
                      : "#3f3f46"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
