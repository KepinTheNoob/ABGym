import { UserCheck, UserPlus, Dumbbell, DollarSign } from "lucide-react";

const activities = [
  {
    id: 1,
    name: "Maruzesty",
    action: "Checked-in at Main Entrance",
    time: "2m ago",
    icon: UserCheck,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    name: "New Member: Super Creek",
    action: "Premium Plan Registration",
    time: "15m ago",
    icon: UserPlus,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    name: "David Laid",
    action: "Checked-in at Weight Room",
    time: "24m ago",
    icon: Dumbbell,
    iconBg: "bg-gray-700",
    iconColor: "text-gray-400",
  },
  {
    id: 4,
    name: "Payment Received",
    action: "Kevin Kaslana - Monthly Sub",
    time: "1h ago",
    icon: DollarSign,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    id: 5,
    name: "Kitasan Ireng",
    action: "Class Booking: Yoga",
    time: "1h ago",
    icon: Dumbbell,
    iconBg: "bg-gray-700",
    iconColor: "text-gray-400",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 sm:p-5 md:p-6 h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-white text-sm">Recent Activity</h3>
        <span className="text-gray-500 text-xs">{activities.length} logs</span>
      </div>

      {/* List (fills remaining space like chart) */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 bg-gray-800/40 p-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className={`p-2 ${activity.iconBg} rounded-lg flex-shrink-0`}>
              <activity.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activity.iconColor}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-yellow-500 text-xs sm:text-sm truncate">
                {activity.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {activity.action}
              </p>
            </div>

            <span className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
