import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type PlanForm = {
  name: string;
  price: string;
  durationValue: string;
  durationUnit: string;
};

type PlanModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: number;
    durationValue: number;
    durationUnit: string;
  }) => void;
  initialData?: {
    name: string;
    price: number;
    durationValue: number;
    durationUnit: string;
  } | null;
  isLoading?: boolean;
};

export default function PlansModal({
  open,
  isVisible,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: PlanModalProps) {
  const [form, setForm] = useState<PlanForm>({
    name: "",
    price: "",
    durationValue: "",
    durationUnit: "MONTH", // Default
  });

  const [isUnitOpen, setIsUnitOpen] = useState(false); // For custom dropdown

  // Prefill
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        price: String(initialData.price),
        durationValue: String(initialData.durationValue),
        durationUnit: initialData.durationUnit,
      });
    } else {
      setForm({ name: "", price: "", durationValue: "", durationUnit: "MONTH" });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.durationValue) return;

    onSubmit({
      name: form.name,
      price: Number(form.price),
      durationValue: Number(form.durationValue),
      durationUnit: form.durationUnit,
    });
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-xl bg-[#161618] border border-gray-800 p-6 transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {initialData ? "Edit Plan" : "Add New Plan"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Plan Name */}
          <div>
            <label className="text-xs text-gray-400">Plan Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Premium Monthly"
              className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs text-gray-400">Price</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                Rp
              </span>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="150000"
                className="w-full no-spinner rounded-lg bg-[#0a0a0a] border border-gray-800 pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Duration: Split into Value and Unit */}
          <div>
            <label className="text-xs text-gray-400">Duration</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {/* Duration Value (Number) */}
              <input
                name="durationValue"
                type="number"
                value={form.durationValue}
                onChange={handleChange}
                placeholder="1"
                className="w-full no-spinner rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
              />

              {/* Duration Unit (Dropdown) */}
              <div className="relative">
                <select
                  name="durationUnit"
                  value={form.durationUnit}
                  onClick={() => setIsUnitOpen(!isUnitOpen)}
                  onBlur={() => setIsUnitOpen(false)}
                  onChange={(e) => {
                    setIsUnitOpen(false);
                    handleChange(e);
                  }}
                  className="appearance-none w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 cursor-pointer"
                >
                  <option value="Day">Days</option>
                  <option value="Week">Weeks</option>
                  <option value="Month">Months</option>
                  <option value="Year">Years</option>
                </select>
                <ChevronDown
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isUnitOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-[#F0B100] text-black text-sm font-bold disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "✓ Save Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}