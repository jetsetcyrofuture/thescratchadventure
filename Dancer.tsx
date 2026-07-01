// components/Dancer.tsx
// Original cel-shaded street dancer drawn entirely in SVG. Nothing copied.
type Props = { animClass: string };

export default function Dancer({ animClass }: Props) {
  return (
    <svg
      className={`dancer ${animClass}`}
      viewBox="0 0 92 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* legs */}
      <path d="M34 100 L30 148 L44 148 L46 104 Z" fill="#2b2b44" stroke="#05050a" strokeWidth="3" />
      <path d="M58 100 L62 148 L48 148 L46 104 Z" fill="#20203a" stroke="#05050a" strokeWidth="3" />
      {/* torso — bright cel-shaded hoodie */}
      <path d="M28 58 L64 58 L60 104 L32 104 Z" fill="#ff2e7e" stroke="#05050a" strokeWidth="3" />
      <path d="M28 58 L46 58 L46 104 L32 104 Z" fill="#c6ff3d" opacity="0.15" />
      {/* arm (animated for scratch) */}
      <g className="arm">
        <path d="M60 62 L82 74 L78 82 L56 72 Z" fill="#21e6ff" stroke="#05050a" strokeWidth="3" />
      </g>
      {/* other arm */}
      <path d="M30 62 L14 78 L20 84 L36 70 Z" fill="#21e6ff" stroke="#05050a" strokeWidth="3" />
      {/* head + cap */}
      <g className="head">
        <circle cx="46" cy="42" r="15" fill="#f2c9a0" stroke="#05050a" strokeWidth="3" />
        <path d="M28 40 Q46 22 64 40 L64 34 Q46 18 28 34 Z" fill="#9b5cff" stroke="#05050a" strokeWidth="3" />
        <rect x="40" y="40" width="12" height="5" fill="#05050a" />
      </g>
    </svg>
  );
}
