import { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  RotateCw,
  Pencil,
  Mail,
  Phone,
  QrCode,
  Check,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../../service/api";
import AddMembersModal from "./addMembersModal";
import RenewalMembersModal from "./renewalMembersModal";
import QRModal from "./qrModal";
import EditMemberModal from "./editMemberModal";
import { Member } from "../../types/types";

export default function Members() {
  const queryClient = useQueryClient();

  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering & Sorting State
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Expiring, Expired
  const [sortOrder, setSortOrder] = useState("Newest"); // Newest, Oldest, A-Z, Z-A
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Modal States
  const [openRenewal, setRenewalOpen] = useState(false);
  const [isRenewalVisible, setIsRenewalVisible] = useState(false);
  const [renewalMember, setRenewalMember] = useState<Member | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);

  const [qrOpen, setQrOpen] = useState(false);
  const [qrMember, setQrMember] = useState<Member | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Refs for clicking outside dropdowns
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // --- HANDLERS ---

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target as Node)
      ) {
        setShowStatusMenu(false);
      }
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const openRenewalModal = (member?: Member) => {
    if (member) setRenewalMember(member);
    setRenewalOpen(true);
    setTimeout(() => setIsRenewalVisible(true), 10);
  };

  const closeRenewalModal = () => {
    setIsRenewalVisible(false);
    setTimeout(() => {
      setRenewalOpen(false);
      setRenewalMember(null);
    }, 300);
  };
  const openAddModal = () => {
    setIsAddOpen(true);
    setTimeout(() => setIsAddVisible(true), 10);
  };

  const closeAddModal = () => {
    setIsAddVisible(false);
    setTimeout(() => setIsAddOpen(false), 300);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setEditOpen(true);
    setTimeout(() => setIsEditVisible(true), 10);
  };

  const closeEditModal = () => {
    setIsEditVisible(false);
    setTimeout(() => {
      setEditOpen(false);
      setEditingMember(null);
    }, 300);
  };

  // --- QUERIES & MUTATIONS ---
  const memberQuery = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await API.get("/members");
      return res.data;
    },
  });
  const members = memberQuery.data ?? [];

  const createMemberMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API.post("/members", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      closeAddModal();
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API.put(`/members/${payload.id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      closeRenewalModal();
      closeEditModal();
    },
  });

  const handleAddSubmit = (data: FormData) => {
    createMemberMutation.mutate(data);
  };

  const handleRenewalSubmit = (data: any) => {
    if (!renewalMember) return;
    const payload = {
      ...renewalMember,
      planId: Number(data.planId),
      joinDate: data.joinDate,
    };
    updateMemberMutation.mutate(payload);
  };

  const handleEditSubmit = (data: any) => {
    updateMemberMutation.mutate(data);
  };

  // --- STATS CALCULATION ---
  const aktifCount = members.filter((m) => m.status === "Active").length;
  const akanHabisCount = members.filter((m) => m.status === "Expiring").length;
  const tidakAktifCount = members.filter((m) => m.status === "Expired").length;

  // --- FILTERING & SORTING LOGIC ---

  // 1. Filter
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 2. Sort
  const processedMembers = filteredMembers.sort((a, b) => {
    if (sortOrder === "Newest") {
      // Assuming joinDate exists, otherwise use ID or created_at
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    }
    if (sortOrder === "Oldest") {
      return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
    }
    if (sortOrder === "A-Z") {
      return a.name.localeCompare(b.name);
    }
    if (sortOrder === "Z-A") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // 3. Pagination
  const PaginationMember = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(processedMembers.length / PaginationMember);

  // Use processedMembers instead of raw members
  const PaginatedMembers = processedMembers.slice(
    (currentPage - 1) * PaginationMember,
    currentPage * PaginationMember
  );

  const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-500/10 text-green-400";
    if (status === "Expired") return "bg-red-500/10 text-red-400";
    if (status === "Expiring") return "bg-yellow-400/10 text-yellow-400";
    return "bg-gray-500/10 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl md:text-2xl font-bold">
              Membership Management
            </h2>
            <button
              className="bg-[#F0B100] hover:bg-[#d9a000] text-black font-bold py-2 px-4 rounded-xl"
              onClick={openAddModal}
            >
              + Add New Member
            </button>
          </div>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            Atur Anggota, Membership dan Keuangan
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* ... Stats cards (Same as before) ... */}
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-xl font-bold pb-4">
              Habis dalam 3 hari
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">
                {akanHabisCount}
              </h3>
            </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">
              Perlu Perpanjangan Segera
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-xl pb-4 font-bold">
              Habis dalam 7 hari
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-yellow-400 text-2xl md:text-3xl font-bold">
                {aktifCount}
              </h3>
            </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">
              Periode perpanjangan
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-xl pb-4 font-bold">
              Member Kadaluwarsa
            </p>
            <div className="flex items-end gap-2">
              <h3 className=" text-2xl text-red-600 md:text-3xl font-bold">
                {tidakAktifCount}
              </h3>
            </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">
              Perlu Tindakan Segera
            </p>
          </div>
        </div>

        {/* Table & Filters */}
        <div className="mt-8 bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-gray-800">
            <div className="flex flex-wrap gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari nama atau ID member..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              {/* Status Filter Button */}
              <div className="relative" ref={statusMenuRef}>
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="flex items-center gap-2 bg-[#0a0a0a] text-yellow-500 px-4 py-2.5 rounded-lg border border-gray-800 text-sm hover:bg-gray-900 transition-colors min-w-[160px] justify-between"
                >
                  <span>
                    Status:{" "}
                    <span className="font-semibold">{statusFilter}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showStatusMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showStatusMenu && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-[#161618] border border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden">
                    {["All", "Active", "Expiring", "Expired"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between
                          ${
                            statusFilter === status
                              ? "text-yellow-500 bg-gray-800/50"
                              : "text-gray-300"
                          }
                        `}
                      >
                        {status}
                        {statusFilter === status && (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative" ref={sortMenuRef}>
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2.5 rounded-lg border border-gray-800 text-sm hover:bg-gray-900 transition-colors min-w-[140px] justify-between"
                >
                  <span className="flex items-center gap-2">
                    Urutkan: <span className="text-gray-400">{sortOrder}</span>
                  </span>
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                </button>

                {showSortMenu && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-[#161618] border border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden">
                    {[
                      { label: "Newest", value: "Newest" },
                      { label: "Oldest", value: "Oldest" },
                      { label: "Name A-Z", value: "A-Z" },
                      { label: "Name Z-A", value: "Z-A" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortOrder(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between
                          ${
                            sortOrder === opt.value
                              ? "text-yellow-500 bg-gray-800/50"
                              : "text-gray-300"
                          }
                        `}
                      >
                        {opt.label}
                        {sortOrder === opt.value && (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-[#161618]/50">
                  <th className="text-left px-5 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left px-5 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="text-left px-5 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="text-center px-5 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    Ubah
                  </th>
                </tr>
              </thead>
              <tbody>
                {PaginatedMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <p>No members found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  PaginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              member.profilePhoto ||
                              "https://ui-avatars.com/api/?name=" +
                                member.name +
                                "&background=random"
                            }
                            className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                            alt={member.name}
                          />
                          <div>
                            <p className="text-white text-sm font-medium">
                              {member.name}
                            </p>
                            <p className="text-gray-500 text-xs font-mono">
                              #GYM-{member.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            member.status
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                          {member.status}
                        </span>
                      </td>

                      {/* Plan Type */}
                      <td className="px-5 py-4">
                        <p className="text-white text-sm">
                          {member.plans?.name || "Unknown"}
                        </p>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-gray-300">
                              {member.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-gray-300">
                              {member.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            title="QR Code"
                            className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                            onClick={() => {
                              setQrMember(member);
                              setQrOpen(true);
                            }}
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            title="Renew"
                            className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
                            onClick={() => openRenewalModal(member)}
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            title="Edit"
                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                            onClick={() => openEditModal(member)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800 bg-[#161618]/30">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {processedMembers.length === 0
                  ? 0
                  : (currentPage - 1) * PaginationMember + 1}
                –
                {Math.min(
                  currentPage * PaginationMember,
                  processedMembers.length
                )}{" "}
                of {processedMembers.length} members
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-gray-800 text-gray-400 hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      currentPage === i + 1
                        ? "bg-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/20"
                        : "border border-gray-800 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-gray-800 text-gray-400 hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <RenewalMembersModal
        open={openRenewal}
        isVisible={isRenewalVisible}
        onClose={closeRenewalModal}
        onSubmit={handleRenewalSubmit}
        isLoading={updateMemberMutation.isPending}
        member={renewalMember}
      />

      <AddMembersModal
        open={isAddOpen}
        isVisible={isAddVisible}
        onClose={closeAddModal}
        onSubmit={handleAddSubmit}
        isLoading={createMemberMutation.isPending}
      />

      <EditMemberModal
        open={editOpen}
        isVisible={isEditVisible}
        initialData={editingMember}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        isLoading={updateMemberMutation.isPending}
      />

      <QRModal
        open={qrOpen}
        member={qrMember}
        onClose={() => setQrOpen(false)}
      />
    </div>
  );
}
