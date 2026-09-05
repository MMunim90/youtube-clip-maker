import { Mic } from "lucide-react";
import { useEffect, useState } from "react";

function StatusCard() {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const handleRecordingState = (event) => {
      setIsRecording(event.detail.isRecording);
    };

    window.addEventListener("recording-state-changed", handleRecordingState);

    return () => {
      window.removeEventListener(
        "recording-state-changed",
        handleRecordingState,
      );
    };
  }, []);

  return (
    <section
      className={`mx-3 mt-2 rounded-2xl border p-3 transition-all duration-300 ${
        isRecording
          ? "border-red-400/70 bg-gradient-to-r from-[#3a1015] via-[#291017] to-[#1d0b12]"
          : "border-emerald-400/80 bg-gradient-to-r from-[#063337] via-[#04272e] to-[#031b28]"
      } shadow-[0_0_20px_rgba(16,185,129,0.08)]`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Status */}
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Indicator */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              isRecording ? "bg-red-400/15" : "bg-emerald-400/15"
            }`}
          >
            <div
              className={`h-4 w-4 rounded-full transition-all duration-300 ${
                isRecording
                  ? "bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.85)]"
                  : "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]"
              }`}
            />
          </div>

          {/* Status Text */}
          <div className="min-w-0">
            <p
              id="status"
              className="text-[16px] font-bold leading-none text-white"
            >
              Ready
            </p>

            {/* Helper text - only before recording */}
            {!isRecording && (
              <p className="mt-1 text-[10px] leading-4 text-blue-200">
                Click Start Recording to begin
              </p>
            )}
          </div>
        </div>

        {/* Recording Time */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#031c2a]/80 px-2.5 py-2">
          {/* Mic */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
            <Mic size={18} strokeWidth={2} className="text-cyan-300" />
          </div>

          {/* Time */}
          <div>
            <p className="text-[9px] font-medium text-cyan-300">
              Recording Time
            </p>

            <p
              id="recordingTime"
              className="mt-0.5 font-mono text-[18px] font-bold leading-none tracking-tight text-white"
            >
              00:00
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatusCard;
