import { useEffect, useState } from "react";

type CategoryForm = {
  name: string;
  description: string;
};

type CategoriesModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { id: number; name: string; description: string } | null;
  isLoading?: boolean;
};

export default function AddCategoriesModal({
  open,
  isVisible,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: CategoriesModalProps) {
  const [form, setForm] = useState<CategoryForm>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) return;

    onSubmit({
      name: form.name,
      description: form.description,
    });
  };

  if (!open) return null;

  return (
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 p-4 overflow-y-auto ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md md:max-w-md rounded-xl bg-[#161618] border border-gray-800 p-4 md:p-6 transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-bold">
            {initialData ? "Edit Category" : "Add New Category"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Manage transaction categories for better reporting
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div>
            <label className="text-xs text-gray-400">Category Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Utilities"
              className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-400">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Monthly electricity and water bills"
              rows={3}
              className="mt-1 w-full rounded-lg bg-[#0a0a0a] border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-sm hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-[#F0B100] text-black text-sm font-bold disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "✓ Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}