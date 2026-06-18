import { useState } from 'react'
import { motion } from 'framer-motion'
import Mascot from './Mascot'
import './CardLearn.css'

// 交互式学习：点亮牌中每个符号，Luna 逐个讲解。全部点亮才进测试。
export default function CardLearn({ learn, onExit, onDone }) {
  const [explored, setExplored] = useState(new Set())
  const [active, setActive] = useState(null) // 当前讲解的符号 index

  const total = learn.symbols.length
  const allDone = explored.size === total
  const current = active !== null ? learn.symbols[active] : null

  function tap(i) {
    setActive(i)
    setExplored((prev) => new Set(prev).add(i))
  }

  return (
    <div className="learn">
      <header className="learn__top">
        <button className="learn__close" onClick={onExit} aria-label="退出">✕</button>
        <div className="learn__count">已点亮 {explored.size}/{total} 个符号</div>
      </header>

      <main className="learn__body">
        <h1 className="learn__title">{learn.title}</h1>
        <div className="learn__keywords">
          {learn.keywords.map((k) => (
            <span className="learn__kw" key={k}>{k}</span>
          ))}
        </div>

        <img className="learn__img" src={learn.image} alt={learn.title} />

        {/* Luna 讲解区 */}
        <div className="learn__teach">
          <Mascot size={64} mood={allDone ? 'cheer' : 'happy'} />
          <div className="learn__bubble">
            <motion.div
              key={active === null ? 'hint' : active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {current ? (
                <>
                  <strong>{current.part}</strong>
                  <p>{current.meaning}</p>
                </>
              ) : allDone ? (
                <p>全部认识啦！准备好就来做练习吧 ✨</p>
              ) : (
                <p>点点下面的符号，看看每个代表什么 👇</p>
              )}
            </motion.div>
          </div>
        </div>

        {/* 符号按钮 */}
        <div className="learn__chips">
          {learn.symbols.map((s, i) => (
            <button
              key={i}
              className={`learn__chip ${explored.has(i) ? 'is-done' : ''} ${active === i ? 'is-active' : ''}`}
              onClick={() => tap(i)}
            >
              {explored.has(i) && <span className="learn__chip-tick">✓</span>}
              {s.part}
            </button>
          ))}
        </div>
      </main>

      <footer className="learn__footer">
        <button className="btn btn--primary" disabled={!allDone} onClick={onDone}>
          {allDone ? '开始练习' : `还差 ${total - explored.size} 个符号`}
        </button>
      </footer>
    </div>
  )
}
