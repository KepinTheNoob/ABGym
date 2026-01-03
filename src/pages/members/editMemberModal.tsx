import { useEffect, useRef, useState } from "react";
import { X, Calendar as CalendarIcon, Camera } from "lucide-react";
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

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        dob: initialData.dob ? initialData.dob.split("T")[0] : "",
        address: initialData.address || "",
      });

      setPreview(initialData.profilePhoto);
      setProfilePhoto(null);

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
    if (!initialData) return;

    const payload = new FormData();

    payload.append("id", initialData.id);
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("address", form.address);

    if (form.dob) {
      payload.append("dob", new Date(form.dob).toISOString());
    }

    if (profilePhoto) {
      payload.append("profilePhoto", profilePhoto);
    }

    onSubmit(payload);
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Edit Profile Member</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div
            className="relative w-20 h-20 rounded-full border-2 border-gray-700 overflow-hidden group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={preview || "https://via.placeholder.com/150"}
              alt={initialData.name}
              className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setProfilePhoto(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">{initialData.name}</h4>
            <p className="text-sm text-gray-500">{initialData.email}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-yellow-500 text-xs mt-1 hover:underline"
            >
              Change Photo
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Bronze Nature"
                className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Email Address
              </label>
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
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Date of Birth
              </label>
              <div className="relative">
                <button
                  type="button"
                  ref={dobRef}
                  onClick={() => setIsDobCalendarOpen(!isDobCalendarOpen)}
                  className="w-full flex items-center justify-between rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-left focus:outline-none focus:border-yellow-500 transition-colors"
                >
                  <span className={dobDate ? "text-white" : "text-gray-500"}>
                    {dobDate
                      ? dobDate.toLocaleDateString("en-GB")
                      : "Select Date"}
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

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Street Name, City, Country"
              className="w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

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
