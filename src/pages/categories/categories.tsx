import { useState } from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../../service/api";
import AddCategoriesModal from "./addCategoriesModal";

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function Categories() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading: isFetching } = useQuery<Category[]>(
    {
      queryKey: ["categories"],
      queryFn: async () => {
        const res = await API.get("/categories");
        return res.data;
      },
    }
  );

  const createMutation = useMutation({
    mutationFn: async (newCategory: Omit<Category, "id">) => {
      const res = await API.post("/categories", newCategory);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (category: Category) => {
      const res = await API.put(`/categories/${category.id}`, {
        name: category.name,
        description: category.description,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await API.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  const handleSubmit = (data: { name: string; description: string }) => {
    if (editingCategory) {
      updateMutation.mutate({ ...data, id: editingCategory.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl md:text-2xl font-bold">Categories Management</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#F0B100] hover:bg-[#d9a000] text-black font-bold py-2 px-4 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
      <p className="text-gray-400 mb-6 text-sm md:text-base">
        Manage categories for transactions
      </p>

      {/* Table Card */}
      <div className="bg-[#161618] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                  Name
                </th>
                <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                  Description
                </th>
                <th className="text-center px-5 py-4 text-gray-400 text-xs uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isFetching ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    No categories created yet
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-800/50 hover:bg-gray-900/30 transition"
                  >
                    <td className="px-5 py-4 text-sm font-medium">
                      {category.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {category.description}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                        >
                          {deleteMutation.isPending &&
                          deleteMutation.variables === category.id ? (
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

      <AddCategoriesModal
        open={open}
        isVisible={isVisible}
        initialData={editingCategory}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
