import { createContext, useContext, useState } from "react";

type LiveAttendance = {
  id: string;
  name: string;
  expirationDate: string;
  plan?: string;
  checkInTime: string;
  profilePhoto?: string | null;
} | null;

const AttendanceContext = createContext<{
  liveAttendance: LiveAttendance;
  setLiveAttendance: (v: LiveAttendance) => void;
} | null>(null);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [liveAttendance, setLiveAttendance] = useState<LiveAttendance>(null);

  return (
    <AttendanceContext.Provider value={{ liveAttendance, setLiveAttendance }}>
      {children}  
    </AttendanceContext.Provider>
  );
}

export const useAttendance = () => {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used inside provider");
  return ctx;
};
