import {
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  ChevronDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

type TransactionType = "Income" | "Expense";

interface Transaction {
  id: string;
  description: string;
  code: string;
  category: string;
  date: string;
  type: TransactionType;
  amount: number;
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Membership Renewal",
    code: "TXN-1043",
    category: "Membership",
    date: "Jun 28, 2024",
    type: "Income",
    amount: 600.0,
  },
  {
    id: "2",
    description: "Equipment Maintenance",
    code: "EXP-1022",
    category: "Maintenance",
    date: "Jun 27, 2024",
    type: "Expense",
    amount: 250.0,
  },
  {
    id: "3",
    description: "Personal Training Session",
    code: "TXN-1021",
    category: "Training",
    date: "Jun 26, 2024",
    type: "Income",
    amount: 150.0,
  },
  {
    id: "4",
    description: "Utilities Bill",
    code: "EXP-1020",
    category: "Utilities",
    date: "Jun 25, 2024",
    type: "Expense",
    amount: 450.0,
  },
  {
    id: "5",
    description: "Membership Renewal",
    code: "TXN-1018",
    category: "Membership",
    date: "Jun 25, 2024",
    type: "Income",
    amount: 450.0,
  },
  {
    id: "6",
    description: "Beverage Sales",
    code: "TXN-1017",
    category: "Retail",
    date: "Jun 24, 2024",
    type: "Income",
    amount: 85.0,
  },
  {
    id: "7",
    description: "Marketing Campaign",
    code: "EXP-1016",
    category: "Marketing",
    date: "Jun 23, 2024",
    type: "Expense",
    amount: 320.0,
  },
  {
    id: "8",
    description: "Class Registration Fee",
    code: "TXN-1015",
    category: "Classes",
    date: "Jun 22, 2024",
    type: "Income",
    amount: 120.0,
  },
];

export default function Finances() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Financial Reports
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Track income, expenses, and profitability.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#1E2939] hover:bg-[#2B3A55] text-gray-300 font-bold rounded-xl">
              <Download className="w-4 h-4 mr-2" strokeWidth={3} />
              Export Report
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#F0B100] hover:bg-[#d9a000] text-black font-bold rounded-xl">
              <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
              Add Expense
            </button>
          </div>
        </div>

        {/* --- Summary Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Revenue */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-400">
                TOTAL REVENUE
              </h3>
              <div className="bg-green-500/20 p-1.5 rounded-md">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold mr-2">
                $12,450
              </span>
              <span className="text-green-500 font-medium text-sm">+2%</span>
            </div>
            <p className="text-sm text-gray-400">vs. last month</p>
          </div>

          {/* Card 2: Expenses */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-400">
                TOTAL EXPENSES
              </h3>
              <div className="bg-red-500/20 p-1.5 rounded-md">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold mr-2">
                $3,120
              </span>
              <span className="text-red-500 font-medium text-sm">-18%</span>
            </div>
            <p className="text-sm text-gray-400">vs. last month</p>
          </div>

          {/* Card 3: Net Profit */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-400">NET PROFIT</h3>
              <div className="bg-yellow-500/20 p-1.5 rounded-md">
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold mr-2">
                $9,330
              </span>
              <span className="text-green-500 font-medium text-sm">+1%</span>
            </div>
            <p className="text-sm text-gray-400">vs. last month</p>
          </div>
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue vs Expenses (Line Chart Visual) */}
          <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Revenue vs Expenses</h3>
                <p className="text-sm text-gray-400">Jan - Jun 2024</p>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-56 sm:h-64 md:h-72 relative w-full">
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-6">
                {/* Y-axis Labels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] sm:text-xs text-gray-500 py-2">
                  <span>$14k</span>
                  <span>$10.5k</span>
                  <span>$7k</span>
                  <span>$3.5k</span>
                  <span>$0k</span>
                </div>

                {/* Chart SVG Lines */}
                <div className="w-full h-full border-l border-b border-gray-700 relative ml-8">
                  {/* Grid lines (optional visual aid) */}
                  <div className="absolute top-0 w-full border-t border-gray-800/50 h-1/4"></div>
                  <div className="absolute top-1/4 w-full border-t border-gray-800/50 h-1/4"></div>
                  <div className="absolute top-2/4 w-full border-t border-gray-800/50 h-1/4"></div>

                  {/* Revenue Line (Yellow) */}
                  <svg
                    className="absolute inset-0 h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <polyline
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2"
                      points="0,60 20,58 40,62 60,55 80,57 100,52"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  {/* Expense Line (Red) */}
                  <svg
                    className="absolute inset-0 h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      points="0,85 20,86 40,88 60,87 80,89 100,90"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                {/* X-axis Labels */}
                <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 pt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="text-sm text-gray-400">Expenses</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                <span className="text-sm text-gray-400">Revenue</span>
              </div>
            </div>
          </div>

          {/* Revenue by Type (Donut Visual) */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-1">Revenue by Type</h3>
              <p className="text-sm text-gray-400">
                Current Month Distribution
              </p>
            </div>

            {/* Donut Chart Visual */}
            <div className="flex justify-center items-center h-64 relative">
              <div className="w-48 h-48 rounded-full border-8 border-gray-700 relative flex items-center justify-center">
                {/* CSS Conic Gradient for Segment simulation */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#eab308 0% 55%, #22c55e 55% 80%, #a855f7 80% 92%, #3b82f6 92% 100%)",
                    mask: "radial-gradient(transparent 55%, black 55%)",
                    WebkitMask: "radial-gradient(transparent 55%, black 55%)",
                  }}
                ></div>
                <div className="text-center z-10">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold">$12.4k</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-3">
              {[
                {
                  label: "Membership (55%)",
                  color: "bg-yellow-500",
                  value: "$6,847",
                },
                {
                  label: "Personal Training (25%)",
                  color: "bg-green-500",
                  value: "$3,112",
                },
                {
                  label: "Retail & Beverages (12%)",
                  color: "bg-purple-500",
                  value: "$1,494",
                },
                {
                  label: "Class Fees (8%)",
                  color: "bg-blue-500",
                  value: "$996",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full ${item.color} mr-2`}
                    ></span>
                    <span className="text-gray-400">{item.label}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Recent Transactions Table --- */}
        <div className="hidden md:block overflow-x-auto -mx-6">
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Recent Transactions</h3>
                <p className="text-sm text-gray-400">
                  Latest financial activities
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full md:w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-4 h-4 text-gray-500" />
                </span>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#10141a] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex items-center justify-between w-full md:w-32 bg-[#10141a] border border-gray-800 rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-900 transition-colors text-sm">
                  <span>All Types</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                </button>
                <button className="flex items-center justify-between w-full md:w-36 bg-[#10141a] border border-gray-800 rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-900 transition-colors text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span>Jun 2024</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                      Description
                    </th>
                    <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                      Category
                    </th>
                    <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                      Date
                    </th>
                    <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                      Type
                    </th>
                    <th className="text-center px-5 py-4 text-gray-400 text-xs uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">
                          {txn.description}
                        </p>
                        <p className="text-xs text-gray-500">{txn.code}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {txn.category}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center text-sm ${
                            txn.type === "Income"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              txn.type === "Income"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {txn.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-medium text-sm ${
                          txn.type === "Income"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {txn.type === "Income" ? "+" : "-"}$
                        {txn.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-gray-400">
              <p className="mb-4 md:mb-0">Showing 8 of 47 transactions</p>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 rounded-lg bg-yellow-500 text-gray-900 font-medium">
                  1
                </button>
                <button className="px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                  3
                </button>
                <span className="px-1">...</span>
                <button className="px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                  6
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Mobile Transactions List --- */}
        <div className="md:hidden space-y-4">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-200">{txn.description}</p>
                  <p className="text-xs text-gray-500">{txn.code}</p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    txn.type === "Income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {txn.type === "Income" ? "+" : "-"}${txn.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>{txn.category}</span>
                <span>{txn.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
