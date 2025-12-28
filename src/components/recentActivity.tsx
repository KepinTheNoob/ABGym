import { UserCheck, UserPlus, Dumbbell, DollarSign } from 'lucide-react';

const activities = [
  {
    id: 1,
    name: 'Maruzesty',
    action: 'Checked-in at Main Entrance',
    time: '2m ago',
    icon: UserCheck,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    id: 2,
    name: 'New Member: Super Creek',
    action: 'Premium Plan Registration',
    time: '15m ago',
    icon: UserPlus,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    id: 3,
    name: 'David Laid',
    action: 'Checked-in at Weight Room',
    time: '24m ago',
    icon: Dumbbell,
    iconBg: 'bg-gray-700',
    iconColor: 'text-gray-400',
  },
  {
    id: 4,
    name: 'Payment Received',
    action: 'Kevin Kaslana - Monthly Sub',
    time: '1h ago',
    icon: DollarSign,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
  {
    id: 5,
    name: 'Kitasan Ireng',
    action: 'Class Booking: Yoga',
    time: '1h ago',
    icon: Dumbbell,
    iconBg: 'bg-gray-700',
    iconColor: 'text-gray-400',
  },
];

export function RecentActivity() {
  
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white">Recent Activity</h3> 
        <p className='text-xs text-gray-500'></p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 ${activity.iconBg} rounded-lg flex-shrink-0`}>
              <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-yellow-500 text-sm mb-0.5">{activity.name}</p>
              <p className="text-gray-400 text-xs">{activity.action}</p>
            </div>
            
            <span className="text-gray-500 text-xs flex-shrink-0">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}