import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Member } from "../../types/types";
import bg from "../../assets/CardBg.png";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";


type QRModalProps = {
  open: boolean;
  onClose: () => void;
  member: Member | null;
};

export default function QRModal({ open, onClose, member }: QRModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  // Fungsi download menggunakan html2canvas
  const downloadCard = async (member: Member) => {
    if (!cardRef.current || !member) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `GYM-${member.id.substring(0, 8)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!open || !member) return null;

  return (
    <div
      className={`
      fixed inset-0 z-50 flex items-center justify-center
      bg-black/70 transition-opacity duration-300 p-4
      ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
    >
        <div
          ref={modalRef}
          className="relative overflow-hidden rounded-[2rem] shadow-2xl text-center w-full max-w-[360px] h-[780px] p-5 sm:p-6 transform transition-all duration-300">
        <img
          src={bg}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        /> 

        <div
          data-html2canvas-ignore
          className="absolute top-4 right-4 z-30"
        >
          <button
            onClick={() => member && downloadCard(member)}
            className="
              w-10 h-10
              rounded-full
              bg-[#C99C33]
              flex items-center justify-center
              shadow-lg
              hover:bg-[#d9a000]
              transition
            "
            title="Download QR Card"
          >
            <Download size={18} className="text-black" />
          </button>
        </div>

        <div ref={cardRef} className="relative w-full h-full overflow-visible">
        <div className="absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center p-4 sm:p-5 pt-12">
          {/* Profile */}
          <div className="flex flex-col items-center mb-4">
           <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black flex items-center justify-center border-[3px] border-[#C99C33] shadow-[0_0_25px_rgba(201,156,51,0.6)]">
              <img
                src={member.profilePhoto || `https://ui-avatars.com/api/?name=${member.name}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="mt-2 text-white font-semibold text-sm sm:text-base truncate max-w-[200px] text-center">
              {member.name}
            </p>
          </div>

          <div className="w-full bg-[#0f0f10] border border-gray-600/40 rounded-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            {/* QR Code */}
            <div className="w-full max-w-[260px] mb-6 sm:mb-8 mx-auto">
              <div
                className="
                  bg-[#0f0f10]
                  rounded-2xl
                  p-4
                  flex justify-center items-center
                  aspect-square
                "
              >
                <div className="bg-[#f5f1e6] p-3 rounded-xl">
                  <QRCodeSVG
                    value={member.id}
                    style={{ width: "180px", height: "180px" }}
                    fgColor="#111"
                    bgColor="transparent"
                  />
                </div>
              </div>
            </div>

            {/* Plan Badge */}
            <div className="flex justify-center mb-6">
              <span className="px-6 py-2 sm:px-8 sm:py-2.5 rounded-full bg-[#C99C33] text-[#161618] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md whitespace-nowrap">
                {member.plans?.name || "MEMBER"}
              </span>
            </div>

            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8 text-[#C99C33] opacity-90">
              <div className="h-px w-4 sm:w-6 bg-[#C99C33]/40"></div>
              <p className="text-[0.65rem] sm:text-[0.7rem] tracking-[0.25em] font-semibold uppercase whitespace-nowrap">
                AB Fitness
              </p>
              <div className="h-px w-4 sm:w-6 bg-[#C99C33]/40"></div>
            </div>

          {/* Info Section */}
          <div className="text-left flex flex-col gap-1 text-xs sm:text-sm font-medium w-full">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400/80">Member ID</span>
              <span className="text-[#C99C33] font-bold tracking-wider truncate max-w-[150px]">
                GYM-{member.id.substring(0, 8)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400/80">Member Since</span>
              <span className="text-white font-semibold">
                {formatDate(member.joinDate)}
              </span>
            </div>

            <div className="flex justify-between pt-3">
              <span className="text-gray-400/80">Valid Until</span>
              <span className="text-[#C99C33] font-bold">
                {formatDate(member.expirationDate)}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
}
