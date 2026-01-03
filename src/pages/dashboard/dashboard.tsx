import RevenueChart from "./revenueChart";
import AttendanceChart from "../finances/attendanceChart";
import { RecentActivity } from "./recentActivity";
import { ExpiringMembersWidget } from "./ExpiringWidgets";
import { useAttendance } from "../../components/attendanceContext";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../service/api";
import { Member } from "../../types/types";

export default function Dashboard() {
  const { liveAttendance } = useAttendance();

  let remainingDays: number | null = null;
  let statusLabel = "";
  let statusColor = "";
  let dotColor = "";

  if (liveAttendance) {
    remainingDays = Math.ceil(
      (new Date(liveAttendance.expirationDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );

    if (remainingDays <= 0) {
      statusLabel = "Expired";
      statusColor = "text-red-400";
      dotColor = "bg-red-400";
    } else if (remainingDays <= 7) {
      statusLabel = "Expiring";
      statusColor = "text-yellow-400";
      dotColor = "bg-yellow-400";
    } else {
      statusLabel = "Active";
      statusColor = "text-green-400";
      dotColor = "bg-green-400";
    }
  }

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await API.get("/members");
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  const aktifCount = members.filter((m) => m.status === "Active").length;
  const expiring7DaysCount = members.filter(
    (m) => m.status === "Expiring"
  ).length;
  const expiredCount = members.filter((m) => m.status === "Expired").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const newTodayCount = members.filter((m) => {
    if (!m.joinDate) return false;
    return isSameDay(new Date(m.joinDate), new Date());
  }).length;

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await API.get("/transactions");
      return res.data;
    },
    staleTime: 1000 * 60,
  });

  const stats = (() => {
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
      const d = parseDate(t.transactionDate);
      const m = d.getMonth();
      const y = d.getFullYear();
      const amt = Number(t.amount);

      if (m === currentMonth && y === currentYear) {
        if (t.type === "Income") currentRevenue += amt;
        else currentExpenses += amt;
      } else if (m === prevMonth && y === prevYear) {
        if (t.type === "Income") prevRevenue += amt;
        else prevExpenses += amt;
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
  })();

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1">
          Welcome back, Admin
        </h2>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Here's what's happening at AB Gym today.
        </p>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Total Member Aktif
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-5xl font-bold">{aktifCount}</h3>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Pendapatan Bulanan
            </p>
            <div className="flex items-end gap-2 pb-2">
              <h3 className="text-4xl md:text-4xl font-bold">
                Rp. {stats.revenue.toLocaleString()}
              </h3>
            </div>
            <span
              className={`text-xs md:text-sm ${
                stats.revenueChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {stats.revenueChange >= 0 ? "+" : ""}
              {stats.revenueChange.toFixed(1)}% vs last month
            </span>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Membership Akan Habis (7 Hari)
            </p>

            <div className="flex items-end gap-2">
              <h3 className="text-yellow-400 text-5xl md:text-5xl font-bold">
                {expiring7DaysCount}
              </h3>

              {expiring7DaysCount > 0 && (
                <span className="text-yellow-400 text-xs md:text-sm mb-1">
                  Follow up
                </span>
              )}
            </div>
            <span className="text-gray-400 text-xs md:text-sm mb-1">
              Periode Perpanjangan
            </span>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Member Kadaluarsa
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-5xl font-bold">{expiredCount}</h3>
            </div>
            <span className="text-gray-400 text-xs md:text-sm mb-1">
              Segera Perbarui
            </span>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 col-span-1 lg:col-span-2 min-h-[260px] lg:min-h-[340px]">
            <RevenueChart />
          </div>
          {/* Live Attendance */}
          <div className="rounded-2xl border border-gray-800 bg-[#161618] p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 text-gray-300 justify-center">
              <span>🏆</span>
              <p className="font-semibold">Live Attendance</p>
            </div>
            {liveAttendance ? (
              <>
                {/* Profile */}
                <div className="flex-1 flex flex-col items-center justify-center gap-2 pt-2">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-[2px] border-yellow-400 flex items-center justify-center bg-gray-900 overflow-hidden">
                      {/* FIX: Check for profilePhoto, fallback to initial if missing */}
                      {liveAttendance.profilePhoto ? (
                        <img
                          src={liveAttendance.profilePhoto}
                          alt={liveAttendance.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                          {liveAttendance.name[0]}
                        </div>
                      )}
                    </div>
                    <span
                      className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#161618] ${dotColor}`}
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-white text-lg font-bold">
                      {liveAttendance.name}
                    </p>
                    <p
                      className={`${statusColor} text-sm flex items-center justify-center gap-1`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      {statusLabel}
                    </p>
                  </div>
                </div>

                {/* ... existing remaining days and time code ... */}
                <div className="flex justify-between text-gray-400 text-xs sm:text-sm pb-2">
                  <p>Remaining:</p>
                  <p className="text-white">{remainingDays} days</p>
                </div>

                <div className="flex justify-between text-gray-400 text-xs sm:text-sm pt-2">
                  <p>Time:</p>
                  <p className="text-white">
                    {new Date(liveAttendance.checkInTime).toLocaleTimeString()}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                Waiting for scan...
              </div>
            )}
          </div>
        </div>

        {/*Bottom Content*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-6 items-stretch">
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 min-h-[240px] lg:min-h-[340px]">
            <AttendanceChart />
          </div>

          {/* Recent Activity */}
          <div className="h-full">
            <RecentActivity />
          </div>

          {/* Membership Status */}
          <div className="h-full">
            <ExpiringMembersWidget onNavigate={(page) => console.log(page)} />
          </div>
        </div>
      </main>
    </div>
  );
}
