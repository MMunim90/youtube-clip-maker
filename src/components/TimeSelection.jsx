function TimeSelection() {
  return (
    <section className="mx-4 mt-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-white">
          Clip Duration
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Select the portion of the video you want to record
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Start Time */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition focus-within:border-cyan-400/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">
              Start Time
            </p>

            <span className="text-[10px] text-slate-600">
              FROM
            </span>
          </div>

          <input
            id="startTime"
            type="text"
            defaultValue="00:00"
            placeholder="00:00"
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2.5 font-mono text-sm font-medium tracking-wide text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-slate-950"
          />

          <button
            id="setStartTime"
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-400/10 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20 active:scale-[0.98]"
          >
            <span>◷</span>
            Set Current
          </button>
        </div>

        {/* End Time */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition focus-within:border-cyan-400/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">
              End Time
            </p>

            <span className="text-[10px] text-slate-600">
              TO
            </span>
          </div>

          <input
            id="endTime"
            type="text"
            defaultValue="00:00"
            placeholder="00:00"
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2.5 font-mono text-sm font-medium tracking-wide text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-slate-950"
          />

          <button
            id="setEndTime"
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-400/10 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20 active:scale-[0.98]"
          >
            <span>◷</span>
            Set Current
          </button>
        </div>
      </div>

      {/* Format hint */}
      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="text-xs text-slate-600">ⓘ</span>

        <p className="text-[11px] text-slate-500">
          Use <span className="font-mono text-slate-400">MM:SS</span>{" "}
          format, for example{" "}
          <span className="font-mono text-slate-400">01:30</span>
        </p>
      </div>
    </section>
  );
}

export default TimeSelection;
