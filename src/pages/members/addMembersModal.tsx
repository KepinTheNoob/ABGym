import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Calendar from "../../components/calendar";
import CalendarPortal from "../../components/calendarPortal";

type AddMembersModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

const AddMembersModal = ({
  open,
  isVisible,
  onClose,
  onSubmit,
}: AddMembersModalProps) => {
  // 1. STATE: Removed 'amountPaid'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    profilePhoto: null,
    status: "Aktif",
    joinDate: "",
    paymentMethod: "",
    planId: "",
  });

  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  // Date of birth date
  const [dobDate, setDobDate] = useState<Date | undefined>();
  const [isDobCalendarOpen, setIsDobCalendarOpen] = useState(false);

  // Membership Start date
  const [joinDate, setJoinDate] = useState<Date | undefined>();
  const [isJoinCalendarOpen, setIsJoinCalendarOpen] = useState(false);

  // auto flip portal
  const joinRef = useRef<HTMLButtonElement>(null);
  const dobRef = useRef<HTMLButtonElement>(null);

  

  // date member
  useEffect(() => {
  if (!joinDate) return;

  setFormData((prev) => ({
    ...prev,
  joinDate: joinDate.toISOString().split("T")[0],
  }));
  }, [joinDate]);

  // dob
  useEffect(() => {
  if (!dobDate) return;

  setFormData((prev) => ({
    ...prev,
    dob: dobDate.toISOString().split("T")[0],
  }));
}, [dobDate]);


  // 2. EFFECT: Calculate Expiration
  useEffect(() => {
    if (!formData.planId || !formData.joinDate) {
      setExpirationDate(null);
      return;
    }
    const start = new Date(formData.joinDate);
    const expiry = new Date(start);

    if (formData.planId === "1") expiry.setDate(start.getDate() + 7);
    if (formData.planId === "2") expiry.setMonth(start.getMonth() + 1);
    if (formData.planId === "3") expiry.setFullYear(start.getFullYear() + 1);

    setExpirationDate(expiry);
  }, [formData.planId, formData.joinDate]);

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
              <div className="w-24 h-24 rounded-full border border-gray-700 flex items-center justify-center text-gray-500">
                ??
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-800 text-sm hover:bg-gray-700"
              >
                Upload Photo
              </button>
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
              <div className="relative">
                <label className="text-xs text-gray-400">Date of Birth</label>

              <button
                ref={dobRef}
                type="button"
                onClick={() => setIsDobCalendarOpen(!isDobCalendarOpen)}
                className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-left text-sm"
              >
                {dobDate ? dobDate.toLocaleDateString("en-GB") : "Select Date"}
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
                    className="input appearance-none bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2 text-sm w-full"
                    required
                  >
                    <option value="">Select Membership</option>
                    <option value="1">Weekly</option>
                    <option value="2">Monthly</option>
                    <option value="3">Yearly</option>
                  </select>
                  <ChevronDown
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isMembershipOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400">Start Date</label>

              <button
                ref={joinRef}
                type="button"
                onClick={() => setIsJoinCalendarOpen(!isJoinCalendarOpen)}
                className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-left text-sm"
              >
                {joinDate ? joinDate.toLocaleDateString("en-GB") : "Select Date"}
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
            <div className="mt-3 text-sm text-yellow-400">
              Expiration Date:{" "}
              {expirationDate ? expirationDate.toLocaleDateString() : "--"}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#F0B100] text-black font-bold text-sm hover:bg-[#d9a000]"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersModal;