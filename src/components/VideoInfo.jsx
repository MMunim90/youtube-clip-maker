function VideoInfo() {
  return (
    <section className="mx-4 mt-4 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Video Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Detect the current YouTube video
          </p>
        </div>

        <button
          id="detectVideo"
          className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-400/20"
        >
          Detect Video
        </button>
      </div>

      {/* Video Title */}
      <div className="rounded-xl border border-white/5 bg-slate-950/50 p-3">
        <p className="text-[11px] uppercase tracking-wider text-slate-500">
          Video Title
        </p>

        <div className="mt-1 min-w-0 overflow-hidden">
          <p
            id="videoTitle"
            className="inline-block whitespace-nowrap text-sm font-medium text-slate-200"
          >
            No video detected
          </p>
        </div>
      </div>

      {/* Duration + Current Time */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 bg-slate-950/50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Duration
          </p>

          <p
            id="duration"
            className="mt-1 font-mono text-sm font-medium text-white"
          >
            00:00
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Current Time
          </p>

          <p
            id="currentTime"
            className="mt-1 font-mono text-sm font-medium text-white"
          >
            00:00
          </p>
        </div>
      </div>
    </section>
  );
}

export default VideoInfo;
