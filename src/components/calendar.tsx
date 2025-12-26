import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

type CalendarProps = {
  value?: Date;
  onSelect: (date: Date) => void;
};

export default function Calendar({ value, onSelect }: CalendarProps) {
  const today = new Date();

  const [month, setMonth] = useState(
    value ? value.getMonth() : today.getMonth()
  );
  const [year, setYear] = useState(
    value ? value.getFullYear() : today.getFullYear()
  );

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
        <div
        className="w-[18rem] max-w-[90vw] max-h-[min(360px,70vh)] overflow-auto rounded-lg bg-[#0a0a0a] border border-gray-800 p-3 text-sm shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-800">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-2">
          <MonthDropdown month={month} setMonth={setMonth} />
          <YearDropdown year={year} setYear={setYear} />
        </div>

        <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-800">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-center text-gray-400 mb-1">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates */}
    <div className="grid grid-cols-7 gap-1 max-h-[220px] overflow-y-auto">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={i} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1);
          const selected = value?.toDateString() === date.toDateString();

          return (
            <button
              key={i}
              onClick={() => onSelect(date)}
              className={`h-8 rounded-md flex items-center justify-center
                ${
                  selected
                    ? "bg-[#F0B100] text-black font-bold"
                    : "hover:bg-gray-800"
                }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Dropdown mont and year

function MonthDropdown({
  month,
  setMonth,
}: {
  month: number;
  setMonth: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-28">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#161618] border border-gray-700 rounded px-2 py-1 text-sm text-left"
      >
        {months[month]}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#0a0a0a] border border-gray-700 rounded max-h-[120px] overflow-y-auto">
          {months.map((m, i) => (
            <div
              key={m}
              onClick={() => {
                setMonth(i);
                setOpen(false);
              }}
              className={`px-2 py-1 cursor-pointer hover:bg-gray-800 ${
                i === month ? "bg-[#F0B100] text-black" : ""
              }`}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YearDropdown({
  year,
  setYear,
}: {
  year: number;
  setYear: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => current - i);

  return (
    <div className="relative w-24">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#161618] border border-gray-700 rounded px-2 py-1 text-sm text-left"
      >
        {year}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#0a0a0a] border border-gray-700 rounded max-h-[140px] overflow-y-auto">
          {years.map((y) => (
            <div
              key={y}
              onClick={() => {
                setYear(y);
                setOpen(false);
              }}
              className={`px-2 py-1 cursor-pointer hover:bg-gray-800 ${
                y === year ? "bg-[#F0B100] text-black" : ""
              }`}
            >
              {y}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
