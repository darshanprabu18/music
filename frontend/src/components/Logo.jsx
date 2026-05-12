export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-glow">
        <span className="text-lg font-black text-white">
          V
        </span>
      </div>

      <div>
        <p className="text-base font-black tracking-normal">
          VibeCloud
        </p>

        <p className="-mt-1 text-xs font-semibold text-white/45">
          Music everywhere
        </p>
      </div>
    </div>
  );
}
