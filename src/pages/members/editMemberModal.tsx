import { useEffect, useRef, useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import Calendar from "../../components/calendar";
import CalendarPortal from "../../components/calendarPortal";

type MemberData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string | null;
  profilePhoto: string | null;
  joinDate: string;
  memberId?: string;
};

type EditMemberModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: MemberData | null;
  isLoading?: boolean;
};

export default function EditMemberModal({
  open,
  isVisible,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: EditMemberModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });

  const [dobDate, setDobDate] = useState<Date | undefined>();
  const [isDobCalendarOpen, setIsDobCalendarOpen] = useState(false);
  const dobRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        dob: initialData.dob ? initialData.dob.split("T")[0] : "",
        address: initialData.address || "",
      });

      if (initialData.dob) {
        const [y, m, d] = initialData.dob.split("T")[0].split("-").map(Number);
        setDobDate(new Date(y, m - 1, d));
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (dobDate) {
      const offset = dobDate.getTimezoneOffset();
      const localDate = new Date(dobDate.getTime() - offset * 60 * 1000);
      setForm((prev) => ({
        ...prev,
        dob: localDate.toISOString().split("T")[0],
      }));
    }
  }, [dobDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      ...form,
      dob: new Date(form.dob).toISOString(),
    });
  };

  if (!open || !initialData) return null;

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
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Edit Profile Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- Profile Summary Section --- */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-gray-700 overflow-hidden">
            <img
              src={initialData.profilePhoto || "https://via.placeholder.com/150"}
              alt={initialData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-white font-medium text-lg">{initialData.name}</h4>
            <p className="text-gray-500 text-sm">ID: #{initialData.id.substring(0, 8)}</p>
            <p className="text-gray-600 text-xs mt-0.5">
              Joined: {new Date(initialData.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* --- Form --- */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Bronze Nature"
                className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Phone Number */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Date of Birth</label>
              <div className="relative">
                <button
                  type="button"
                  ref={dobRef}
                  onClick={() => setIsDobCalendarOpen(!isDobCalendarOpen)}
                  className="w-full flex items-center justify-between rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-left focus:outline-none focus:border-yellow-500 transition-colors"
                >
                  <span className={dobDate ? "text-white" : "text-gray-500"}>
                    {dobDate ? dobDate.toLocaleDateString("en-GB") : "Select Date"}
                  </span>
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
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
          </div>

          {/* Address */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Street Name, City, Country"
              className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          {/* --- Footer Buttons --- */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-[#1E2939] text-gray-300 text-sm font-medium hover:bg-[#2B3A55] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-[#F0B100] text-black font-bold text-sm hover:bg-[#d9a000] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}