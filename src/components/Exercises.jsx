import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import TarotCard from './TarotCard'
import Mascot from './Mascot'
import { cards } from '../data/course'
import './Exercises.css'

// 把 "...{0}...{1}..." 解析成 文本 / 空格 片段
function parseTemplate(text) {
  const parts = []
  const re = /\{(\d+)\}/g
  let last = 0, m
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ t: 'text', v: text.slice(last, m.index) })
    parts.push({ t: 'blank', i: Number(m[1]) })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ t: 'text', v: text.slice(last) })
  return parts
}

// 牌面：优先真图，否则退回 CSS 手绘牌
function CardVisual({ ex }) {
  if (ex.image) {
    return (
      <div className="ex__img">
        <img src={ex.image} alt="塔罗牌" loading="lazy" />
      </div>
    )
  }
  if (ex.cardId && cards[ex.cardId]) {
    return (
      <div className="ex__card">
        <TarotCard card={cards[ex.cardId]} reversed={ex.orientation === 'reversed'} size="md" />
      </div>
    )
  }
  return null
}

// 符号进度：一排小圆点，逐个点亮
function Tracker({ parts, i }) {
  return (
    <div className="track">
      {parts.map((p, k) => (
        <span
          key={k}
          className={`track__pip ${k < i ? 'is-done' : k === i ? 'is-active' : ''}`}
          title={p}
        >
          {k < i ? '✓' : k + 1}
        </span>
      ))}
    </div>
  )
}

// 教学卡：先认识一个符号（不答题）
function TeachStep({ ex }) {
  return (
    <div className="ex">
      {ex.track && <Tracker {...ex.track} />}
      <p className="ex__prompt">先认识一个符号</p>
      <CardVisual ex={ex} />
      <div className="teach__caption">{ex.name} · {ex.numeral}</div>
      <motion.div
        className="teach__panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Mascot size={52} mood="happy" />
        <div className="teach__body">
          <strong className="teach__part">🔍 {ex.part}</strong>
          <p className="teach__meaning">{ex.meaning}</p>
        </div>
      </motion.div>
    </div>
  )
}

// —— 第一关：看图标注 —— 牌外的容器用引线指向图上符号，选名字填进对应容器 ——
function LabelExercise({ ex, onChange }) {
  const items = ex.items
  const leftItems = items.filter((it) => it.at.x < 50).sort((a, b) => a.at.y - b.at.y)
  const rightItems = items.filter((it) => it.at.x >= 50).sort((a, b) => a.at.y - b.at.y)

  const [tiles] = useState(() => {
    const arr = items.map((it) => it.part)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })
  const [placed, setPlaced] = useState({})
  const [shake, setShake] = useState(null)
  const [shownPart, setShownPart] = useState(null) // 当前显示含义的符号
  const [imgReady, setImgReady] = useState(false)
  const [selected, setSelected] = useState(null) // 点击模式：选中的名字
  const [dragging, setDragging] = useState(null) // 拖拽模式：正在拖的名字
  const [overBox, setOverBox] = useState(null)

  const wrapRef = useRef(null)
  const dotRefs = useRef({})
  const boxRefs = useRef({})
  const ghostRef = useRef(null) // 幽灵直接用 DOM 定位，跟手不滞后
  const placedRef = useRef(placed)
  placedRef.current = placed
  const [lines, setLines] = useState([])

  const allPlaced = Object.keys(placed).length === items.length

  useEffect(() => {
    onChange({ ready: allPlaced, correct: true, done: allPlaced })
  }, [placed])

  // 测量盒子(朝向卡牌的边)与锚点的真实位置，画引线
  useLayoutEffect(() => {
    function measure() {
      const w = wrapRef.current?.getBoundingClientRect()
      if (!w) return
      const out = []
      for (const it of items) {
        const d = dotRefs.current[it.part]?.getBoundingClientRect()
        const b = boxRefs.current[it.part]?.getBoundingClientRect()
        if (!d || !b) continue
        const fromRight = it.at.x < 50 // 左栏的盒子，引线从右边出
        out.push({
          part: it.part,
          x1: (fromRight ? b.right : b.left) - w.left,
          y1: b.top + b.height / 2 - w.top,
          x2: d.left + d.width / 2 - w.left,
          y2: d.top + d.height / 2 - w.top,
          done: !!placed[it.part],
        })
      }
      setLines(out)
    }
    measure()
    window.addEventListener('resize', measure)
    const t = setTimeout(measure, 250)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [placed, imgReady])

  // 把 name 放进 targetPart 容器：对→填入，错→抖动
  function tryPlace(name, targetPart) {
    if (!targetPart || placedRef.current[targetPart]) return
    if (targetPart === name) {
      setPlaced((p) => ({ ...p, [targetPart]: true }))
      setShownPart(targetPart) // 只显示最近填对的含义
    } else {
      setShake(targetPart)
      setTimeout(() => setShake(null), 450)
    }
  }

  // 按下名字：移动超过阈值才算拖拽，否则当作点击选中（两种模式共存）
  function onTileDown(e, name) {
    if (placedRef.current[name]) return
    e.preventDefault()
    const start = { x: e.clientX, y: e.clientY, dragging: false }
    const move = (ev) => {
      if (!start.dragging && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) {
        start.dragging = true
        setSelected(null)
        setDragging(name)
      }
      if (start.dragging) {
        if (ghostRef.current) {
          ghostRef.current.style.left = ev.clientX + 'px'
          ghostRef.current.style.top = ev.clientY + 'px'
        }
        const box = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.label__box')
        setOverBox(box?.getAttribute('data-part') || null)
      }
    }
    const up = (ev) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (start.dragging) {
        const box = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.label__box')
        tryPlace(name, box?.getAttribute('data-part'))
      } else {
        setSelected((prev) => (prev === name ? null : name)) // 点击：切换选中
      }
      setDragging(null)
      setOverBox(null)
    }
    // 幽灵先定位到按下点，避免首帧闪在角落
    if (ghostRef.current) {
      ghostRef.current.style.left = e.clientX + 'px'
      ghostRef.current.style.top = e.clientY + 'px'
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // 点容器：已填→看含义；点击模式下有选中→填入
  function onBoxClick(part) {
    if (placedRef.current[part]) {
      setShownPart(part)
      return
    }
    if (selected) {
      tryPlace(selected, part)
      setSelected(null)
    }
  }

  const renderBox = (it) => (
    <button
      key={it.part}
      ref={(el) => (boxRefs.current[it.part] = el)}
      data-part={it.part}
      className={`label__box ${placed[it.part] ? 'is-placed' : ''} ${shake === it.part ? 'is-shake' : ''} ${overBox === it.part ? 'is-over' : selected || dragging ? 'is-target' : ''}`}
      onClick={() => onBoxClick(it.part)}
    >
      {placed[it.part] ? it.part : '?'}
    </button>
  )

  const shownItem = shownPart ? items.find((i) => i.part === shownPart) : null

  return (
    <div className="ex">
      <p className="ex__prompt">{allPlaced ? '全部找到了！✨' : '拖名字到位置，或点名字再点位置'}</p>

      <div className="label__wrap" ref={wrapRef}>
        <svg className="label__lines">
          {lines.map((l) => (
            <line key={l.part} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className={l.done ? 'is-done' : ''} />
          ))}
        </svg>
        <div className="label__cols">
          <div className="label__col">{leftItems.map(renderBox)}</div>
          <div className="label__cardbox">
            <img className="label__img" src={ex.image} alt={ex.name} onLoad={() => setImgReady((v) => !v)} />
            {items.map((it) => (
              <span
                key={it.part}
                ref={(el) => (dotRefs.current[it.part] = el)}
                className={`label__dot ${placed[it.part] ? 'is-done' : ''}`}
                style={{ left: `${it.at.x}%`, top: `${it.at.y}%` }}
              />
            ))}
          </div>
          <div className="label__col">{rightItems.map(renderBox)}</div>
        </div>
      </div>

      {!allPlaced && (
        <div className="label__tiles">
          {tiles.map((t) => (
            <button
              key={t}
              className={`label__tile ${placed[t] ? 'is-used' : ''} ${selected === t ? 'is-sel' : ''} ${dragging === t ? 'is-dragging' : ''}`}
              disabled={placed[t]}
              onPointerDown={(e) => onTileDown(e, t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* 含义：只显示最近一个（点已填的容器可再看）*/}
      <div className="label__reveal">
        {shownItem && (
          <motion.div key={shownItem.part} className="label__revrow" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <strong>✓ {shownItem.part}</strong>
            <span>{shownItem.meaning}</span>
          </motion.div>
        )}
      </div>

      {/* 跟随指针的幽灵（始终在 DOM，拖拽时显示，用 ref 直接定位）*/}
      <div ref={ghostRef} className={`label__ghost ${dragging ? 'is-on' : ''}`}>{dragging || ''}</div>
    </div>
  )
}

// 统一出口：根据 type 渲染对应交互
export default function Exercise({ ex, checked, onChange }) {
  switch (ex.type) {
    case 'label':
      return <LabelExercise ex={ex} onChange={onChange} />
    case 'teach':
      return <TeachStep ex={ex} />
    case 'choice':
    case 'meaning':
    case 'symbol':
      return <OptionExercise ex={ex} checked={checked} onChange={onChange} />
    case 'truefalse':
      return <TrueFalseExercise ex={ex} checked={checked} onChange={onChange} />
    case 'match':
      return <MatchExercise ex={ex} checked={checked} onChange={onChange} />
    case 'template':
      return <TemplateExercise ex={ex} checked={checked} onChange={onChange} />
    default:
      return null
  }
}

// 为单个空生成词块：正确答案 + 最多 3 个干扰项
function optionsForBlank(blanks, bank, i) {
  const answer = blanks[i]
  const pool = [
    ...new Set([
      ...blanks.filter((b) => b !== answer),
      ...bank.filter((b) => !blanks.includes(b)),
    ]),
  ]
  const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3)
  return [answer, ...distractors].sort(() => Math.random() - 0.5)
}

// —— 渐进式解读模板：同屏逐空点亮，答错显示正确答案并要求改对 ——
function TemplateExercise({ ex, checked, onChange }) {
  const blanks = ex.blanks
  // 每个空一组词块（只算一次，避免重排）
  const [optionSets] = useState(() => blanks.map((_, i) => optionsForBlank(blanks, ex.bank, i)))
  const [cursor, setCursor] = useState(0)
  const [filled, setFilled] = useState(() => blanks.map(() => null)) // {word,status}|null
  const [dead, setDead] = useState({}) // 每空已划掉的错误词块 {blankIdx: Set}
  const [missed, setMissed] = useState(() => new Set())
  const [showHint, setShowHint] = useState(false)

  const done = cursor >= blanks.length

  useEffect(() => {
    onChange({ ready: done, correct: true, done })
  }, [cursor])

  function tap(w) {
    if (done) return
    if (w === blanks[cursor]) {
      const wasMissed = (dead[cursor]?.size ?? 0) > 0
      setFilled((prev) => prev.map((f, i) => (i === cursor ? { word: w, status: wasMissed ? 'missed' : 'correct' } : f)))
      setShowHint(false)
      setCursor((c) => c + 1)
    } else {
      setDead((prev) => ({ ...prev, [cursor]: new Set(prev[cursor]).add(w) }))
      setMissed((prev) => new Set(prev).add(cursor))
    }
  }

  const parts = parseTemplate(ex.text)
  const revealAt = (dead[cursor]?.size ?? 0) > 0 // 当前空答错过 → 揭示答案
  let dim = false

  return (
    <div className="ex">
      <p className="ex__prompt">{ex.prompt}</p>
      <CardVisual ex={ex} />

      <div className="cloze__text">
        {parts.map((p, k) => {
          if (p.t === 'text') return <span key={k} className={dim ? 'tpl__dim' : ''}>{p.v}</span>
          const j = p.i
          if (j < cursor) {
            const f = filled[j]
            return (
              <span key={k} className={`cloze__blank ${f.status === 'missed' ? 'is-missed' : 'is-correct'}`}>
                {f.word}
              </span>
            )
          }
          if (j === cursor) {
            dim = true
            return <span key={k} className="cloze__blank is-active">{'?'}</span>
          }
          dim = true
          return <span key={k} className="cloze__blank is-future">____</span>
        })}
      </div>

      {/* 提示 / 答错揭示 */}
      <div className="cstep__hintwrap">
        {!done && revealAt ? (
          <motion.div className="cstep__hint cstep__hint--reveal" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Mascot size={40} mood="sad" />
            <span>正确答案是「{blanks[cursor]}」，点它继续</span>
          </motion.div>
        ) : !done && ex.hints && showHint ? (
          <motion.div className="cstep__hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Mascot size={40} mood="happy" />
            <span>{ex.hints[cursor]}</span>
          </motion.div>
        ) : !done && ex.hints ? (
          <button className="cstep__hintbtn" onClick={() => setShowHint(true)}>💡 提示</button>
        ) : null}
      </div>

      {!done && (
        <div className="cloze__bank">
          {optionSets[cursor].map((w, i) => {
            const isDead = dead[cursor]?.has(w)
            const isAnswer = w === blanks[cursor]
            return (
              <button
                key={i}
                className={`cloze__tile ${isDead ? 'is-dead' : ''} ${revealAt && isAnswer ? 'is-answer' : ''}`}
                disabled={isDead}
                onClick={() => tap(w)}
              >
                {w}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// —— 完形填空：点词块填入空格 ——
function ClozeExercise({ ex, checked, onChange }) {
  const [filled, setFilled] = useState(() => ex.blanks.map(() => null)) // [{word, bankIdx}|null]

  const allFilled = filled.every((f) => f !== null)
  const allCorrect = filled.every((f, i) => f && f.word === ex.blanks[i])

  useEffect(() => {
    onChange({ ready: allFilled, correct: allFilled && allCorrect })
  }, [filled])

  const usedIdx = new Set(filled.filter(Boolean).map((f) => f.bankIdx))

  // 把 "...{0}...{1}..." 解析成文本与空格片段
  const parts = []
  const re = /\{(\d+)\}/g
  let last = 0, m
  while ((m = re.exec(ex.text))) {
    if (m.index > last) parts.push({ t: 'text', v: ex.text.slice(last, m.index) })
    parts.push({ t: 'blank', i: Number(m[1]) })
    last = m.index + m[0].length
  }
  if (last < ex.text.length) parts.push({ t: 'text', v: ex.text.slice(last) })

  function placeTile(bankIdx, word) {
    if (checked) return
    const target = filled.findIndex((f) => f === null)
    if (target === -1) return
    setFilled((prev) => prev.map((f, i) => (i === target ? { word, bankIdx } : f)))
  }
  function clearBlank(i) {
    if (checked) return
    setFilled((prev) => prev.map((f, idx) => (idx === i ? null : f)))
  }

  return (
    <div className="ex">
      <p className="ex__prompt">{ex.prompt}</p>
      <CardVisual ex={ex} />

      <div className="cloze__text">
        {parts.map((p, k) =>
          p.t === 'text' ? (
            <span key={k}>{p.v}</span>
          ) : (
            <button
              key={k}
              className={`cloze__blank ${filled[p.i] ? 'is-filled' : ''} ${
                checked ? (filled[p.i]?.word === ex.blanks[p.i] ? 'is-correct' : 'is-wrong') : ''
              }`}
              disabled={checked || !filled[p.i]}
              onClick={() => clearBlank(p.i)}
            >
              {filled[p.i] ? filled[p.i].word : ' '}
            </button>
          )
        )}
      </div>

      <div className="cloze__bank">
        {ex.bank.map((w, i) => (
          <button
            key={i}
            className="cloze__tile"
            disabled={checked || usedIdx.has(i)}
            onClick={() => placeTile(i, w)}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  )
}

// —— 选择题 / 含义题 / 看图拆符号（共用 UI）——
function OptionExercise({ ex, checked, onChange }) {
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    onChange({ ready: picked !== null, correct: picked !== null && ex.options[picked].correct })
  }, [picked])

  return (
    <div className="ex">
      {ex.track && <Tracker {...ex.track} />}
      <p className="ex__prompt">{ex.prompt}</p>
      <CardVisual ex={ex} />
      {ex.part && <div className="ex__part">🔍 {ex.part}</div>}
      <div className="ex__options">
        {ex.options.map((opt, i) => {
          let state = ''
          if (checked) {
            if (opt.correct) state = 'correct'
            else if (i === picked) state = 'wrong'
          } else if (i === picked) state = 'picked'
          return (
            <button
              key={i}
              className={`opt opt--${state}`}
              disabled={checked}
              onClick={() => setPicked(i)}
            >
              <span className="opt__bullet">{String.fromCharCode(65 + i)}</span>
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// —— 正逆位 / 判断题 ——
function TrueFalseExercise({ ex, checked, onChange }) {
  const [picked, setPicked] = useState(null)
  const card = ex.cardId ? cards[ex.cardId] : null

  useEffect(() => {
    onChange({ ready: picked !== null, correct: picked === ex.answer })
  }, [picked])

  const choices = [
    { label: '正确', value: true },
    { label: '错误', value: false },
  ]

  return (
    <div className="ex">
      <p className="ex__prompt">{ex.prompt}</p>
      {card && (
        <div className="ex__card">
          <TarotCard card={card} size="md" />
        </div>
      )}
      <div className="ex__tf">
        {choices.map((c) => {
          let state = ''
          if (checked) {
            if (c.value === ex.answer) state = 'correct'
            else if (c.value === picked) state = 'wrong'
          } else if (c.value === picked) state = 'picked'
          return (
            <button
              key={c.label}
              className={`tf opt--${state}`}
              disabled={checked}
              onClick={() => setPicked(c.value)}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// —— 连连看：牌 ↔ 关键词 ——
function MatchExercise({ ex, checked, onChange }) {
  const [shuffledWords] = useState(() =>
    [...ex.pairs].map((p) => p.keyword).sort(() => Math.random() - 0.5)
  )
  const [activeCard, setActiveCard] = useState(null)
  const [links, setLinks] = useState({}) // cardId -> keyword

  const allMatched = Object.keys(links).length === ex.pairs.length
  const allCorrect = ex.pairs.every((p) => links[p.cardId] === p.keyword)

  useEffect(() => {
    onChange({ ready: allMatched, correct: allMatched && allCorrect })
  }, [links])

  const usedWords = new Set(Object.values(links))

  function pickWord(word) {
    if (checked || !activeCard) return
    setLinks((prev) => {
      const next = { ...prev }
      // 取消该词此前的连接
      for (const k of Object.keys(next)) if (next[k] === word) delete next[k]
      next[activeCard] = word
      return next
    })
    setActiveCard(null)
  }

  return (
    <div className="ex">
      <p className="ex__prompt">{ex.prompt}</p>
      <div className="match">
        <div className="match__col">
          {ex.pairs.map((p) => {
            const card = cards[p.cardId]
            const linked = links[p.cardId]
            let state = activeCard === p.cardId ? 'active' : linked ? 'linked' : ''
            if (checked) state = links[p.cardId] === p.keyword ? 'correct' : 'wrong'
            return (
              <button
                key={p.cardId}
                className={`match__item match__card opt--${state}`}
                disabled={checked}
                onClick={() => setActiveCard(p.cardId)}
              >
                <span className="match__sym">{card.symbol}</span>
                <span>{card.name}</span>
                {linked && <span className="match__tag">{linked}</span>}
              </button>
            )
          })}
        </div>
        <div className="match__col">
          {shuffledWords.map((w) => (
            <button
              key={w}
              className={`match__item match__word ${usedWords.has(w) ? 'is-used' : ''}`}
              disabled={checked || usedWords.has(w)}
              onClick={() => pickWord(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <p className="match__hint">先点左侧的牌，再点右侧关键词进行连接</p>
    </div>
  )
}
