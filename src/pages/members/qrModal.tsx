import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Member } from "../../types/types";
import bg from "../../assets/CardBg.png"

type QRModalProps = {
  open: boolean;
  onClose: () => void;
  member: Member | null;
};

export default function QRModal({ open, onClose, member }: QRModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
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
        className={`
          relative overflow-hidden
          rounded-[2rem] shadow-2xl text-center
          w-full max-w-[280px] p-5 sm:p-6 
          transform transition-all duration-300
          ${
            isVisible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }
        `}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        />

        {/* Dark overlay supaya konten tetap terbaca */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content wrapper */}
        <div className="relative z-10">


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
      </div>
    </div>
  </div>
);
}