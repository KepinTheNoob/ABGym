import { UserPlus, Search, DollarSign, AlertCircle, Clock, Plus } from 'lucide-react';
import { useState } from 'react';
import AddMembersModal from '../pages/members/addMembersModal';
import AddExpenseModal from '../pages/finances/addExpenseModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../service/api';

interface ExpiringMembersWidgetProps {
  onNavigate: (page: 'dashboard' | 'members' | 'finances' | 'classes' | 'settings') => void;
}

export function ExpiringMembersWidget({ onNavigate }: ExpiringMembersWidgetProps) {
  const [selectedDays, setSelectedDays] = useState<7 | 14 >(7);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);

  const queryClient = useQueryClient();

  // --- Mutations ---
  const createMemberMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API.post("/members", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      closeAddMemberModal();
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API.post("/transactions", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      closeAddExpenseModal();
    },
  });

  // --- Modal Handlers ---
  const openAddMemberModal = () => {
    setIsAddMemberOpen(true);
    setTimeout(() => setIsAddMemberVisible(true), 10);
  };

  const closeAddMemberModal = () => {
    setIsAddMemberVisible(false);
    setTimeout(() => setIsAddMemberOpen(false), 300);
  };

  const openAddExpenseModal = () => {
    setIsAddExpenseOpen(true);
    setTimeout(() => setIsAddExpenseVisible(true), 10);
  };

  const closeAddExpenseModal = () => {
    setIsAddExpenseVisible(false);
    setTimeout(() => setIsAddExpenseOpen(false), 300);
  };

  // --- Submit Handlers ---
  const handleAddMemberSubmit = (data: any) => {
    createMemberMutation.mutate({ ...data, planId: Number(data.planId) });
  };

  const handleAddExpenseSubmit = (data: any) => {
    createTransactionMutation.mutate(data);
  };

  const expiringMembers = {
    7: [
      { id: 'M-2341', name: 'Sarah Chen', type: 'Gold', expiresIn: '3 days', avatar: 'SC' },
      { id: 'M-2156', name: 'Michael Rodriguez', type: 'Silver', expiresIn: '5 days', avatar: 'MR' },
      { id: 'M-1987', name: 'Emily Watson', type: 'Gold', expiresIn: '6 days', avatar: 'EW' },
    ],
    14: [
      { id: 'M-2341', name: 'Sarah Chen', type: 'Gold', expiresIn: '3 days', avatar: 'SC' },
      { id: 'M-2156', name: 'Michael Rodriguez', type: 'Silver', expiresIn: '5 days', avatar: 'MR' },
      { id: 'M-1987', name: 'Emily Watson', type: 'Gold', expiresIn: '6 days', avatar: 'EW' },
    ],
  };

  const handleSearchMember = () => onNavigate('members');

  return (
    <>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 sm:p-5 md:p-6 h-full flex flex-col">
      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-white mb-3 text-sm">Quick Action Widget</h3>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Add Member */}
          <button 
            className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white 
                      p-2 sm:p-2.5 md:p-3 rounded-lg transition-colors"
            onClick={openAddMemberModal}
            title="Add New Member"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />
          </button>

          {/* Search Member */}
          <button 
            onClick={handleSearchMember}
            className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white 
                      p-2 sm:p-2.5 md:p-3 rounded-lg transition-colors"
            title="Search Member"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />
          </button>

          {/* Record Payment */}
          <button 
            onClick={openAddExpenseModal}
            className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white 
                      p-2 sm:p-2.5 md:p-3 rounded-lg transition-colors"
            title="Record Payment"
          >
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />
          </button>
        </div>
      </div>

      {/* Expiring Memberships */}
      <div className="border-t border-gray-800 pt-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <h3 className="text-white text-sm">Expiring Membership</h3>
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setSelectedDays(7)}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${
              selectedDays === 7 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            3D
          </button>
          <button
            onClick={() => setSelectedDays(14)}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${
              selectedDays === 14 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            7D
          </button>
        </div>

        {/* Members List */}
        <div className="space-y-2 overflow-y-auto flex-1">
          {expiringMembers[selectedDays].map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-gray-800/50 p-2.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 text-xs">{member.avatar}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs truncate">{member.name}</p>
                  <p className="text-gray-400 text-xs">{member.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-yellow-500 justify-end sm:justify-start">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs whitespace-nowrap">{member.expiresIn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Modals */}
      <AddMembersModal
        open={isAddMemberOpen}
        isVisible={isAddMemberVisible}
        onClose={closeAddMemberModal}
        onSubmit={handleAddMemberSubmit}
        isLoading={createMemberMutation.isPending}
      />

      <AddExpenseModal
        open={isAddExpenseOpen}
        isVisible={isAddExpenseVisible}
        onClose={closeAddExpenseModal}
        onSubmit={handleAddExpenseSubmit}
        isLoading={createTransactionMutation.isPending}
      />
    </>
  );
}
