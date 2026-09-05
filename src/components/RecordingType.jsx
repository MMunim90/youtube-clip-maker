function RecordingType() {
  return (
    <section className="mx-4 mt-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-white">Recording Type</h2>

        <p className="mt-1 text-xs text-slate-500">
          Choose what you want to record
        </p>
      </div>

      <div className="space-y-2">
        {/* Video + Audio */}
        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-3 transition hover:border-cyan-400/60 hover:bg-cyan-400/15 has-[:checked]:border-cyan-400/50 has-[:checked]:bg-cyan-400/10">
          <input
            id="videoAudio"
            name="recordingType"
            type="radio"
            value="video"
            defaultChecked
            className="h-4 w-4 shrink-0 accent-cyan-400"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Video + Audio</p>

            <p className="mt-0.5 text-xs text-slate-500">
              Record video with sound
            </p>
          </div>
        </label>

        {/* Video Only */}
        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3 transition hover:border-cyan-400/30 hover:bg-slate-900">
          <input
            id="videoOnly"
            name="recordingType"
            type="radio"
            value="video-only"
            className="h-4 w-4 shrink-0 accent-cyan-400"
          />

          <div>
            <p className="text-sm font-medium text-white">Video Only</p>

            <p className="mt-0.5 text-xs text-slate-500">
              Record video without sound
            </p>
          </div>
        </label>

        {/* Audio Only */}
        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3 transition hover:border-cyan-400/30 hover:bg-slate-900">
          <input
            id="audioOnly"
            name="recordingType"
            type="radio"
            value="audio"
            className="h-4 w-4 shrink-0 accent-cyan-400"
          />

          <div>
            <p className="text-sm font-medium text-white">Audio Only</p>

            <p className="mt-0.5 text-xs text-slate-500">
              Record only the audio
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}

export default RecordingType;
