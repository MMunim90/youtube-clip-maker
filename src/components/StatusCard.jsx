function StatusCard() {
  return (
    <section
      id="status"
      className="mx-4 mt-4 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg shadow-cyan-950/20"
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

        <span className="text-sm font-medium text-emerald-400">
          Ready
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-400">
        Click Start Recording to begin
      </p>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Recording Time
        </p>

        <p
          id="recordingTime"
          className="mt-1 font-mono text-3xl font-semibold tracking-wider text-white"
        >
          00:00:00
        </p>
      </div>
    </section>
  );
}

export default StatusCard;