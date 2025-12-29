import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { time: "6am", visits: 15 },
  { time: "9am", visits: 35 },
  { time: "12pm", visits: 28 },
  { time: "3pm", visits: 42 },
  { time: "5pm", visits: 65 },
  { time: "7pm", visits: 38 },
  { time: "9pm", visits: 22 },
];

// check in counter
const totalToday = data.reduce((sum, d) => sum + d.visits, 0);


export default function AttendanceChart() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white font-semibold">Daily Attendance</p>
          <p className="text-gray-400 text-xs">Peak hours today</p>
        </div>
        <span className="text-yellow-400 text-xs bg-yellow-500/10 px-3 py-1 rounded-full">
           {totalToday} Check-ins
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
            />
            <YAxis hide />
            <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.time === "5pm" ? "#eab308" : "#555"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

