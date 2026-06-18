import { useState, useEffect } from 'react'
import PathScreen from './components/PathScreen'
import LessonPlayer from './components/LessonPlayer'
import CompleteScreen from './components/CompleteScreen'

const STORAGE_KEY = 'arcana-progress-v1'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      return { completed: new Set(p.completed), xp: p.xp || 0 }
    }
  } catch (e) { /* ignore */ }
  return { completed: new Set(), xp: 0 }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: [...p.completed], xp: p.xp }))
}

export default function App() {
  const [screen, setScreen] = useState('path') // path | lesson | complete
  const [activeLesson, setActiveLesson] = useState(null)
  const [lastXp, setLastXp] = useState(0)
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => { saveProgress(progress) }, [progress])

  function startLesson(lesson) {
    setActiveLesson(lesson)
    setScreen('lesson')
  }

  function completeLesson({ xp, lessonId }) {
    setProgress((prev) => ({
      completed: new Set(prev.completed).add(lessonId),
      xp: prev.xp + xp,
    }))
    setLastXp(xp)
    setScreen('complete')
  }

  return (
    <>
      {screen === 'path' && <PathScreen progress={progress} onStart={startLesson} />}
      {screen === 'lesson' && (
        <LessonPlayer
          lesson={activeLesson}
          onExit={() => setScreen('path')}
          onComplete={completeLesson}
        />
      )}
      {screen === 'complete' && (
        <CompleteScreen xp={lastXp} onBack={() => setScreen('path')} />
      )}
    </>
  )
}
