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
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-6 col-span-1 lg:col-span-2 h-48 sm:h-64 flex items-center justify-center text-gray-500">
            (Revenue Trends Chart)
          </div>

          {/* Live Attendance */}
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-6 flex flex-col gap-4">
            <p className="font-semibold">Live Attendance</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-500" />
              <div>
                <p className="text-base sm:text-lg font-bold">Sarah Jenkins</p>
                <p className="text-green-400 text-xs sm:text-sm">Active</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Remaining: 124 days</p>
            <p className="text-gray-400 text-xs sm:text-sm">Time: 08:32 AM</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
          {/* Daily Attendance */}
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-6 h-48 sm:h-64 flex items-center justify-center text-gray-500">
            (Daily Attendance Chart)
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-6 text-gray-300">
            <p className="font-semibold mb-3">Recent Activity</p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Checked-in (2m ago)</li>
              <li>New Member: Mike Ross (15m ago)</li>
              <li>David Kim checked-in (24m ago)</li>
              <li>Payment Received (1h ago)</li>
              <li>Class Booking: Yoga (1h 15m ago)</li>
            </ul>
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
