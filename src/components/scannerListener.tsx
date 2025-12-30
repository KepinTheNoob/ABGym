import { useEffect, useRef, useState } from "react";
import { useAttendance } from "./attendanceContext";
import { Member } from "../types/types";

type ScanResult =
  | { type: "ACCESS_GRANTED"; member: Member; checkInTime: string }
  | {
      type: "ACCESS_DENIED";
      reason: "MEMBER_NOT_FOUND" | "MEMBERSHIP_EXPIRED" | "ALREADY_CHECKED_IN";
      name?: string;
    };

export default function ScannerListener() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const bufferRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);

  const { setLiveAttendance } = useAttendance();

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      const ws = new WebSocket("ws://localhost:8080");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🟢 Scanner connected");
      };

      ws.onmessage = (event) => {
        const data: ScanResult = JSON.parse(event.data);
        console.log("📩 Scanner response:", data);

        setResult(data);

        if (data.type === "ACCESS_GRANTED") {
          setLiveAttendance({
            ...data.member,
            checkInTime: data.checkInTime,
          });
        }

        setTimeout(() => {
          setResult(null);
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error("🔴 Scanner WS error:", err);
      };

      ws.onclose = () => {
        console.log("🔄 Scanner reconnecting...");
        bufferRef.current = "";
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (result) return;

      const now = Date.now();
      const delta = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      if (delta > 300) {
        bufferRef.current = "";
      }

      if (e.key === "Enter") {
        const value = bufferRef.current.trim();

        if (!value) {
          bufferRef.current = "";
          return;
        }

        if (
          bufferRef.current.length >= 8 &&
          wsRef.current?.readyState === WebSocket.OPEN
        ) {
          console.log("📤 Sending scan:", bufferRef.current);
          wsRef.current.send(bufferRef.current);
        }

        bufferRef.current = "";
        return;
      }

      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [result]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`rounded-xl p-6 w-80 text-center shadow-xl ${
          result.type === "ACCESS_GRANTED"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        <h2 className="text-xl font-bold">
          {result.type === "ACCESS_GRANTED"
            ? "Access Granted"
            : "Access Denied"}
        </h2>

        {"name" in result && result.name && (
          <p className="mt-2 text-lg">{result.name}</p>
        )}

        {result.type === "ACCESS_DENIED" && (
          <p className="mt-1 text-sm opacity-90">
            {result.reason.replace("_", " ")}
          </p>
        )}
      </div>
    </div>
  );
}
