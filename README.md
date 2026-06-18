# Arcana · 塔罗修习

多邻国式的塔罗学习 App（原型）。用「看图标注 → 教/考 → 完形填空」的节奏，
配合公版 Rider-Waite 牌面，帮你真正记住每张牌的含义。

## 本地运行

```bash
npm install
npm run dev
```

默认在 http://localhost:5180/ 。手机同局域网测试：

```bash
npm run dev -- --host
```

然后用手机访问终端里显示的 `Network` 地址（如 `http://192.168.x.x:5180/`）。

## 技术栈

- React 18 + Vite
- framer-motion（动效）
- 纯前端，进度存 localStorage

## 结构

- `src/data/course.js` — 课程数据（牌库 + 关卡生成器，"蒸馏"的核心）
- `src/components/` — 关卡播放器、各题型、看图标注、吉祥物 Luna 等
- `public/cards/` — 公版 Rider-Waite 牌面（1909 Smith 版，公有领域）
- `BRAINSTORM.md` — 设计与学习逻辑的讨论记录

牌面图与课文内容为公版素材的改写/重绘，仅供学习用途。
