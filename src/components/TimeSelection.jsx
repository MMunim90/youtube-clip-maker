function TimeSelection() {
  return (
    <section className="mx-4 mt-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Start Time */}
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-4">
          <p className="text-xs font-medium text-slate-400">
            Start Time
          </p>

          <div className="mt-3 flex items-center gap-2">
            <input
              id="startTime"
              type="text"
              defaultValue="00:00:00"
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50"
            />
          </div>

          <button
            id="setStartTime"
            className="mt-2 w-full rounded-lg bg-cyan-400/10 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20"
          >
            Set Current
          </button>
        </div>

        {/* End Time */}
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-4">
          <p className="text-xs font-medium text-slate-400">
            End Time
          </p>

          <div className="mt-3 flex items-center gap-2">
            <input
              id="endTime"
              type="text"
              defaultValue="00:00:00"
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50"
            />
          </div>

          <button
            id="setEndTime"
            className="mt-2 w-full rounded-lg bg-cyan-400/10 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20"
          >
            Set Current
          </button>
        </div>
      </div>
    </section>
  );
}

export default TimeSelection;