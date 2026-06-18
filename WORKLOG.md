# 开发记录 · Worklog

每次开发的进展记录，最新的在最上面。设计与学习逻辑见 [BRAINSTORM.md](BRAINSTORM.md)。

---

## 2026-06-17

**从 0 到上线**——把"做个多邻国式塔罗学习 App"的想法落地成可手机访问的原型。

### 上线
- GitHub 仓库（公开）：https://github.com/boxsbraindump/arcana-tarot
- 在线地址（GitHub Pages，push 自动部署）：https://boxsbraindump.github.io/arcana-tarot/
- 技术栈：React + Vite + framer-motion，进度存 localStorage

### 做了什么
- 搭好整体框架：学习路径（技能树）→ 关卡播放器 → 结算页，进度持久化 + 解锁
- UI 定为**多邻国明亮可爱风**（Baloo/Nunito、3D 胖按钮、月亮吉祥物 Luna）
- **序章**：learntarot 第一课概念阅读 + 完形填空
- **大阿尔克那 4 张**（愚人/魔术师/女祭司/皇后），公版 Rider-Waite 真图
- 关卡由数据驱动自动生成（`makeCardLesson()`）

### 核心玩法（定稿）
每张牌：
1. **第一关 · 看图标注**——牌外容器用引线指向图上符号，**拖拽或点击**填入，填对显示含义
2. **逐符号 教 → 考**
3. **总体含义题**

### 修复 / 调整
- `AnimatePresence` 退场动画卡死 → 改为重新挂载
- 答错揭示正确答案 + 必须改对
- 拖拽：DOM 直接定位 + `setPointerCapture`（移动端跟手）
- 卡牌 `aspect-ratio` 预留形状，消除横竖跳变
- 移除符号题顶部 1-2-3-4-5 进度点
- 4 张牌全部标了符号坐标，统一用第一关模式
- **手机端顶部文字被挡**：`.player__stage` 改顶部对齐，修复 flex 居中 + 滚动裁掉顶部的坑

### 待办 / 下次
- 真机反馈：拖拽跟手、三张新牌锚点准不准（凭看图标的，可能要微调）
- 可选：默认解锁所有牌方便测试 / 铺更多大牌 / 轻量复习关（SRS）

---

<!-- 新记录加在这一行下面，保持最新在最上面 -->
