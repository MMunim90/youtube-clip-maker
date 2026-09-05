function Header() {
  return (
    <header className="flex items-center justify-between border-b border-cyan-500/20 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          ▶
        </div>

        <div>
          <h1 className="text-base font-semibold text-white">
            YouTube Clip Maker
          </h1>

          <p className="text-xs text-slate-500">
            Select • Record • Create
          </p>
        </div>
      </div>

      {/* <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
        aria-label="Settings"
      >
        ⚙
      </button> */}
    </header>
  );
}

export default Header;