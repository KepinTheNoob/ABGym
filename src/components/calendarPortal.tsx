import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState, useEffect } from "react";

export default function CalendarPortal({
  anchorEl,
  onClose,
  children,
}: {
  anchorEl: HTMLElement;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    left: -9999,
    top: -9999,
    zIndex: 9999,
    visibility: "hidden",
  });

  // positioning
  useLayoutEffect(() => {
    if (!anchorEl || !ref.current) return;

    const anchor = anchorEl.getBoundingClientRect();
    const popup = ref.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - anchor.bottom;
    const spaceAbove = anchor.top;
    const openDown = spaceBelow >= popup.height || spaceBelow >= spaceAbove;

    setStyle({
      position: "fixed",
      left: anchor.left,
      top: openDown
        ? anchor.bottom + 6
        : anchor.top - popup.height - 6,
      zIndex: 9999,
      visibility: "visible",
    });
  }, [anchorEl]);

  // 👇 outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [anchorEl, onClose]);

  return createPortal(
    <div ref={ref} style={style} className="dark bg-[#0a0a0a] text-white">
      {children}
    </div>,
    document.body
  );
}
