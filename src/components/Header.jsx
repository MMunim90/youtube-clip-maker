function Header() {
  return (
    <header className="relative mx-3 mt-2 overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#0b1d46] via-[#081735] to-[#061128] shadow-[0_0_20px_rgba(37,99,235,0.12)]">

      {/* Soft background glow */}
      <div className="absolute -right-12 -bottom-16 h-28 w-56 rounded-full bg-blue-500/25 blur-3xl" />

      {/* Main realistic wave */}
      <div className="absolute -right-28 -bottom-12 h-28 w-[360px] rotate-[-8deg] rounded-[55%] border-t border-blue-400/30 bg-gradient-to-r from-transparent via-blue-600/30 to-blue-400/10" />

      {/* Wave highlight */}
      <div className="absolute -right-24 -bottom-8 h-20 w-[340px] rotate-[-9deg] rounded-[50%] border-t border-blue-300/20" />

      {/* Soft inner wave */}
      <div className="absolute -right-32 bottom-[-2px] h-16 w-[300px] rotate-[-10deg] rounded-[50%] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-[1px]" />

      {/* Content */}
      <div className="relative flex min-h-[76px] items-center gap-3 px-3 py-2">

        {/* YouTube Logo */}
        <div className="flex h-[40px] w-[54px] shrink-0 items-center justify-center rounded-[10px] bg-[#ff1010] shadow-[0_4px_12px_rgba(255,0,0,0.20)]">
          <div className="ml-0.5 h-0 w-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white" />
        </div>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-[20px] font-bold leading-tight tracking-tight text-white">
            YouTube{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              Clip Maker
            </span>
          </h1>

          <p className="mt-1 text-[10px] font-medium tracking-wide text-blue-200">
            Select
            <span className="mx-1.5 text-blue-300/70">•</span>
            Record
            <span className="mx-1.5 text-blue-300/70">•</span>
            Create
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;