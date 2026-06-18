import { motion } from 'framer-motion'
import './ReadingScreen.css'

// 「先阅读」阶段：进入答题前，先读一段讲解
export default function ReadingScreen({ reading, onExit, onDone }) {
  return (
    <div className="reading">
      <header className="reading__top">
        <button className="reading__close" onClick={onExit} aria-label="退出">✕</button>
        <span className="reading__badge">📖 约 {reading.minutes} 分钟阅读</span>
      </header>

      <main className="reading__scroll">
        <motion.h1
          className="reading__title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {reading.title}
        </motion.h1>

        {reading.kind === 'card' && (
          <motion.div
            className="reading__hero"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            <img className="reading__cardimg" src={reading.image} alt={reading.title} />
            <div className="reading__keywords">
              {reading.keywords.map((k) => (
                <span className="reading__kw" key={k}>{k}</span>
              ))}
            </div>
            <p className="reading__essence">"{reading.essence}"</p>
          </motion.div>
        )}

        <div className="gold-rule" style={{ maxWidth: 200, margin: '0 auto 28px' }} />

        {reading.sections.map((s, i) => (
          <motion.section
            className="reading__section"
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <h2 className="reading__heading">
              <span className="reading__heading-mark">✦</span>
              {s.heading}
            </h2>
            <p className="reading__body">{s.body}</p>
          </motion.section>
        ))}

        <p className="reading__sign">— 读完后，让我们试试你记住了多少 —</p>
      </main>

      <footer className="reading__footer">
        <button className="btn btn--primary" onClick={onDone}>
          我读完了，开始练习
        </button>
      </footer>
    </div>
  )
}
