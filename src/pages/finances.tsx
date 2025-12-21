export default function Finances() {
    return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Membership Management</h2>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
         Atur Anggota, Membership dan Keuangan
        </p>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">Habis dalam 3 hari</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl md:text-3xl font-bold">15</h3>
                <span className="text-red-500 text-xs md:text:sm mb-1">-10%</span>
              </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">Perlu Perpanjangan Segera</p>
          </div>


          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">Habis dalam 3 hari</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold">15</h3>
              <span className="text-yellow-400 text-xs md:text:sm mb-1">Stabil</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">Perlu Tindakan Segera</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-[#161618] p-4 md:p-6">
            <p className="text-gray-400 text-sm md:text-base pb-4">Member Kadaluarsa</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl md:text-3xl font-bold">15</h3>
                <span className="text-red-500 text-xs md:text:sm mb-1">-10%</span>
              </div>
            <p className="text-gray-400 text-xs md:text-sm pt-2">Perlu Tindakan Segera</p>
          </div>
        </div>

        
      </main>
    </div>
  );
}
