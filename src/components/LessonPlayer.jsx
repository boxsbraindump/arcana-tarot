import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Exercise from './Exercises'
import ReadingScreen from './ReadingScreen'
import CardLearn from './CardLearn'
import './LessonPlayer.css'

const MAX_HEARTS = 3

export default function LessonPlayer({ lesson, onExit, onComplete }) {
  const [phase, setPhase] = useState(
    lesson.learn ? 'learn' : lesson.reading ? 'reading' : 'quiz'
  )
  const [queue, setQueue] = useState(() => [...lesson.exercises]) // 答错的题会追加到队尾重做
  const [idx, setIdx] = useState(0)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [answer, setAnswer] = useState({ ready: false, correct: false })
  const [checked, setChecked] = useState(false)
  const [xp, setXp] = useState(0)

  const total = queue.length
  const ex = queue[idx]
  const progress = (idx / total) * 100
  const autoCheck = ex.type === 'template' || ex.type === 'label' // 自带判定，无需「检查」按钮
  const isTeach = ex.type === 'teach' // 教学卡，无需作答，直接继续

  // 模板填完后自动进入「已检查」状态，直接显示「继续」
  useEffect(() => {
    if (answer.done && !checked) {
      setChecked(true)
      setXp((x) => x + 10)
    }
  }, [answer.done])

  function handleCheck() {
    setChecked(true)
    if (answer.correct) setXp((x) => x + 10)
    else setHearts((h) => h - 1)
  }

  function handleContinue() {
    if (hearts <= 0 && !answer.correct) {
      onExit() // 心耗尽：退出本课（原型简化处理）
      return
    }
    // 答错的题（选择/判断类）追加到队尾，本关结束前重做
    let nextQueue = queue
    if (!autoCheck && !isTeach && !answer.correct) {
      nextQueue = [...queue, ex]
      setQueue(nextQueue)
    }
    if (idx + 1 >= nextQueue.length) {
      onComplete({ xp, lessonId: lesson.id })
      return
    }
    setIdx((i) => i + 1)
    setChecked(false)
    setAnswer({ ready: false, correct: false })
  }

  const footerState = !checked ? 'idle' : answer.correct ? 'correct' : 'wrong'

  if (phase === 'learn') {
    return (
      <CardLearn learn={lesson.learn} onExit={onExit} onDone={() => setPhase('quiz')} />
    )
  }

  if (phase === 'reading') {
    return (
      <ReadingScreen
        reading={lesson.reading}
        onExit={onExit}
        onDone={() => setPhase('quiz')}
      />
    )
  }

  return (
    <div className="player">
      <header className="player__top">
        <button className="player__close" onClick={onExit} aria-label="退出">✕</button>
        <div className="player__bar">
          <motion.div
            className="player__bar-fill"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <div className="player__hearts">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={`heart ${i < hearts ? '' : 'heart--lost'}`}>
              {i < hearts ? '✦' : '✧'}
            </span>
          ))}
        </div>
      </header>

      <main className="player__stage">
        <motion.div
          key={idx}
          className="player__exhost"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Exercise ex={ex} checked={checked} onChange={setAnswer} />
        </motion.div>
      </main>

      {checked && (
        <motion.div
          className={`feedback feedback--${footerState}`}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        >
          <div className="feedback__icon">{answer.correct ? '✦' : '☾'}</div>
          <div className="feedback__text">
            <strong>{answer.correct ? '占卜准确' : '再感受一次'}</strong>
            <span>{answer.correct ? `+10 灵感` : '直觉会随练习变敏锐'}</span>
          </div>
        </motion.div>
      )}

      <footer className="player__footer">
        {isTeach ? (
          <button className="btn btn--primary" onClick={handleContinue}>
            我记住了
          </button>
        ) : checked ? (
          <button
            className={`btn ${answer.correct ? 'btn--correct' : 'btn--wrong'}`}
            onClick={handleContinue}
          >
            {idx + 1 >= total ? '完成' : '继续'}
          </button>
        ) : autoCheck ? (
          ex.type === 'label' ? (
            <p className="player__autohint">把 5 个符号都找到 🔍</p>
          ) : (
            <p className="player__autohint">把每个空填对就能继续 ✨</p>
          )
        ) : (
          <button className="btn btn--primary" disabled={!answer.ready} onClick={handleCheck}>
            检查
          </button>
        )}
      </footer>
    </div>
  )
}
