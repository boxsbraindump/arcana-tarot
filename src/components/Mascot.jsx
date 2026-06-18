// Luna —— 可爱的月亮吉祥物（纯 SVG，可调表情）
export default function Mascot({ size = 96, mood = 'happy' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="mascot">
      <defs>
        <linearGradient id="luna-body" x1="20" y1="10" x2="100" y2="110">
          <stop offset="0" stopColor="#c79bff" />
          <stop offset="1" stopColor="#a35cf0" />
        </linearGradient>
      </defs>

      {/* 光晕 */}
      <circle cx="60" cy="60" r="52" fill="#f1e7ff" />

      {/* 月牙身体 */}
      <path
        d="M78 18a46 46 0 1 0 0 84 36 36 0 0 1 0-84z"
        fill="url(#luna-body)"
        stroke="#8636d6"
        strokeWidth="3"
      />

      {/* 小星星 */}
      <path d="M92 40l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6-5-2.9-5 2.9 1.2-5.6-4.2-3.8 5.6-.6z" fill="#ffc800" />

      {/* 眼睛 */}
      <circle cx="52" cy="54" r="6" fill="#3a2150" />
      <circle cx="72" cy="54" r="6" fill="#3a2150" />
      <circle cx="54" cy="52" r="2" fill="#fff" />
      <circle cx="74" cy="52" r="2" fill="#fff" />

      {/* 腮红 */}
      <ellipse cx="46" cy="66" rx="5" ry="3.2" fill="#ff9ec4" opacity="0.7" />
      <ellipse cx="78" cy="66" rx="5" ry="3.2" fill="#ff9ec4" opacity="0.7" />

      {/* 嘴 */}
      {mood === 'happy' && (
        <path d="M55 66q7 7 14 0" stroke="#3a2150" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      {mood === 'cheer' && (
        <path d="M54 64q8 11 16 0z" fill="#3a2150" />
      )}
      {mood === 'sad' && (
        <path d="M55 70q7 -6 14 0" stroke="#3a2150" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
    </svg>
  )
}
