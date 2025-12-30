import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Member } from "../../types/types";
import bg from "../../assets/CardBg.png";
import html2canvas from "html2canvas";

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

  const downloadCard = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = `GYM-${member?.id.substring(0, 8)}.png`;
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
        className="
        relative overflow-hidden
        rounded-[2rem] shadow-2xl text-center
        w-full max-w-[360px]
        aspect-[420/969]
        p-5 sm:p-6
        transform transition-all duration-300
      "
      >
        <img
          src={bg}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          alt=""
        />

        {/* Dark overlay supaya konten tetap terbaca */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content wrapper */}
        <div className="relative z-10 h-full flex flex-col items-center">
          {/* Profile Placeholder */}
          <div className="flex flex-col items-center mb-4">
            {/* Avatar dengan outline */}
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-700/40 flex items-center justify-center text-white text-lg font-bold
                          border-4 border-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.6)]"
            >
              {member?.name ? member.name[0] : "?"}
            </div>
            {/* Name */}
            <p className="mt-2 text-white font-semibold text-sm sm:text-base truncate max-w-[200px] text-center">
              {member?.name || "Member Name"}
            </p>
          </div>

          {/* Card */}
          <div
            className="
              absolute left-0 right-0 bottom-0
              translate-y
              mx-4 mb-6
              rounded-2xl bg-black border border-gray-700/60
              backdrop-blur-md p-4 sm:p-5 shadow-xl
            "
          >
            {/* QR Code Area */}
            <div className="bg-[#F3EFE0] rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 flex justify-center items-center shadow-inner mx-auto aspect-square w-full max-w-[240px]">
              <QRCodeSVG
                value={member.id}
                style={{ width: "100%", height: "100%" }}
                fgColor="#161618"
                bgColor="transparent"
              />
            </div>

            {/* Plan badge - Dynamic based on Member Plan */}
            <div className="flex justify-center mb-3">
              <span className="px-6 py-2 sm:px-8 sm:py-2.5 rounded-full bg-[#C99C33] text-[#161618] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md whitespace-nowrap">
                {member.plans?.name || "MEMBER"}
              </span>
            </div>

            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8 text-[#C99C33] opacity-90">
              <div className="h-px w-4 sm:w-6 bg-[#C99C33]/40"></div>
              <p className="text-[0.65rem] sm:text-[0.7rem] tracking-[0.25em] font-semibold uppercase whitespace-nowrap">
                OFFICIAL CARD
              </p>
              <div className="h-px w-4 sm:w-6 bg-[#C99C33]/40"></div>
            </div>

            {/* Info Section */}
            <div className="text-left flex flex-col gap-1 text-xs sm:text-sm font-medium">
              {/* Row 1: ID */}
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400/80">Member ID</span>
                <span className="text-[#C99C33] font-bold tracking-wider truncate max-w-[150px]">
                  GYM-{member.id.substring(0, 8)}
                </span>
              </div>

              {/* Row 2: Member Since */}
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400/80">Member Since</span>
                <span className="text-white font-semibold">
                  {formatDate(member.joinDate)}
                </span>
              </div>

              {/* Row 3: Valid Until */}
              <div className="flex justify-between pt-3">
                <span className="text-gray-400/80">Valid Until</span>
                <span className="text-[#C99C33] font-bold">
                  {formatDate(member.expirationDate)}
                </span>
              </div>
            </div>
            <button
              onClick={downloadCard}
              className="w-full mb-5 py-2 mt-6 rounded-xl bg-[#C99C33] text-black font-bold text-sm hover:bg-[#d9a000] transition"
            >
              Download QR Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
