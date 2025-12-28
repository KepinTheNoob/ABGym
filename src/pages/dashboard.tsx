import RevenueChart from "../components/revenueChart";
import AttendanceChart from "../components/attendanceChart"
import { RecentActivity } from "../components/recentActivity";


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome back, Admin</h2>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Here's what's happening at AB Gym today.
        </p>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base">Total Active Members</p>
            <h3 className="text-2xl md:text-3xl font-bold">1,240</h3>
            <p className="text-red-500 text-xs md:text-sm">-2% vs last month</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base">Monthly Revenue</p>
            <h3 className="text-2xl md:text-3xl font-bold">$45,200</h3>
            <p className="text-green-500 text-xs md:text-sm">+12.5% vs last month</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base">New Members Today</p>
            <h3 className="text-2xl md:text-3xl font-bold">+6</h3>
            <p className="text-green-500 text-xs md:text-sm">+1.5% vs yesterday</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base">Expired Members</p>
            <h3 className="text-2xl md:text-3xl font-bold">85</h3>
            <p className="text-red-500 text-xs md:text-sm">-7% action needed</p>
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

            {/* Profile */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2 pt-2">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-[2px] border-yellow-400 flex items-center justify-center bg-gray-900">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ?
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#161618]" />
              </div>

              <div className="text-center">
                <p className="text-white text-lg font-bold">Maruzensky</p>
                <p className="text-green-400 text-sm flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Active
                </p>
              </div>
            </div>
            <div className="flex justify-between text-gray-400 text-xs sm:text-sm pb-2">
              <p>Remaining:</p>
              <p className="text-white">124 days</p>
            </div>

            <div className="flex justify-between text-gray-400 text-xs sm:text-sm pt-2">
              <p>Time:</p>
              <p className="text-white">08:32:15 AM</p>
            </div>
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
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-6">
            <p className="font-semibold mb-4">Membership Status</p>
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm">Active 82%</p>
                <div className="w-full bg-gray-700 h-2 rounded">
                  <div className="h-2 bg-yellow-500 rounded w-[82%]" />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm">Expired 12%</p>
                <div className="w-full bg-gray-700 h-2 rounded">
                  <div className="h-2 bg-red-500 rounded w-[12%]" />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm">Pending 6%</p>
                <div className="w-full bg-gray-700 h-2 rounded">
                  <div className="h-2 bg-gray-400 rounded w-[6%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
