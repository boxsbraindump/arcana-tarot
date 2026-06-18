import { motion } from 'framer-motion'
import './TarotCard.css'

// 纯 CSS / SVG 手绘塔罗牌 —— 原创视觉，无需版权素材
export default function TarotCard({ card, reversed = false, size = 'md' }) {
  if (!card) return null
  return (
    <motion.div
      className={`tcard tcard--${size} ${reversed ? 'tcard--rev' : ''}`}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
    >
      <div className="tcard__inner">
        <span className="tcard__corner tcard__corner--tl">✦</span>
        <span className="tcard__corner tcard__corner--tr">✦</span>
        <span className="tcard__corner tcard__corner--bl">✦</span>
        <span className="tcard__corner tcard__corner--br">✦</span>

        <div className="tcard__numeral">{card.numeral}</div>
        <div className="tcard__symbol">{card.symbol}</div>
        <div className="tcard__divider" />
        <div className="tcard__name">{card.name}</div>
        <div className="tcard__name-en">{card.nameEn}</div>
        {reversed && <div className="tcard__rev-tag">逆位</div>}
      </div>
    </motion.div>
  )
}
