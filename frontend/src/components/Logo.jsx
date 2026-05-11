export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-lagoon via-vapor to-flare shadow-glow">
        <span className="text-lg font-black text-white">A</span>
      </div>
      <div>
        <p className="text-base font-black tracking-normal">Aurora</p>
        <p className="-mt-1 text-xs font-semibold text-white/45">Stream cloud</p>
      </div>
    </div>
  );
}
