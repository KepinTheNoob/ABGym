import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { API } from "../../service/api"; // Ensure this path is correct
import CalendarPortal from "../../components/calendarPortal";
import Calendar from "../../components/calendar";

// Define Plan Type
type Plan = {
  id: number;
  name: string;
  price: number;
  durationValue: number;
  durationUnit: "Day" | "Week" | "Month" | "Year";
};

type RenewalMembersModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
};

export default function RenewalMembersModal({
  open,
  isVisible,
  onClose,
  onSubmit,
  isLoading = false,
}: RenewalMembersModalProps) {
  // --- 1. FETCH PLANS ---
  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await API.get("/plans");
      return res.data;
    },
    enabled: open, // Only fetch when open
  });

  // Local state for the form
  const [formData, setFormData] = useState({
    planId: "", // Changed from planType to planId to match logic
    joinDate: "", // Using 'joinDate' (start date) for consistency
    paymentMethod: "",
    amountPaid: "",
  });

  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Calendar State
  const [joinDate, setJoinDate] = useState<Date | undefined>();
  const [isJoinCalendarOpen, setIsJoinCalendarOpen] = useState(false);
  const joinRef = useRef<HTMLButtonElement>(null);

  // Sync Calendar selection to form data
  useEffect(() => {
    if (!joinDate) return;
    setFormData((prev) => ({
      ...prev,
      joinDate: joinDate.toISOString().split("T")[0],
    }));
  }, [joinDate]);

  // --- 2. CALCULATE EXPIRATION ---
  useEffect(() => {
    if (!formData.planId || !formData.joinDate) {
      setExpirationDate(null);
      return;
    }

    // Find selected plan
    const selectedPlan = plans.find((p) => p.id === Number(formData.planId));
    if (!selectedPlan) return;

    // Parse date correctly
    const [year, month, day] = formData.joinDate.split("-").map(Number);
    const start = new Date(year, month - 1, day);

    const expiry = new Date(start);

    switch (selectedPlan.durationUnit) {
      case "Day":
        expiry.setDate(expiry.getDate() + selectedPlan.durationValue);
        break;
      case "Week":
        expiry.setDate(expiry.getDate() + selectedPlan.durationValue * 7);
        break;
      case "Month":
        expiry.setMonth(expiry.getMonth() + selectedPlan.durationValue);
        break;
      case "Year":
        expiry.setFullYear(expiry.getFullYear() + selectedPlan.durationValue);
        break;
    }

    expiry.setDate(expiry.getDate() + 1);

    expiry.setHours(23, 59, 59, 999);

    setExpirationDate(expiry);
  }, [formData.planId, formData.joinDate, plans]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, expirationDate });
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
      bg-black/60 transition-opacity duration-300
      ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-lg rounded-xl bg-[#161618] border border-gray-800 p-6
          transform transition-all duration-300
          ${
            isVisible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Renewal Membership</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Renewing for <span className="text-white">Alex Morgan</span>{" "}
          (GYM-4521)
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Membership */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">
                New Membership Type
              </label>
              <div className="relative mt-1">
                <select
                  onClick={() => setIsMembershipOpen(!isMembershipOpen)}
                  onBlur={() => setIsMembershipOpen(false)}
                  onChange={(e) => {
                    setIsMembershipOpen(false);
                    handleChange(e);
                  }}
                  name="planId" // Changed to planId
                  className="
                    appearance-none w-full bg-[#0a0a0a] text-white text-sm
                    px-4 pr-10 py-2.5 rounded-lg border border-gray-800
                    cursor-pointer
                  "
                >
                  <option value="">Select membership</option>
                  {/* Dynamic Options */}
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  className={`
                    pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                    w-4 h-4 text-gray-400
                    transition-transform duration-200
                    ${isMembershipOpen ? "rotate-180" : ""}
                  `}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs text-gray-400">New Start Date</label>
              <button
                ref={joinRef}
                type="button"
                onClick={() => setIsJoinCalendarOpen(!isJoinCalendarOpen)}
                className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-left text-sm"
              >
                {joinDate
                  ? joinDate.toLocaleDateString("en-GB")
                  : "Select Date"}
              </button>
              {isJoinCalendarOpen && joinRef.current && (
                <CalendarPortal
                  anchorEl={joinRef.current}
                  onClose={() => setIsJoinCalendarOpen(false)}
                >
                  <Calendar
                    value={joinDate}
                    onSelect={(date) => {
                      setJoinDate(date);
                      setIsJoinCalendarOpen(false);
                    }}
                  />
                </CalendarPortal>
              )}
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="text-xs text-gray-400">
              Calculated Expiration Date
            </label>
            <div className="mt-1 rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm text-yellow-400">
              {expirationDate
                ? expirationDate.toLocaleDateString("en-GB") // dd/mm/yyyy
                : "—"}
            </div>
          </div>

          {/* Payment */}
          <div className="pt-3 border-t border-gray-800">
            <h4 className="text-sm font-semibold mb-3">Payment Details</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Payment Method</label>
                <div className="relative group mt-1">
                  <select
                    name="paymentMethod"
                    onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                    onBlur={() => setIsPaymentOpen(false)}
                    onChange={(e) => {
                      setIsPaymentOpen(false);
                      handleChange(e);
                    }}
                    className="
                      appearance-none w-full bg-[#0a0a0a] text-white text-sm
                      px-4 pr-10 py-2.5 rounded-lg border border-gray-800
                      cursor-pointer
                    "
                  >
                    <option>Cash</option>
                    <option>Transfer</option>
                  </select>

                  <ChevronDown
                    className={`
                      pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                      w-4 h-4 text-gray-400
                      transition-transform duration-200
                      ${isPaymentOpen ? "rotate-180" : ""}
                    `}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Amount Paid</label>
                <input
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-[#F0B100] text-black text-sm font-bold disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "✓ Confirm Renewal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
