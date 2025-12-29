import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../service/api";
import CalendarPortal from "../../components/calendarPortal";
import Calendar from "../../components/calendar";
import { Member } from "../../types/types";

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
  member: Member | null;
};

export default function RenewalMembersModal({
  open,
  isVisible,
  onClose,
  onSubmit,
  isLoading = false,
  member,
}: RenewalMembersModalProps) {
  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await API.get("/plans");
      return res.data;
    },
    enabled: open,
  });

  const [formData, setFormData] = useState({
    planId: "",
    joinDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    amountPaid: "",
  });

  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [joinDate, setJoinDate] = useState<Date | undefined>(new Date());
  const [isJoinCalendarOpen, setIsJoinCalendarOpen] = useState(false);
  const joinRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        joinDate: new Date().toISOString().split("T")[0],
        amountPaid: "",
        planId: "",
      }));
      setJoinDate(new Date());
      setExpirationDate(null);
    }
  }, [open]);

  useEffect(() => {
    if (!joinDate) return;
    const offset = joinDate.getTimezoneOffset();
    const localDate = new Date(joinDate.getTime() - offset * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      joinDate: localDate.toISOString().split("T")[0],
    }));
  }, [joinDate]);

  useEffect(() => {
    if (!formData.planId || !formData.joinDate) {
      setExpirationDate(null);
      return;
    }

    const selectedPlan = plans.find((p) => p.id === Number(formData.planId));
    if (!selectedPlan) return;

    if (!formData.amountPaid) {
        setFormData(prev => ({...prev, amountPaid: String(selectedPlan.price)}))
    }

    const [y, m, d] = formData.joinDate.split("-").map(Number);
    const start = new Date(y, m - 1, d);
    const expiry = new Date(start);

    switch (selectedPlan.durationUnit) {
      case "Day":
        expiry.setDate(start.getDate() + selectedPlan.durationValue);
        break;
      case "Week":
        expiry.setDate(start.getDate() + selectedPlan.durationValue * 7);
        break;
      case "Month":
        expiry.setMonth(start.getMonth() + selectedPlan.durationValue);
        break;
      case "Year":
        expiry.setFullYear(start.getFullYear() + selectedPlan.durationValue);
        break;
    }
    
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
          <h3 className="text-lg font-bold text-white">Renewal Membership</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Member Info */}
        <p className="text-sm text-gray-400 mb-6">
          Renewing for <span className="text-white font-medium">{member?.name || "Unknown"}</span>{" "}
          {member?.id && <span className="text-xs">({member.id.substring(0, 8)})</span>}
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Membership */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                New Membership Type
              </label>
              <div className="relative">
                <select
                  onClick={() => setIsMembershipOpen(!isMembershipOpen)}
                  onBlur={() => setIsMembershipOpen(false)}
                  onChange={(e) => {
                    setIsMembershipOpen(false);
                    handleChange(e);
                  }}
                  name="planId"
                  className="
                    appearance-none w-full bg-[#0a0a0a] text-white text-sm
                    px-4 pr-10 py-2.5 rounded-lg border border-gray-800
                    cursor-pointer focus:outline-none focus:border-yellow-500
                  "
                  required
                >
                  <option value="">Select membership</option>
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
              <label className="text-xs text-gray-400 mb-1 block">New Start Date</label>
              <button
                ref={joinRef}
                type="button"
                onClick={() => setIsJoinCalendarOpen(!isJoinCalendarOpen)}
                className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-left text-sm text-white focus:outline-none focus:border-yellow-500"
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
            <label className="text-xs text-gray-400 mb-1 block">
              Calculated Expiration Date
            </label>
            <div className="rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-yellow-400">
              {expirationDate
                ? expirationDate.toLocaleDateString("en-GB")
                : "—"}
            </div>
          </div>

          {/* Payment */}
          <div className="pt-3 border-t border-gray-800">
            <h4 className="text-sm font-semibold mb-3 text-white">Payment Details</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Payment Method</label>
                <div className="relative group">
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
                      cursor-pointer focus:outline-none focus:border-yellow-500
                    "
                  >
                    <option value="Cash">Cash</option>
                    <option value="Transfer">Transfer</option>
                    <option value="CreditCard">Credit Card</option>
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
                <label className="text-xs text-gray-400 mb-1 block">Amount Paid</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                    <input
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 pl-6 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-[#F0B100] hover:bg-[#d9a000] text-black text-sm font-bold disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Saving..." : "✓ Confirm Renewal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}