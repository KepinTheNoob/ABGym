import {
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../../service/api";
import toast, { Toaster } from "react-hot-toast";
import AddExpenseModal from "./addExpenseModal";
import RevenueExpenseChart from "./revenueExpenseChart";

type TransactionType = "Income" | "Expense";
type PaymentMethod = "Cash" | "CreditCard" | "Transfer";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Transaction {
  id: string;
  memberId?: string | null;
  categoryId?: number | null;
  description: string;
  type: TransactionType;
  amount: string;
  paymentMethod: PaymentMethod;
  transactionDate: string;
  category?: Category;
}

const COLORS = [
  { hex: "#eab308", tw: "bg-yellow-500" }, // Yellow
  { hex: "#22c55e", tw: "bg-green-500" }, // Green
  { hex: "#a855f7", tw: "bg-purple-500" }, // Purple
  { hex: "#3b82f6", tw: "bg-blue-500" }, // Blue
  { hex: "#ef4444", tw: "bg-red-500" }, // Red
];

export default function Finances() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await API.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this transaction?")) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setIsAddOpen(true);
    setTimeout(() => setIsAddVisible(true), 10);
  };

  const closeAddModal = () => {
    setIsAddVisible(false);
    setTimeout(() => setIsAddOpen(false), 300);
  };

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await API.get("/transactions");
      return res.data;
    },
  });

  const handleExport = () => {
  if (!transactions.length) {
    toast.error("No data to export");
    return;
  }

  const separator = ";";

  const headers = [
    "ID",
    "Description",
    "Category",
    "Date",
    "Type",
    "Amount",
    "Payment Method",
  ];

  const escape = (value: any) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = transactions.map((t) => [
    escape(t.id),
    escape(t.description),
    escape(t.category?.name || "Uncategorized"),
    escape(new Date(t.transactionDate).toLocaleDateString()),
    escape(t.type),
    escape(t.amount),
    escape(t.paymentMethod),
  ]);

  const csvContent = [
    headers.map(escape).join(separator),
    ...rows.map((row) => row.join(separator)),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `financial_report_${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const createMutation = useMutation({
    mutationFn: async (newTransaction: any) => {
      const res = await API.post("/transactions", newTransaction);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      closeAddModal();
      toast.success("Transaction saved successfully");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to save transaction";
      toast.error(msg);
    },
  });

  const handleAddSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const parseDate = (dateStr: string) => new Date(dateStr.replace(" ", "T"));

    let currentRevenue = 0;
    let currentExpenses = 0;
    let prevRevenue = 0;
    let prevExpenses = 0;

    transactions.forEach((t) => {
      const tDate = parseDate(t.transactionDate);
      const tMonth = tDate.getMonth();
      const tYear = tDate.getFullYear();
      const amount = Number(t.amount);

      if (tMonth === currentMonth && tYear === currentYear) {
        if (t.type === "Income") currentRevenue += amount;
        else currentExpenses += amount;
      }
      
      else if (tMonth === prevMonth && tYear === prevYear) {
        if (t.type === "Income") prevRevenue += amount;
        else prevExpenses += amount;
      }
    });

    const currentProfit = currentRevenue - currentExpenses;
    const prevProfit = prevRevenue - prevExpenses;

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      revenue: currentRevenue,
      revenueChange: calculateChange(currentRevenue, prevRevenue),

      expenses: currentExpenses,
      expensesChange: calculateChange(currentExpenses, prevExpenses),

      netProfit: currentProfit,
      netProfitChange: calculateChange(currentProfit, prevProfit),
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    let total = 0;

    transactions
      .filter((t) => t.type === "Income")
      .forEach((t) => {
        const catName = t.category?.name || "Uncategorized";
        const amt = Number(t.amount);
        data[catName] = (data[catName] || 0) + amt;
        total += amt;
      });

    return Object.entries(data).map(([label, value], index) => ({
      label,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      displayPercentage: total > 0 ? Math.round((value / total) * 100) : 0,
      color: COLORS[index % COLORS.length],
    }));
  }, [transactions]);

  const conicGradient = useMemo(() => {
    if (categoryData.length === 0) return "conic-gradient(#333 0% 100%)";

    let currentPercentage = 0;
    const gradientParts = categoryData.map((item) => {
      const start = currentPercentage;
      const end = currentPercentage + item.percentage;
      currentPercentage = end;
      return `${item.color.hex} ${start}% ${end}%`;
    });

    return `conic-gradient(${gradientParts.join(", ")})`;
  }, [categoryData]);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      <Toaster position="top-right" />

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
            <button
              onClick={handleExport}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#1E2939] hover:bg-[#2B3A55] text-gray-300 font-bold rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 mr-2" strokeWidth={3} />
              Export Report
            </button>

            <button
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#F0B100] hover:bg-[#d9a000] text-black font-bold rounded-xl transition-colors"
            >
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
                TOTAL PENDAPATAN
              </h3>
              <div className="bg-green-500/20 p-1.5 rounded-md">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold mr-2">
                Rp{stats.revenue.toLocaleString()}
              </span>
              <span
                className={`font-medium text-sm ${
                  stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.revenueChange >= 0 ? "+" : ""}
                {stats.revenueChange.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-400">vs. last month</p>
          </div>

          {/* Card 2: Expenses */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-400">
                TOTAL PENGELUARAN
              </h3>
              <div className="bg-red-500/20 p-1.5 rounded-md">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold mr-2">
                Rp{stats.expenses.toLocaleString()}
              </span>
              {/* For expenses, positive change (increase) is usually bad (red), negative (decrease) is good (green) */}
              <span
                className={`font-medium text-sm ${
                  stats.expensesChange <= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.expensesChange >= 0 ? "+" : ""}
                {stats.expensesChange.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-400">vs. last month</p>
          </div>

          {/* Card 3: Net Profit */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-400">
                PROFIT BERSIH
              </h3>
              <div className="bg-yellow-500/20 p-1.5 rounded-md">
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold mr-2">
                Rp{stats.netProfit.toLocaleString()}
              </span>
              <span
                className={`font-medium text-sm ${
                  stats.netProfitChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stats.netProfitChange >= 0 ? "+" : ""}
                {stats.netProfitChange.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-400">vs. last month</p>
          </div>
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Revenue vs Expenses</h3>
                <p className="text-sm text-gray-400">Jan - Jun 2024</p>
              </div>
            </div>
            <div className="h-56 sm:h-64 md:h-72 relative w-full">
              <div className="flex-1 w-full min-h-[300px] h-full">
                <RevenueExpenseChart transactions={transactions} />
              </div>
            </div>
          </div>

          {/* DYNAMIC DONUT CHART */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-1">Tipe Pendapatan</h3>
              <p className="text-sm text-gray-400">
                Distribusi Bulanan terkini
              </p>
            </div>
            <div className="flex justify-center items-center h-64 relative">
              <div className="w-64 h-64 rounded-full border-8 border-gray-600 relative flex items-center justify-center">
                {/* Dynamic Gradient */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: conicGradient,
                    mask: "radial-gradient(transparent 55%, black 55%)",
                    WebkitMask: "radial-gradient(transparent 55%, black 55%)",
                  }}
                ></div>
                <div className="text-center z-10">
                  <p className="text-base font-semibold text-gray-400">Total</p>
                  <p className="text-2xl font-semibold">
                    Rp{stats.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Legend */}
            <div className="mt-6 space-y-3">
              {categoryData.length > 0 ? (
                categoryData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full ${item.color.tw} mr-2`}
                      ></span>
                      <span className="text-gray-400">
                        {item.label} ({item.displayPercentage}%)
                      </span>
                    </div>
                    <span className="font-medium">
                      Rp{item.value.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No revenue data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- Recent Transactions Table --- */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Transaksi Terkini</h3>
                <p className="text-sm text-gray-400">
                  Transaksi Keuangan terbaru
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
                  placeholder="Search by description or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#10141a] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent text-sm"
                />
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
                    <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                      Amount
                    </th>
                    <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">
                            {txn.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            #{txn.id.substring(0, 8)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {txn.category?.name || "General"}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(txn.transactionDate).toLocaleDateString()}
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
                          className={`px-6 py-4 text-left font-medium text-sm ${
                            txn.type === "Income"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {txn.type === "Income" ? "+" : "-"}Rp{" "}
                          {Number(txn.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(txn.id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                            >
                              {deleteMutation.isPending &&
                              deleteMutation.variables === txn.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-gray-400">
              <p className="mb-4 md:mb-0">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredTransactions.length
                )}{" "}
                of {filteredTransactions.length} transactions
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg font-medium ${
                      currentPage === i + 1
                        ? "bg-yellow-500 text-gray-900"
                        : "hover:bg-gray-800 transition-colors"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Mobile List --- */}
        <div className="md:hidden space-y-4">
          {paginatedTransactions.map((txn) => (
            <div
              key={txn.id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-200">{txn.description}</p>
                  <p className="text-xs text-gray-500">
                    #{txn.id.substring(0, 8)}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    txn.type === "Income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {txn.type === "Income" ? "+" : "-"}Rp
                  {Number(txn.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{txn.category?.name || "General"}</span>
                <span>
                  {new Date(txn.transactionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AddExpenseModal
        open={isAddOpen}
        isVisible={isAddVisible}
        onClose={closeAddModal}
        onSubmit={handleAddSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
