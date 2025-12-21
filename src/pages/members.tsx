import { useState } from "react";
import {Search,ChevronDown,SlidersHorizontal,RotateCw,Pencil, Mail, Phone, QrCode} from "lucide-react";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");

  const members = [
    {
      id: 1,
      name: "Andi Wijaya",
      memberId: "MBR-001",
      status: "Aktif",
      planType: "Bulanan",
      planDetails: "Berakhir 20 Sep 2025",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    },
    {
      id: 2,
      name: "Kevin kaslana",
      memberId: "MBR-002",
      status: "Tidak Aktif",
      planType: "Mingguan",
      planDetails: "Habis 3 hari lalu",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    },
    {
      id: 3,
      name: "GoldShip",
      memberId: "MBR-002",
      status: "Tidak Aktif",
      planType: "Mingguan",
      planDetails: "Habis 3 hari lalu",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    },
    {
      id: 4,
      name: "Bronze Nature",
      memberId: "MBR-002",
      status: "Akan Habis",
      planType: "Mingguan",
      planDetails: "Habis 3 hari lalu",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    },
    {
      id: 5,
      name: "Euthanized Shower",
      memberId: "MBR-002",
      status: "Tidak Aktif",
      planType: "Mingguan",
      planDetails: "Habis 3 hari lalu",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    },
    {
      id: 6,
      name: "Super Creep",
      memberId: "MBR-002",
      status: "Akan Habis",
      planType: "Mingguan",
      planDetails: "Habis 3 hari lalu",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    },
    {
      id: 7,
      name: "Maruzesty",
      memberId: "MBR-002",
      status: "Tidak Aktif",
      planType: "Mingguan",
      planDetails: "Habis 3 hari lalu",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    },
    {
      id: 8,
      name: "Castorice",
      memberId: "MBR-002",
      status: "Akan Habis",
      planType: "Mingguan",
      planDetails: "Habis 3 hari lalu",
      email: "jawir@gmail.com",
      phone: "+62 812 8928 8923",
      avatar: "",
    }
  ];

  const PaginationMember = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(members.length / PaginationMember);
  
  const PaginatedMembers = members.slice(
    (currentPage - 1) * PaginationMember, currentPage * PaginationMember
  )

  const getStatusColor = (status: string) => {
    if (status === "Aktif") return "bg-green-500/10 text-green-400";
    else if (status === "Tidak Aktif") return "bg-red-500/10 text-red-400";
    else if (status === "Akan Habis") return "bg-yellow-400/10 text-yellow-400";
    return "bg-gray-500/10 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1">
          Membership Management
        </h2>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Atur Anggota, Membership dan Keuangan
        </p>

        {/*Top Stats*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Habis dalam 3 hari
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">15</h3>
              <span className="text-red-500 text-xs md:text-sm mb-1">
                -10%
              </span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">
              Perlu Perpanjangan Segera
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Habis dalam 7 hari
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">28</h3>
              <span className="text-yellow-400 text-xs md:text-sm mb-1">
                Stabil
              </span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">
              Periode perpanjangan
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">
              Member Kedaluwarsa
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">5</h3>
              <span className="text-red-500 text-xs md:text-sm mb-1">
                -5%
              </span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">
              Perlu Tindakan Segera
            </p>
          </div>
        </div>

        {/*Member Table*/}
        <div className="mt-8 bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
          {/* Search & Filter */}
          <div className="p-5 border-b border-gray-800">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari nama atau ID member..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <button className="flex items-center gap-2 bg-[#0a0a0a] text-yellow-500 px-4 py-2.5 rounded-lg border border-gray-800 text-sm">
                Status: Semua
                <ChevronDown className="w-4 h-4" />
              </button>

              <button className="flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2.5 rounded-lg border border-gray-800 text-sm">
                Urutkan
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                    Member
                  </th>
                  <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                    Paket
                  </th>
                  <th className="text-left px-5 py-4 text-gray-400 text-xs uppercase">
                    Kontak
                  </th>
                  <th className="text-center px-5 py-4 text-gray-400 text-xs uppercase">
                    Ubah
                  </th>
                </tr>
              </thead>
              <tbody>
                {PaginatedMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-800/50 hover:bg-gray-900/30"
                  >
                    {/* Memberz */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          className="w-10 h-10 rounded-full border border-gray-700"
                        />
                        <div>
                          <p className="text-white text-sm">{member.name}</p>
                          <p className="text-gray-500 text-xs">{member.memberId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusColor(
                          member.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {member.status}
                      </span>
                    </td>

                    {/* plan subs */}
                    <td className="px-5 py-4">
                      <p className="text-white text-sm">{member.planType}</p>
                      <p className="text-gray-500 text-xs">{member.planDetails}</p>
                    </td>

                    {/* kotak wirz */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-white">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-white">{member.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        {/* QR */}
                        <button
                          title="QR Code"
                          className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* RENEW */}
                        <button
                          title="Renew"
                          className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>

                        {/* EDIT */}
                        <button
                          title="Edit"
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            {/* Pagination */}
            </table>
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * PaginationMember + 1}–
                  {Math.min(currentPage * PaginationMember, members.length)} of {members.length} members</p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-gray-800 text-gray-400 disabled:opacity-40"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        currentPage === i + 1
                          ? "bg-yellow-500 text-black"
                          : "border border-gray-800 text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-gray-800 text-gray-400 disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              </div>

          </div>
        </div>
      </main>
    </div>
  );
}
