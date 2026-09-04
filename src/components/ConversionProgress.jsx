function ConversionProgress() {
  return (
    <section
      id="conversionProgress"
      className="mx-4 mt-4 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Processing</h2>

          <p id="conversionStatus" className="mt-1 text-xs text-slate-500">
            Converting...
          </p>
        </div>

        <span
          id="progressPercentage"
          className="font-mono text-sm font-semibold text-cyan-400"
        >
          0%
        </span>
      </div>

      {/* Block Progress */}
      <div className="mt-4 overflow-hidden rounded-lg bg-slate-950/70 px-3 py-2">
        <p
          id="progressBlocks"
          className="overflow-hidden whitespace-nowrap font-mono text-[11px] tracking-tight text-cyan-400"
        >
          ░░░░░░░░░░░░░░░░░░░░
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
      </div>
    </section>
  );
}

export default ConversionProgress;
