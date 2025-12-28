import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type QRModalProps = {
  open: boolean;
  onClose: () => void;
  value: string;
};

export default function QRModal({ open, onClose, value }: QRModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation state
  useEffect(() => {
    if (open) {
      setTimeout(() => setIsVisible(true), 10); // Trigger animation after mount
    } else {
      setIsVisible(false);
    }
  }, [open]);

  // Handle closing logic with animation delay
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for transition duration before unmounting
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
  }, [open]); // Removed onClose from dependency to prevent stale closure issues if onClose changes rapidly, though strictly ok here. Better to rely on handleClose.

  if (!open) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        ref={modalRef}
        className={`
          bg-[#161618] rounded-xl p-6 w-[280px] text-center
          transform transition-all duration-300
          ${
            isVisible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }
        `}
      >
        <h3 className="text-white font-semibold mb-4">Member QR Code</h3>

        <div className="bg-white p-3 rounded-lg inline-block">
          <QRCodeSVG value={value} size={180} />
        </div>

        <p className="text-gray-400 text-xs mt-3">
          Scan for member verification
        </p>
      </div>
    </div>
  );
}