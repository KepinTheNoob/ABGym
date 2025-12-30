import { UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../service/api";

type Member = {
  name: string;
};

type Attendance = {
  id: string;
  checkInTime: string;
  member: Member;
};

export function RecentActivity() {
  const { data: attendanceLogs = [], isLoading } = useQuery<Attendance[]>({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const res = await API.get("/attendances");
      return res.data.sort((a: Attendance, b: Attendance) => 
        new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      );
    },
    refetchInterval: 30000,
  });

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 sm:p-5 md:p-6 h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-white text-sm">Recent Check-ins</h3>
        <span className="text-gray-500 text-xs">
          {attendanceLogs.length} logs
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
              <div className="w-8 h-8 bg-gray-800 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-800 rounded w-1/2" />
                <div className="h-2 bg-gray-800 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : attendanceLogs.length === 0 ? (
          null
        ) : (
          attendanceLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 bg-gray-800/40 p-2.5 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-yellow-500 text-xs sm:text-sm truncate font-medium">
                  {log.member?.name || "Unknown Member"}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  Checked-in at Main Entrance
                </p>
              </div>

              <span className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0 font-mono">
                {getTimeAgo(log.checkInTime)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}