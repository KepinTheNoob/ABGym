import { useEffect, useRef, useState } from "react";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../service/api";
import Calendar from "../../components/calendar";
import CalendarPortal from "../../components/calendarPortal";

// --- Types ---
type Category = {
  id: number;
  name: string;
};

type AddExpenseModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
};

export default function AddExpenseModal({
  open,
  isVisible,
  onClose,
  onSubmit,
  isLoading = false,
}: AddExpenseModalProps) {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await API.get("/categories");
      return res.data;
    },
    enabled: open,
  });

  const [form, setForm] = useState({
    description: "",
    amount: "",
    categoryId: "",
    paymentMethod: "Cash",
    type: "Expense",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  const [dateObj, setDateObj] = useState<Date | undefined>(new Date());
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const dateRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (dateObj) {
      const offset = dateObj.getTimezoneOffset();
      const localDate = new Date(dateObj.getTime() - offset * 60 * 1000);
      setForm((prev) => ({
        ...prev,
        transactionDate: localDate.toISOString().split("T")[0],
      }));
    }
  }, [dateObj]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.categoryId) return;

    onSubmit({
      ...form,
      amount: Number(form.amount),
      categoryId: Number(form.categoryId),
    });
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-xl bg-[#161618] border border-gray-800 p-6 transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Add New Transaction</h3>
            <p className="text-sm text-gray-400">Record a new income or expense</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Type Toggle */}
          <div className="flex gap-4 p-1 bg-[#0a0a0a] rounded-lg border border-gray-800 w-fit">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, type: "Expense" }))}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                form.type === "Expense" 
                  ? "bg-red-500/20 text-red-500 shadow-sm" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, type: "Income" }))}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                form.type === "Income" 
                  ? "bg-green-500/20 text-green-500 shadow-sm" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Income
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-400">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Equipment Repair"
              className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="text-xs text-gray-400">Amount</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 pl-6 pr-3 py-2 text-sm focus:outline-none focus:border-yellow-500 no-spinner"
                  required
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="relative">
              <label className="text-xs text-gray-400">Category</label>
              <div className="relative mt-1">
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  onBlur={() => setIsCategoryOpen(false)}
                  onChange={(e) => {
                    setIsCategoryOpen(false);
                    handleChange(e);
                  }}
                  className="appearance-none w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 cursor-pointer"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="relative">
              <label className="text-xs text-gray-400">Date</label>
              <button
                type="button"
                ref={dateRef}
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="mt-1 w-full flex items-center justify-between rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm text-left focus:outline-none focus:border-yellow-500"
              >
                <span className={dateObj ? "text-white" : "text-gray-500"}>
                  {dateObj ? dateObj.toLocaleDateString("en-GB") : "Select Date"}
                </span>
                <CalendarIcon className="w-4 h-4 text-gray-500" />
              </button>
              
              {isCalendarOpen && dateRef.current && (
                <CalendarPortal
                  anchorEl={dateRef.current}
                  onClose={() => setIsCalendarOpen(false)}
                >
                  <Calendar
                    value={dateObj}
                    onSelect={(d) => {
                      setDateObj(d);
                      setIsCalendarOpen(false);
                    }}
                  />
                </CalendarPortal>
              )}
            </div>

            {/* Payment Method */}
            <div className="relative">
              <label className="text-xs text-gray-400">Payment Method</label>
              <div className="relative mt-1">
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                  onBlur={() => setIsPaymentOpen(false)}
                  onChange={(e) => {
                    setIsPaymentOpen(false);
                    handleChange(e);
                  }}
                  className="appearance-none w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 cursor-pointer"
                >
                  <option value="Cash">Cash</option>
                  <option value="CreditCard">Credit Card</option>
                  <option value="Transfer">Transfer</option>
                </select>
                <ChevronDown
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isPaymentOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-sm hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-black font-bold text-sm transition-colors disabled:opacity-50 ${
                form.type === "Income" 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-[#F0B100] hover:bg-[#d9a000]"
              }`}
            >
              {isLoading ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}