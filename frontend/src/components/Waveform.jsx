export default function Waveform({ active = false }) {
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden="true">
      {[0.45, 0.85, 0.55, 1, 0.65, 0.35].map((height, index) => (
        <span
          key={height + index}
          className={`w-1.5 origin-bottom rounded-full bg-gradient-to-t from-lagoon to-flare ${
            active ? "animate-bars" : ""
          }`}
          style={{
            height: `${height * 100}%`,
            animationDelay: `${index * 90}ms`
          }}
        />
      ))}
    </div>
  );
}
