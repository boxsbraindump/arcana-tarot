// ─────────────────────────────────────────────────────────────
//  课程数据 —— 把塔罗知识「蒸馏」成关卡
//  cards:        每张牌的结构化知识（含 symbols 看图拆解）
//  makeCardLesson: 从一张牌的数据自动生成 L1→L3 关卡
//  course:       单元 → 关卡
// ─────────────────────────────────────────────────────────────

export const cards = {
  fool: {
    id: 'fool',
    name: '愚人',
    nameEn: 'The Fool',
    numeral: '0',
    image: '/cards/fool.jpg',
    element: '风',
    keywords: ['新开始', '冒险', '信任', '天真'],
    intro:
      '愚人编号 0，是整副牌的起点。他背着行囊、手持白玫瑰，站在悬崖边缘正要纵身一跃，踏上未知的旅程。',
    essence: '崭新的旅程，带着信任纵身一跃。',
    upright: '新的开始、无限可能、冒险的勇气。',
    reversed: '鲁莽、逃避、准备不足就行动。',
    symbols: [
      { part: '悬崖边缘', meaning: '对未知的纵身一跃，不计后果', at: { x: 40, y: 84 } },
      { part: '高悬的太阳', meaning: '新开始的祝福与乐观', at: { x: 82, y: 13 } },
      { part: '白玫瑰', meaning: '纯洁无邪的意图', at: { x: 66, y: 34 } },
      { part: '小白狗', meaning: '本能的陪伴，也是前路的提醒', at: { x: 76, y: 70 } },
      { part: '背上的行囊', meaning: '尚未动用的潜能与经验', at: { x: 72, y: 17 } },
      { part: '远处雪山', meaning: '前方待克服的挑战', at: { x: 14, y: 58 } },
    ],
    // 把整张牌「翻译」成一段解读模板，挖空填写
    template: {
      prompt: '把愚人翻译成一段解读',
      text: '愚人站在 {0} 边，对未知 {1}。白玫瑰象征 {2}，行囊是未用的 {3}。他代表崭新的 {4}。',
      blanks: ['悬崖', '纵身一跃', '纯洁意图', '潜能', '旅程'],
      bank: ['悬崖', '纵身一跃', '纯洁意图', '潜能', '旅程', '秘密', '权威'],
      hints: [
        '愚人脚下、即将踏出的地方',
        '不计后果、对未知的一跳',
        '白色花朵通常象征什么？',
        '行囊里装着还没用上的……',
        '愚人是 0 号，一切的起点',
      ],
    },
    essenceCloze: {
      prompt: '一句话记住愚人',
      text: '愚人代表崭新的旅程，带着 {0} 纵身一跃。',
      blanks: ['信任'],
      bank: ['信任', '恐惧', '计划', '犹豫'],
    },
  },

  magician: {
    id: 'magician',
    name: '魔术师',
    nameEn: 'The Magician',
    numeral: 'I',
    image: '/cards/magician.jpg',
    element: '水星',
    keywords: ['行动', '创造', '专注', '资源'],
    intro:
      '魔术师编号 I。他一手指天、一手指地，桌上摆着四大元素的法器——他已拥有实现目标的一切工具。',
    essence: '把想法化为现实的力量，万事俱备。',
    upright: '行动力、创造、资源齐备、心想事成。',
    reversed: '操纵、才华错用、计划落空。',
    symbols: [
      { part: '指天指地的手势', meaning: '连接天与地，把意念落实到现实' },
      { part: '头顶的无限符号 ∞', meaning: '无穷的潜能与能量' },
      { part: '桌上的四件法器', meaning: '风火水土四元素，资源齐备' },
      { part: '红袍与白衣', meaning: '经验与纯粹意图的结合' },
      { part: '衔尾蛇腰带', meaning: '永恒与自我更新' },
      { part: '头顶的玫瑰与百合', meaning: '欲望与纯洁并存' },
    ],
    template: {
      prompt: '把魔术师翻译成一段解读',
      text: '魔术师一手指天一手指地，把 {0} 化为现实。头顶 {1} 符号代表潜能，桌上备齐四 {2} 法器。他代表 {3} 的行动力。',
      blanks: ['意念', '无限', '元素', '心想事成'],
      bank: ['意念', '无限', '元素', '心想事成', '直觉', '秘密'],
      hints: [
        '他想实现的念头、想法',
        '横放的 8 字，∞',
        '风、火、水、土，共四种',
        '万事俱备，想成就能成',
      ],
    },
    essenceCloze: {
      prompt: '一句话记住魔术师',
      text: '魔术师的核心，是把 {0} 化为现实。',
      blanks: ['想法'],
      bank: ['想法', '回忆', '恐惧', '他人'],
    },
  },

  priestess: {
    id: 'priestess',
    name: '女祭司',
    nameEn: 'The High Priestess',
    numeral: 'II',
    image: '/cards/priestess.jpg',
    element: '月亮',
    keywords: ['直觉', '潜意识', '神秘', '内省'],
    intro:
      '女祭司编号 II。她端坐在黑白双柱之间，身后垂着帘幕，遮蔽着不可言说的奥秘。',
    essence: '向内倾听，相信直觉与未揭晓的秘密。',
    upright: '直觉、潜意识、隐秘的知识、静观其变。',
    reversed: '压抑直觉、表里不一、迷失方向。',
    symbols: [
      { part: '黑白双柱', meaning: '二元对立，有形世界的门槛' },
      { part: '身后的帘幕', meaning: '遮蔽的潜意识与未知秘密' },
      { part: '怀中的卷轴', meaning: '隐秘的更高知识' },
      { part: '头顶的月冠', meaning: '直觉与月亮的阴性能量' },
      { part: '脚边的弦月', meaning: '周期与潜意识的潮汐' },
    ],
    template: {
      prompt: '把女祭司翻译成一段解读',
      text: '女祭司坐在黑白 {0} 间，身后 {1} 藏着秘密。她怀抱知识的 {2}，提醒我们相信 {3}。',
      blanks: ['双柱', '帘幕', '卷轴', '直觉'],
      bank: ['双柱', '帘幕', '卷轴', '直觉', '麦田', '太阳'],
      hints: [
        '她两侧黑白各一根',
        '身后遮挡视线的布',
        '她怀里抱着、写着知识的卷物',
        '不靠逻辑、心里的声音',
      ],
    },
    essenceCloze: {
      prompt: '一句话记住女祭司',
      text: '女祭司提醒我们向内倾听，相信 {0}。',
      blanks: ['直觉'],
      bank: ['直觉', '权威', '财富', '他人'],
    },
  },

  empress: {
    id: 'empress',
    name: '皇后',
    nameEn: 'The Empress',
    numeral: 'III',
    image: '/cards/empress.jpg',
    element: '金星',
    keywords: ['丰饶', '母性', '滋养', '感官'],
    intro:
      '皇后编号 III。她慵懒地坐在丰沃的自然之中，麦田与流水环绕，象征孕育万物的大地母亲。',
    essence: '丰盛的孕育，感官与自然的生命力。',
    upright: '丰盛、孕育、滋养、感官的享受。',
    reversed: '依赖、创造力枯竭、过度付出。',
    symbols: [
      { part: '茂盛的麦田', meaning: '丰收与物质的丰盛' },
      { part: '金星 ♀ 盾牌', meaning: '爱、美与女性能量' },
      { part: '十二星之冠', meaning: '与自然周期、黄道的连结' },
      { part: '身后的流水森林', meaning: '情感的滋养与生命力' },
      { part: '柔软的靠枕长裙', meaning: '感官的享受与舒适' },
    ],
    template: {
      prompt: '把皇后翻译成一段解读',
      text: '皇后坐在丰沃自然中，{0} 象征丰收，盾上 {1} 符号代表爱与美。她象征丰盛的 {2} 与生命力。',
      blanks: ['麦田', '金星', '孕育'],
      bank: ['麦田', '金星', '孕育', '双柱', '悬崖'],
      hints: [
        '脚下金黄、丰收的作物',
        '♀，代表爱与美的星',
        '母亲般，孕育新生命',
      ],
    },
    essenceCloze: {
      prompt: '一句话记住皇后',
      text: '皇后象征丰盛的孕育，与 {0} 的生命力。',
      blanks: ['自然'],
      bank: ['自然', '战争', '规则', '孤独'],
    },
  },
}

// —— 工具 ——
function shuffle(a) {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 一道符号题的选项：正确含义 + 1 个同牌其他符号 + 1 个别的牌的符号
function symbolOptions(card, sym) {
  const own = card.symbols.filter((s) => s !== sym).map((s) => s.meaning)
  const others = Object.values(cards)
    .filter((c) => c.id !== card.id)
    .flatMap((c) => c.symbols.map((s) => s.meaning))
  const d1 = shuffle(own)[0]
  const d2 = shuffle(others.filter((m) => m !== d1))[0]
  return shuffle([
    { text: sym.meaning, correct: true },
    { text: d1, correct: false },
    { text: d2, correct: false },
  ])
}

// 从一张牌的数据自动生成关卡：
//   每个符号「先教一张卡 → 再考一题」交替进行，全部点亮后做一道总体题
export function makeCardLesson(card) {
  const syms = card.symbols.slice(0, 5)
  const parts = syms.map((s) => s.part)
  const hasCoords = syms.every((s) => s.at)
  const steps = []

  if (hasCoords) {
    // 第一关：看图标注 —— 把符号名拖到图上对应位置，填对显示含义
    steps.push({
      type: 'label',
      image: card.image,
      name: card.name,
      numeral: card.numeral,
      items: syms.map((s) => ({ part: s.part, meaning: s.meaning, at: s.at })),
    })
    // 第二关：逐个符号回忆含义
    syms.forEach((sym, i) => {
      steps.push({
        type: 'symbol',
        image: card.image,
        part: sym.part,
        prompt: `图中的「${sym.part}」代表？`,
        options: symbolOptions(card, sym),
        track: { parts, i },
      })
    })
  } else {
    // 无坐标的牌：沿用「教一张卡 → 考一题」
    syms.forEach((sym, i) => {
      steps.push({
        type: 'teach',
        image: card.image,
        name: card.name,
        numeral: card.numeral,
        part: sym.part,
        meaning: sym.meaning,
        track: { parts, i },
      })
      steps.push({
        type: 'symbol',
        image: card.image,
        part: sym.part,
        prompt: `图中的「${sym.part}」代表？`,
        options: symbolOptions(card, sym),
        track: { parts, i },
      })
    })
  }

  // 总体题：所有符号合起来代表什么
  const otherEss = shuffle(
    Object.values(cards).filter((c) => c.id !== card.id).map((c) => c.essence)
  ).slice(0, 2)
  steps.push({
    type: 'symbol',
    image: card.image,
    prompt: `把这些合起来，${card.name}整体代表？`,
    options: shuffle([
      { text: card.essence, correct: true },
      ...otherEss.map((e) => ({ text: e, correct: false })),
    ]),
    track: { parts, i: parts.length },
  })

  return {
    id: 'card-' + card.id,
    title: card.name,
    icon: card.numeral,
    cardId: card.id,
    exercises: steps,
  }
}

export const course = {
  title: 'Arcana 大阿尔克那',
  units: [
    {
      id: 'u0',
      title: '序章 · 认识塔罗',
      subtitle: '先读懂，再开牌',
      hue: 210,
      lessons: [
        {
          id: 'u0l1',
          title: '塔罗是什么',
          icon: '✦',
          reading: {
            title: '第一课 · 塔罗是什么',
            minutes: 2,
            sections: [
              {
                heading: '一副纸牌的来历',
                body: '塔罗牌诞生于 15 世纪的意大利，最初只是贵族之间的纸牌游戏。几百年后，神秘学者才把它与埃及神话、卡巴拉和炼金术联系起来，赋予它占卜的意味。今天，越来越多人把它当作一种「与自己对话」的工具，而非预知未来的魔法。',
              },
              {
                heading: '随机的牌，为什么有意义',
                body: '常识会反问：随机抽到的牌怎么可能传递信息？心理学给了一个答案。弗洛伊德和荣格都认为，人有一个「潜意识」。当我们面对一张含义模糊的图像时，会不自觉地把内心的想法「投射」上去——你在牌里看到的，其实是你心里早已存在的东西。',
              },
              {
                heading: '原型：人类共通的意象',
                body: '荣格还提出了「原型」的概念：母亲、英雄、死亡、新生……有些意象是全人类共通的。塔罗牌正是这些原型的图像化，所以不同的人面对同一张牌，往往会产生相似的共鸣。',
              },
              {
                heading: '你心里的内在向导',
                body: '这门课的核心观点是：每个人心里都有一个「内在向导」（也被称作高我或超意识）。塔罗并不神奇，它更像《小飞象》里那根「魔法羽毛」——真正的力量一直在你自己身上，牌只是帮你接通它、给你开口的勇气。',
              },
            ],
          },
          exercises: [
            {
              type: 'template',
              prompt: '根据刚才的阅读，补全句子',
              text: '塔罗牌最早出现在 15 世纪的 {0}，最初是一种纸牌游戏。',
              blanks: ['意大利'],
              bank: ['意大利', '埃及', '法国', '希腊'],
            },
            {
              type: 'template',
              prompt: '补全这句话',
              text: '面对含义模糊的图像，我们会把内心想法 {0} 上去。',
              blanks: ['投射'],
              bank: ['投射', '隐藏', '遗忘', '否认'],
            },
            {
              type: 'template',
              prompt: '填入两个空格',
              text: '{0} 提出的「{1}」，是全人类共通的意象。',
              blanks: ['荣格', '原型'],
              bank: ['荣格', '原型', '弗洛伊德', '情结'],
            },
            {
              type: 'truefalse',
              prompt: '判断：塔罗的力量来自牌本身的魔法。',
              answer: false,
            },
            {
              type: 'choice',
              prompt: '「内在向导」指的是什么？',
              options: [
                { text: '每个人内在的智慧与高我', correct: true },
                { text: '牌盒里附带的说明书', correct: false },
                { text: '占卜师本人', correct: false },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'u1',
      title: '大阿尔克那 · 启程',
      subtitle: '愚人到皇后',
      hue: 268,
      lessons: [
        makeCardLesson(cards.fool),
        makeCardLesson(cards.magician),
        makeCardLesson(cards.priestess),
        makeCardLesson(cards.empress),
      ],
    },
  ],
}
