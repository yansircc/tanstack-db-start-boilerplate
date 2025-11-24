# 🦆 Motherduck Design Language

> _可见的秩序 · 温柔的理性_  
> A visual language that blends **industrial precision** with **playful warmth**.

---

## 🎯 设计理念（Philosophy）

**Motherduck 风格**是一种融合工业理性与温暖人性化的现代科技风格。  
核心特征是：

- **线框化结构**：可见的描边、统一的圆角和厚度；
- **柔和底色**：温暖米白与低饱和彩色点缀；
- **节奏排版**：等宽字体的秩序感 + 人文字体的可读性；
- **轻量动效**：物理感、可预期的互动反馈；
- **品牌气质**：聪明、可爱、有点 geek、极度自信。

> “它看起来像一个懂设计的工程师做的产品。”

---

## 🎨 视觉基调（Visual Foundation）

| 元素 | 示例 | 说明 |
|------|------|------|
| **主色 Primary** | ![#6FC2FF](https://placehold.co/20/6FC2FF/000000?text=·) `#6FC2FF` | 品牌蓝，主要动作与链接色 |
| **辅助色 Secondary** | ![#FFDE00](https://placehold.co/20/FFDE00/000000?text=·) `#FFDE00` | 品牌黄，强调与趣味点 |
| **强调色 Accent** | ![#53DBC9](https://placehold.co/20/53DBC9/000000?text=·) `#53DBC9` | 品牌青 |
| **警告红 Red** | ![#FF7169](https://placehold.co/20/FF7169/000000?text=·) `#FF7169` | 强调或错误提示 |
| **文本/描边 Ink** | ![#383838](https://placehold.co/20/383838/FFFFFF?text=·) `#383838` | 主文本与边框 |
| **背景 Base** | ![#F4EFEA](https://placehold.co/20/F4EFEA/000000?text=·) `#F4EFEA` | 温暖米白背景 |
| **Hover 背景** | ![#F1F1F1](https://placehold.co/20/F1F1F1/000000?text=·) `#F1F1F1` | 悬浮反馈灰 |
| **Focus 蓝** | ![#2BA5FF](https://placehold.co/20/2BA5FF/000000?text=·) `#2BA5FF` | 焦点/活动态 |
| **Success** | ![#068475](https://placehold.co/20/068475/000000?text=·) `#068475` | 成功状态 |
| **Error** | ![#E23F35](https://placehold.co/20/E23F35/000000?text=·) `#E23F35` | 错误状态 |

---

## 🔡 字体系统（Typography）

| 层级 | 字体 | 字号 / 行高 | 用途 |
|------|------|--------------|------|
| H1 | Aeonik Mono | 72 / 86px | 页面标题 |
| H2 | Aeonik Mono | 32 / 44px | 分区标题 |
| H3 | Aeonik Mono | 40 / 56px | 小节标题 |
| Body | Inter | 20 / 32px | 正文 |
| Subtext | Inter | 18 / 28px | 辅助说明 |
| Small | Inter | 16 / 25px | 标签、次要信息 |

**特征：**
- 所有标题全大写；
- 字距略宽 (`letter-spacing: 0.02em`)；
- 行高根据视觉层级递增（1.2 → 1.6）；
- 让“理性”和“友好”并存。

---

## 🧱 结构语言（Structural Grammar）

### 1. 可见的结构
- 所有组件都有 **2px 边框**；
- 边框颜色为 `#383838`；
- **圆角统一为 2px**；
- 阴影极少，靠边线区分层级；
- 结构永远是“看得见的”。

### 2. 空间系统
- 基于 **8px 网格**；
- 组件内外留白遵循 `8 → 16 → 24 → 32` 等比例；
- 保留“空气感”，拒绝拥挤。

### 3. 层次逻辑
| 层 | 含义 | 表现 |
|----|------|------|
| 1️⃣ 结构层 | 定义形体边界 | 2px 描边、圆角 |
| 2️⃣ 表面层 | 背景与填充 | 白或浅米色 |
| 3️⃣ 交互层 | Hover / Focus 反馈 | 灰底、蓝边、轻位移 |
| 4️⃣ 内容层 | 字体、图标、图形 | 统一排版规则 |

---

## ⚙️ 交互与动效（Interaction & Motion）

| 动作 | 动画 | 时长 | 说明 |
|------|------|------|------|
| Hover | 透明度/位移/底块显现 | 120–160ms | “轻浮起”效果 |
| Active | 微下移（1px） | 80–100ms | 模拟点击物理感 |
| Focus | 蓝色 outline 2px | 即时 | 键盘/可聚焦反馈 |
| Dropdown | 淡入 + 下移 | 200ms ease-out | 平滑可见 |
| Disabled | 灰化 + 无交互 | 无 | 状态清晰 |

> 动效是“确认”，不是“装饰”。

---

## 🧩 组件共性（Component DNA）

> 每个组件都是以下设计原则的组合：

| 模块 | 由哪些原则组成 | 设计语义 |
|------|----------------|----------|
| **Button** | Structure + State + Motion + Focus | 工业按钮感，带物理浮动 |
| **Input** | Structure + State + Focus | 清晰边框、温和交互 |
| **Card** | Structure + Surface + Spacing | 平面、稳重、空间留白 |
| **Nav / Tabs** | Typography + Hover + Spacing | 等宽字的节奏与反馈 |
| **Dropdown / Menu** | Card + Motion + Interactivity | 轻层级、快速出现 |

### 通用风格关键词：
> _Flat · Framed · Minimal · Warm · Rational · Playful_

---

## 🧠 状态系统（State System）

| 状态 | 视觉 | 规则 |
|------|------|------|
| Hover | 背景浅灰 `#F1F1F1` 或浮起 4px | 提示可点 |
| Active | 元素整体下压 1px | 物理反馈 |
| Focus | 外描蓝边 2px | 焦点显性 |
| Disabled | 灰底 + 灰字 | 不可交互 |
| Error | 红描边 `#E23F35` | 表单警示 |
| Success | 绿描边 `#068475` | 表单确认 |

---

## ☁️ 装饰元素（Illustration / Icons）

- 黑色描边（`stroke: #383838; width: 1.5–1.7`）；
- 填充多用品牌青 `#16AA98` 或底色 `#F4EFEA`；
- 形态自然、有机（云朵、圆形、液态形）；
- 保持“手绘 + 工程感”的平衡。

---

## 🧭 布局与响应（Layout & Responsiveness）

- **Container 宽度**：`max-width: 1280px`；
- **Section 间距**：`py-16`（128px） 或 `py-24`（192px）；
- **断点策略**：
  - Mobile: 单列；
  - Tablet: 双列；
  - Desktop: 三列；
- **字号响应式调整**：H1 64→72，Body 18→20。

---

## 💬 品牌语气（Tone & Feel）

| 维度 | 特征 |
|------|------|
| **视觉语气** | 工业感线框 + 温暖底色，严肃但不冷 |
| **交互语气** | 直接、轻盈、可预期 |
| **品牌人格** | 聪明、有趣、有点 geek |
| **整体感受** | Rational Joy — 理性中的温度 |

> _“Motherduck 的界面让你感觉：  
> 它认真工作，但不会板着脸。”_

---

## 🧭 快速回顾：十条视觉原则

1. 可见的结构  
2. 柔和的底色  
3. 8px 空间节奏  
4. 工业+人文的字体组合  
5. 统一 2px 圆角与描边  
6. 简单而精确的动效  
7. 色彩少而分层明确  
8. 明确的层次结构  
9. 一致的状态系统  
10. 品牌语气：**理性 + 温度**

---

## 🔗 附录：关键词
```
Industrial Minimalism
Warm Tech
Playful Precision
Clear Lines
Soft Colors
Gentle Motion
Rational Joy
```

---

> 🦆 **Motherduck = 可见的秩序 + 温柔的理性。**