import { motion } from 'framer-motion'
import { course } from '../data/course'
import Mascot from './Mascot'
import './PathScreen.css'

export default function PathScreen({ progress, onStart }) {
  const completed = progress.completed // Set of lessonId
  let globalIdx = 0

  // 找出第一个未完成的关卡 = 当前可学
  const flat = course.units.flatMap((u) => u.lessons.map((l) => l.id))
  const currentId = flat.find((id) => !completed.has(id)) ?? null

  return (
    <div className="path">
      <header className="path__head">
        <div className="path__stats">
          <span className="pill pill--heart">❤️ 3</span>
          <span className="pill pill--xp">✦ {progress.xp}</span>
          <span className="pill pill--done">🏆 {completed.size}</span>
        </div>
        <div className="path__hero">
          <motion.div animate={{ rotate: [0, -4, 4, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <Mascot size={92} mood="happy" />
          </motion.div>
          <div>
            <h1 className="path__title">Arcana</h1>
            <p className="path__sub">和 Luna 一起学塔罗 ✨</p>
          </div>
        </div>
      </header>

      {course.units.map((unit) => (
        <section className="unit" key={unit.id} style={{ '--hue': unit.hue }}>
          <div className="unit__banner">
            <h2>{unit.title}</h2>
            <p>{unit.subtitle}</p>
          </div>

          <div className="unit__path">
            {unit.lessons.map((lesson, i) => {
              const done = completed.has(lesson.id)
              const isCurrent = lesson.id === currentId
              const locked = !done && !isCurrent
              const offset = Math.sin(globalIdx * 1.1) * 70
              globalIdx++
              return (
                <motion.div
                  className="node-wrap"
                  key={lesson.id}
                  style={{ transform: `translateX(${offset}px)` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {isCurrent && <span className="node__bubble">开始</span>}
                  <button
                    className={`node ${done ? 'node--done' : ''} ${isCurrent ? 'node--current' : ''} ${locked ? 'node--locked' : ''}`}
                    disabled={locked}
                    onClick={() => onStart(lesson)}
                  >
                    <span className="node__icon">{done ? '✓' : locked ? '🔒' : lesson.icon}</span>
                    {isCurrent && <span className="node__pulse" />}
                  </button>
                  <span className="node__label">{lesson.title}</span>
                </motion.div>
              )
            })}
          </div>
        </section>
      ))}

      <footer className="path__foot">
        <div className="gold-rule" />
        <p>“The cards reveal what the heart already knows.”</p>
      </footer>
    </div>
  )
}
