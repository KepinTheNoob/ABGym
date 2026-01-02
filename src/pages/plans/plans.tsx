import { useState } from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../../service/api";
import PlansModal from "./addPlansModal";
import toast, { Toaster } from "react-hot-toast";

type Plan = {
  id: number;
  name: string;
  price: number;
  durationValue: number;
  durationUnit: string;
};

export default function Plans() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const { data: plans = [], isLoading: isFetching } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await API.get("/plans");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newPlan: Omit<Plan, "id">) => {
      const res = await API.post("/plans", newPlan);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      const res = await API.put(`/plans/${plan.id}`, {
        name: plan.name,
        price: plan.price,
        durationValue: plan.durationValue,
        durationUnit: plan.durationUnit,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await API.delete(`/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan deleted successfully!");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Action failed";

      if (status === 409) {
        toast.error(
          "Cannot delete plan: It is currently assigned to active members.",
          {
            duration: 5000,
            icon: "⚠️",
          }
        );
        return;
      }

      toast.error(`Failed: ${msg}`);
    },
  });

  const openAddModal = () => {
    setEditingPlan(null);
    setOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  const handleSubmit = (data: {
    name: string;
    price: number;
    durationValue: number;
    durationUnit: string;
  }) => {
    if (editingPlan) {
      updateMutation.mutate({ ...data, id: editingPlan.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-4 md:p-8">
      <Toaster position="top-center" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <h2 className="text-xl md:text-2xl font-bold">Plans Management</h2>
        <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F0B100] hover:bg-[#d9a000] text-black font-bold py-2.5 px-4 rounded-xl"
          >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>
      <p className="text-gray-400 mb-6 text-sm md:text-base">
        Manage membership plans and pricing
      </p>

    <div className="bg-[#161618] border border-gray-800 rounded-xl overflow-hidden">

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden divide-y divide-gray-800">
        {isFetching ? (
          <div className="p-6 text-center text-gray-400 flex justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No plans created yet
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">{plan.name}</p>
                  <p className="text-sm text-gray-400">
                    {plan.durationValue} {plan.durationUnit.toLowerCase()}
                    {plan.durationValue > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-bold text-[#F0B100]">
                  Rp {plan.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(plan)}
                  className="flex-1 py-2 bg-blue-500/10 text-blue-400 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(plan.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg disabled:opacity-50"
                >
                  {deleteMutation.isPending &&
                  deleteMutation.variables === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-3 sm:px-5 py-3 sm:py-4 text-gray-400 text-xs uppercase">
                      Plan Name
                    </th>
                    <th className="text-left px-3 sm:px-5 py-3 sm:py-4 text-gray-400 text-xs uppercase">
                      Price
                    </th>
                    <th className="text-left px-3 sm:px-5 py-3 sm:py-4 text-gray-400 text-xs uppercase">
                      Duration
                    </th>
                    <th className="text-center px-3 sm:px-5 py-3 sm:py-4 text-gray-400 text-xs uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isFetching ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-gray-400"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading plans...
                        </div>
                      </td>
                    </tr>
                  ) : plans.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-gray-400"
                      >
                        No plans created yet
                      </td>
                    </tr>
                  ) : (
                    plans.map((plan) => (
                      <tr
                        key={plan.id}
                        className="border-b border-gray-800/50 hover:bg-gray-900/30 transition"
                      >
                        <td className="px-3 sm:px-5 py-3 sm:py-4 text-sm font-medium">
                          {plan.name}
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4 text-sm">
                          Rp {plan.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4 text-sm text-gray-300 capitalize">
                          {plan.durationValue} {plan.durationUnit.toLowerCase()}
                          {plan.durationValue > 1 ? "s" : ""}
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4">
                          <div className="flex justify-center gap-2 flex-wrap sm:flex-nowrap">
                            <button
                              onClick={() => openEditModal(plan)}
                              className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(plan.id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                            >
                              {deleteMutation.isPending &&
                              deleteMutation.variables === plan.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

      <PlansModal
        open={open}
        isVisible={isVisible}
        initialData={editingPlan}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}




