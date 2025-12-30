import RevenueChart from "./revenueChart";
import AttendanceChart from "./attendanceChart";
import { RecentActivity } from "./recentActivity";
import { ExpiringMembersWidget } from "./ExpiringWidgets";
import { useAttendance } from "../../components/attendanceContext";

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
              <h3 className="text-2xl md:text-3xl font-bold">1370</h3>
              <span className="text-green-400 text-xs md:text-sm mb-1">
                -2%
              </span>
            </div>
            <span className="text-gray-400 text-xs md:text-sm mb-1">
              vs Last month
            </span>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Pendapatan Bulanan
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">Rp. 1.500.000</h3>
              <span className="text-green-400 text-xs md:text-sm mb-1">
                +2%
              </span>
            </div>
            <span className="text-gray-400 text-xs md:text-sm mb-1">
              vs Last month
            </span>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Member Baru Hari ini
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">13</h3>
              <span className="text-red-400 text-xs md:text-sm mb-1">+2%</span>
            </div>
            <span className="text-gray-400 text-xs md:text-sm mb-1">
              vs Yesterday
            </span>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Member Kadaluarsa
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">13</h3>
              <span className="text-red-400 text-xs md:text-sm mb-1">+2%</span>
            </div>
            <span className="text-gray-400 text-xs md:text-sm mb-1">
              vs Yesterday
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
                    <div className="w-24 h-24 rounded-full border-[2px] border-yellow-400 flex items-center justify-center bg-gray-900">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {liveAttendance.name[0]}
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#161618]" />
                  </div>

                  <div className="text-center">
                    <p className="text-white text-lg font-bold">
                      {liveAttendance.name}
                    </p>
                    <p
                      className={`${statusColor} text-green-400 text-sm flex items-center justify-center gap-1`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      {statusLabel}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-gray-400 text-xs sm:text-sm pb-2">
                  <p>Remaining:</p>
                  <p className="text-white">
                    {Math.ceil(
                      (new Date(liveAttendance.expirationDate).getTime() -
                        Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
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
