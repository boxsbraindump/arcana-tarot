import { motion } from 'framer-motion'
import Mascot from './Mascot'
import './CompleteScreen.css'

export default function CompleteScreen({ xp, onBack }) {
  return (
    <div className="done">
      <motion.div
        className="done__halo"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 11 }}
      >
        <Mascot size={130} mood="cheer" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        太棒了！
      </motion.h1>
      <motion.p
        className="done__sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        星辰已为你点亮新的牌义
      </motion.p>

      <motion.div
        className="done__stat"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="done__stat-num">+{xp}</span>
        <span className="done__stat-label">灵感值</span>
      </motion.div>

      <motion.button
        className="btn btn--primary done__btn"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        onClick={onBack}
      >
        返回牌阵
      </motion.button>
    </div>
  )
}
