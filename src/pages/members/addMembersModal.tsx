import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../service/api";
import Calendar from "../../components/calendar";
import CalendarPortal from "../../components/calendarPortal";
import { Plan } from "../../types/types";

type AddMembersModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
};

const AddMembersModal = ({
  open,
  isVisible,
  onClose,
  onSubmit,
  isLoading = false,
}: AddMembersModalProps) => {
  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await API.get("/plans");
      return res.data;
    },
    enabled: open,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    profilePhoto: null as File | null,
    joinDate: "",
    paymentMethod: "Cash",
    planId: "",
  });

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  const [dobDate, setDobDate] = useState<Date | undefined>();
  const [isDobCalendarOpen, setIsDobCalendarOpen] = useState(false);

  const [joinDate, setJoinDate] = useState<Date | undefined>();
  const [isJoinCalendarOpen, setIsJoinCalendarOpen] = useState(false);

  const joinRef = useRef<HTMLButtonElement>(null);
  const dobRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!joinDate) return;

    const year = joinDate.getFullYear();
    const month = String(joinDate.getMonth() + 1).padStart(2, "0");
    const day = String(joinDate.getDate()).padStart(2, "0");
    const localDateString = `${year}-${month}-${day}`;

    setFormData((prev) => ({
      ...prev,
      joinDate: localDateString,
    }));
  }, [joinDate]);

  useEffect(() => {
    if (!dobDate) return;
    setFormData((prev) => ({
      ...prev,
      dob: dobDate.toISOString().split("T")[0],
    }));
  }, [dobDate]);

  useEffect(() => {
    if (!formData.planId || !formData.joinDate) {
      setExpirationDate(null);
      return;
    }

    const selectedPlan = plans.find((p) => p.id === Number(formData.planId));
    if (!selectedPlan) return;

    const [year, month, day] = formData.joinDate.split("-").map(Number);
    const start = new Date(year, month - 1, day);

    const expiry = new Date(start);

    let daysToAdd = 0;

    switch (selectedPlan.durationUnit) {
      case "Day":
        daysToAdd = selectedPlan.durationValue;
        break;

      case "Week":
        daysToAdd = selectedPlan.durationValue * 7;
        break;

      case "Month":
        daysToAdd = selectedPlan.durationValue * 30;
        break;

      case "Year":
        daysToAdd = selectedPlan.durationValue * 365;
        break;
    }

    expiry.setDate(expiry.getDate() + daysToAdd);

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

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("dob", formData.dob);
    payload.append("address", formData.address);
    payload.append("joinDate", formData.joinDate);
    payload.append("planId", formData.planId);
    payload.append("paymentMethod", formData.paymentMethod);


    if (formData.profilePhoto) {
      payload.append("profilePhoto", formData.profilePhoto);
    }
    console.log("paymentMethod:", formData.paymentMethod);
    onSubmit(payload);
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
        className={`w-full max-w-2xl rounded-xl bg-[#161618] border border-gray-800 p-6 transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Add New Member</h3>
            <p className="text-sm text-gray-400">
              Fill in the details to register a new member
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Profile Photo Placeholder */}
          <div>
            <label className="text-sm text-gray-400">Profile Photo</label>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-24 h-24 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 overflow-hidden">
                {formData.profilePhoto ? (
                  <img
                    src={URL.createObjectURL(formData.profilePhoto)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">??</span>
                )}
              </div>
              <label className="px-4 py-2 rounded-lg bg-gray-800 text-sm hover:bg-gray-700 cursor-pointer">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({
                        ...prev,
                        profilePhoto: file,
                      }));
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Full Name</label>
                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="input mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Email Address</label>
                <input
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="input mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Phone Number</label>
                <input
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className="input mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm"
                  required
                />
              </div>

              {/* DOB Calendar */}
              <div className="relative">
                <label className="text-xs text-gray-400">Date of Birth</label>
                <button
                  ref={dobRef}
                  type="button"
                  onClick={() => setIsDobCalendarOpen(!isDobCalendarOpen)}
                  className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-left text-sm"
                >
                  {dobDate
                    ? dobDate.toLocaleDateString("en-GB")
                    : "Select Date"}
                </button>
                {isDobCalendarOpen && dobRef.current && (
                  <CalendarPortal
                    anchorEl={dobRef.current}
                    onClose={() => setIsDobCalendarOpen(false)}
                  >
                    <Calendar
                      value={dobDate}
                      onSelect={(date) => {
                        setDobDate(date);
                        setIsDobCalendarOpen(false);
                      }}
                    />
                  </CalendarPortal>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-gray-400">Address</label>
              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="input mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Membership Details */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Membership Details</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Plan Selector */}
              <div className="relative">
                <label className="text-xs text-gray-400">Membership Type</label>
                <div className="relative mt-1">
                  <select
                    onClick={() => setIsMembershipOpen(!isMembershipOpen)}
                    onBlur={() => setIsMembershipOpen(false)}
                    onChange={(e) => {
                      setIsMembershipOpen(false);
                      handleChange(e);
                    }}
                    name="planId"
                    className="input appearance-none bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2 text-sm w-full cursor-pointer"
                    required
                  >
                    <option value="">Select Membership</option>
                    {/* --- DYNAMIC OPTIONS MAPPING --- */}
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isMembershipOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Start Date Calendar */}
              <div className="relative">
                <label className="text-xs text-gray-400">Start Date</label>
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

              {/* Payment Method */}
                <div className="relative">
                  <label className="text-xs text-gray-400">Payment Method</label>
                  <div className="relative mt-1">
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      className="appearance-none w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm cursor-pointer"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Transfer">Transfer</option>
                      <option value="CreditCard">Credit Card</option>
                    </select>

                    <ChevronDown
                      className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
                        isPaymentOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

            </div>

            {/* Expiration Display */}
            <div className="mt-3 text-sm text-yellow-400">
              Expiration Date:{" "}
              {expirationDate
                ? expirationDate.toLocaleDateString("en-GB")
                : "--"}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-[#F0B100] text-black font-bold text-sm hover:bg-[#d9a000] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Saving..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersModal;
