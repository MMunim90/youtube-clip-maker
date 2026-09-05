function RecordingControls() {
  return (
    <section className="mx-4 my-5">
      {/* Start Recording */}
      <button
        id="startRecording"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:from-cyan-400 hover:to-blue-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale disabled:shadow-none"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
          ●
        </span>
        Start Recording
      </button>

      {/* Recording Controls */}
      <div id="recordingControls" className="mt-3 grid grid-cols-3 gap-2">
        {/* Pause */}
        <button
          id="pauseRecording"
          className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5 text-xs font-medium text-amber-400 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-amber-400/10"
        >
          ⏸ Pause
        </button>

        {/* Stop */}
        <button
          id="stopRecording"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs font-medium text-red-400 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-red-400/10"
        >
          ■ Stop
        </button>

        {/* Cancel */}
        <button
          id="cancelRecording"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400"
        >
          ✕ Cancel
        </button>
      </div>
    </section>
  );
}

export default RecordingControls;
