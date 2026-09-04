function ConversionProgress() {
  return (
    <section
      id="conversionSection"
      className="mx-4 mt-4 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Processing</h2>

          <p id="conversionStatus" className="mt-1 text-xs text-slate-500">
            Converting your recording...
          </p>
        </div>

        <span
          id="conversionPercent"
          className="font-mono text-sm font-semibold text-cyan-400"
        >
          0%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          id="conversionProgress"
          className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
        />
      </div>

      {/* File Info */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500">Output Format</span>

        <span id="outputFormat" className="font-medium text-slate-300">
          MP4
        </span>
      </div>
    </section>
  );
}

export default ConversionProgress;
