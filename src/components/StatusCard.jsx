function StatusCard() {
  return (
    <section className="mx-3 mt-3 rounded-2xl border border-emerald-400/80 bg-gradient-to-r from-[#063337] via-[#04272e] to-[#031b28] p-3.5 shadow-[0_0_22px_rgba(16,185,129,0.08)]">
      <div className="flex items-center justify-between gap-3">
        {/* Status */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Green indicator */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
            <div className="h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
          </div>

          {/* Status text */}
          <div className="min-w-0">
            <p
              id="status"
              className="text-[16px] font-bold leading-none text-emerald-300"
            >
              Ready
            </p>

            <p className="mt-1 text-[10px] leading-4 text-blue-200">
              Click Start Recording to begin
            </p>
          </div>
        </div>

        {/* Recording Time */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#031c2a]/80 px-2.5 py-2">
          {/* Microphone */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
            <span className="text-lg text-cyan-300">♩</span>
          </div>

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
