
import { PlaySquare, PenLine, Clock3, Timer } from "lucide-react";

function VideoInfo() {
  return (
    <section className="mx-3 mt-3 rounded-2xl border border-blue-500/35 bg-gradient-to-br from-[#081c3d] via-[#071a35] to-[#06152d] p-3.5 shadow-[0_0_22px_rgba(37,99,235,0.08)]">
      
      {/* Video Title Header */}
      <div className="flex items-center justify-between gap-3">

        {/* Title Icon + Text */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Video Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-purple-500/40 bg-purple-500/15">
            <PlaySquare
              size={27}
              strokeWidth={2}
              className="text-purple-300"
            />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-blue-200">
              Video Title
            </p>

            {/* Marquee Container */}
            <div className="relative mt-1 min-w-0 overflow-hidden whitespace-nowrap">
              <p
                id="videoTitle"
                className="inline-block text-[15px] font-bold text-white animate-marquee"
              >
                No video detected
              </p>
            </div>
          </div>
        </div>

        {/* Detect Video Button */}
        <button
          id="detectVideo"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/60 bg-cyan-400/10 px-3 py-2 text-[12px] font-semibold text-cyan-200 transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-400/20"
        >
          <PenLine size={20} strokeWidth={2} />

          <span>Detect Video</span>
        </button>
      </div>

      {/* Duration + Current Time */}
      <div className="mt-3 grid grid-cols-2 gap-3">

        {/* Duration */}
        <div className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-[#061a35]/80 px-3 py-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-400/15">
            <Clock3
              size={25}
              strokeWidth={2}
              className="text-blue-200"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium text-blue-200">
              Duration
            </p>

            <p
              id="duration"
              className="mt-0.5 font-mono text-[17px] font-bold leading-none text-white"
            >
              00:00
            </p>
          </div>
        </div>

        {/* Current Time */}
        <div className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-[#061a35]/80 px-3 py-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-400/15">
            <Timer
              size={25}
              strokeWidth={2}
              className="text-blue-200"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium text-blue-200">
              Current Time
            </p>

            <p
              id="currentTime"
              className="mt-0.5 font-mono text-[17px] font-bold leading-none text-white"
            >
              00:00
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoInfo;
