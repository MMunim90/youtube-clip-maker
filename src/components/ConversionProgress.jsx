function ConversionProgress() {
  return (
    <section
      id="conversionProgress"
      className="mx-3 mt-3 hidden rounded-2xl border border-blue-500/35 bg-gradient-to-r from-[#081c3d] via-[#071a35] to-[#06152d] p-3.5 shadow-[0_0_22px_rgba(37,99,235,0.08)]"
    >
      <div className="flex items-center gap-3">
        {/* Processing Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-[5px] border-blue-400/25 border-t-cyan-400 border-r-blue-400">
            <span className="text-xs text-cyan-300">↻</span>
          </div>
        </div>

        {/* Progress Content */}
        <div className="min-w-0 flex-1">
          {/* Status + Percentage */}
          <div className="flex items-center justify-between gap-2">
            <p
              id="conversionStatus"
              className="min-w-0 truncate text-[13px] font-medium text-blue-200"
            >
              Converting...
            </p>

            <p
              id="progressPercentage"
              className="shrink-0 font-mono text-[16px] font-semibold text-blue-100"
            >
              0%
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 h-3 overflow-hidden rounded-full border border-blue-500/30 bg-[#06162d]">
            <div
              id="conversionProgressBar"
              className="h-full w-0 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-300"
            />
          </div>

          {/* Keep existing element for popup.js */}
          <p id="progressBlocks" className="hidden">
            ░░░░░░░░░░░░░░░░░░░░
          </p>
        </div>
      </div>
    </section>
  );
}

export default ConversionProgress;
