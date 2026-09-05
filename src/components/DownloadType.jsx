function DownloadType() {
  return (
    <section className="mx-4 mt-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-white">Download Type</h2>

        <p className="mt-1 text-xs text-slate-500">
          Choose your preferred output format
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Video / MP4 */}
        <label className="cursor-pointer">
          <input
            id="downloadVideo"
            name="downloadType"
            type="radio"
            value="mp4"
            defaultChecked
            className="peer sr-only"
          />

          <div className="h-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center transition peer-checked:border-cyan-400/50 peer-checked:bg-cyan-400/10 hover:border-cyan-400/20 peer-disabled:cursor-not-allowed peer-disabled:opacity-30">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
              ▶
            </div>

            <p className="mt-2 text-xs font-semibold text-white">Video</p>

            <p className="mt-0.5 text-[10px] text-slate-500">MP4</p>
          </div>
        </label>

        {/* Audio / MP3 */}
        <label className="cursor-pointer">
          <input
            id="downloadAudio"
            name="downloadType"
            type="radio"
            value="mp3"
            className="peer sr-only"
          />

          <div className="h-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center transition peer-checked:border-cyan-400/50 peer-checked:bg-cyan-400/10 hover:border-cyan-400/20 peer-disabled:cursor-not-allowed peer-disabled:opacity-30">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
              ♫
            </div>

            <p className="mt-2 text-xs font-semibold text-white">Audio</p>

            <p className="mt-0.5 text-[10px] text-slate-500">MP3</p>
          </div>
        </label>

        {/* WebM */}
        <label className="cursor-pointer">
          <input
            id="downloadWebm"
            name="downloadType"
            type="radio"
            value="webm"
            className="peer sr-only"
          />

          <div className="relative h-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center transition peer-checked:border-cyan-400/50 peer-checked:bg-cyan-400/10 hover:border-cyan-400/20 peer-disabled:cursor-not-allowed peer-disabled:opacity-30">
            {/* Recommended Badge */}
            <span className="absolute right-6 -top-3 z-10 rounded-full bg-cyan-400/10 px-2 py-1 text-[9px] font-semibold text-cyan-400">
              Recommended
            </span>

            {/* Icon */}
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
              🌐︎
            </div>

            <p className="mt-2 text-xs font-semibold text-white">WebM</p>

            <p className="mt-0.5 text-[10px] text-slate-500">WebM</p>
          </div>
        </label>
      </div>
    </section>
  );
}

export default DownloadType;
