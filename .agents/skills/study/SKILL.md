---
name: study
description: >-
  Generate interview-prep teaching notes for ONE concept page on this site
  (e.g. /study llm/tokenization). Use when the user wants notes written,
  generated, expanded, or refreshed for a knowledge page (生成笔记, 写笔记,
  准备 Tokenization, /study). Writes the teaching half only — never the
  user's own answers.
---

# Study — 生成一页的教学笔记

把一个知识点写成「能学懂 + 能面试」的一页。**一次只做一页**，不批量生成整个专栏。互相依赖、分开讲反而看不懂的主题合并成一页（例：`llm/transformer` 就是 Attention & Transformer 合并页）。

配套技能：[drill](../drill/SKILL.md) 负责考你、批改、更新进度。本技能只负责写教材。

格式基准：`contents/docs/llm/tokenization/index.mdx`（写法、双语、提示框）和 `contents/docs/llm/transformer/index.mdx`（按前置知识逐级编排、学习路线表、每级自测）。有疑问先读它们，不要凭印象写。

## 核心边界：事实可以代写，表达不能代写

| 本技能生成 | 本技能**绝不**生成 |
| --- | --- |
| 学习路线 / 需要掌握 / 各 Level 的讲解和自测题 / 陷阱 / 连接 | `## 我的答案`（30s / 2min） |
| 面试问题（**只有题干，没有答案**） | `## 项目锚点` |
| | `mastery` 自评分 |

用户自己写不出来的东西，agent 替他写了等于没学。留空位、留提示，不要填内容。

## 目标路径

`/study <collection>/<slug>` → `contents/docs/<collection>/<slug>/index.mdx`

没给参数时，按 `status` 选：先找 `learning`（提示应该用 `/drill` 续上，而不是重新生成），再找最靠前的 `todo`。

写新页要在 `settings/documents.ts` 加导航；归属看 `.cursor/skills/publish-note/taxonomy.md`，不要把别的页该管的内容写进来。

## 生成前的两道闸

**1. 先答「我的问题」。** 用户学习时冒出的问题以 `<MyQuestion q="…">` 蓝色问答块插在相关小节里，不单独成节。目标页有**没写答案的**（自闭合的 `<MyQuestion q="…" />`）时，**先处理它们再写别的**：

- 属于本页的 → 在原位置补上答案，中英两个 Locale 块各一份。只补正文没讲到的部分，正文已经讲过的一句带过并指向那一节，不要重复
- 是别的 Level 的内容（比如读 L1 时问到 L2 的机制）→ 挪到那个 Level 对应的小节后面再答
- 属于别页的 → 挪到那一页对应的小节，本页删掉，并告诉用户挪去了哪
- 几条问的是同一件事，或者一条是另一条的追问 → 合并成一个问答块，问题写成一句能概括的话

**2. 查 todo 积压。** 统计 `contents/docs/**/index.mdx` 里 `status: todo` 的页数：

```bash
grep -rl "^status: todo" contents/docs --include=index.mdx | wc -l
```

**超过 5 页就停下**，告诉用户积压了哪几页，建议先 `/drill` 消化。笔记生成得比人学得快，最后会变成「全站金光闪闪，实际学了八页」——这是这套流程唯一真正的失败模式。用户坚持要生成就照做，但要先说这句话。

## 编排原则（先于写法，最重要）

Attention / Transformer 第一版被打回的原因不是写得不细，而是**顺序错了**：「Encoder-only vs Decoder-only」排在最前面，读者却连 encoder 是什么都不知道；`[1, 5]` 这种张量形状、「deep stack won't train」这种说法也没人解释过。按「基本概念 / 机制 / 工程」机械地切三层，默认读者已经会深度学习基础，就会出现这种一头雾水。所以动笔之前，先按下面五条排好大纲：

1. **按前置依赖排序。** 每一节只能用前面讲过的概念。写之前列出本页所有概念，画出「谁依赖谁」，按拓扑顺序排 Level。概念 A 要用到 B，B 就必须先讲
2. **先问题，后方案，再细节。** 先讲「为什么需要它 / 之前的做法哪里不行」，再讲「怎么做」，最后讲变体和工程影响。例：先讲 RNN encoder-decoder 的两个硬伤，attention 和 self-attention 才有来由
3. **术语首次出现当场解释。** 一句话定义 + 一个例子。包括看似基础的东西：张量形状、batch、loss、梯度、线性层。宁可 Level 0 多讲一点，也不要让读者去别处查
4. **一个例子贯穿全页。** 选一个足够简单的例子（如「我 爱 猫」→「I love cats」），后面每个新概念都在它上面叠加，而不是每节换一个例子
5. **每个 Level 末尾加自测题。** 用 `<Note title="自测：到这里你应该能回答">` 列 3–5 题，只考本 Level 和之前的内容。答不上就不该往下读

需要基础知识的主题，从 `Level 0 · 基础知识` 开始。Level 数量跟着依赖链走，不固定为三个；一页 8、9 个 Level 是正常的，靠 `/drill` 的 cursor 分多次学。

## 页面结构

```
（开场白：两三句，说清这个知识点为什么值得学、这页假设读者会什么）

## 这一页怎么学       学习路线表：Level / 回答的问题 / 预计时长；说明贯穿全页的例子
## 需要掌握           覆盖全页的清单
## Level 0 · 基础知识  （需要时）后文要用的积木
## Level 1 · …        每个 ### 是一个问题；末尾自测
## Level 2 · …        …
## Level N · 工程影响   通常放最后，连到 cost / latency / 线上故障
## 陷阱               <Note type="warning"> 或 "danger"
## 连接               一张 ASCII 链 + 站内链接分组
## 面试问题            按 Level 分组，只有题
## 我的答案            留空壳
## 项目锚点            留空壳
```

Level 的名字跟着内容走（`Level 2 · Attention 的直觉`、`Level 6 · 三种架构`），但 `Level N · ` 前缀固定，`/drill` 靠它定位 `cursor`。

**大主题分批生成。** 一页超过 5 个 Level 时，先生成开头 2–3 个 Level 给用户确认讲法和难度，确认后再写剩下的。整页写完才发现方向不对，返工成本最高。

## 怎么写（这是本技能的重点）

目标读者是**有 3 年 LLM 工程经验、但没系统学过底层**的人。不是写给研究员，也不是写速记卡。

- **每个 `###` 是一个真实会被问到的问题**，标题就是问句，正文直接回答
- **必须有具体 Example。** 只说结论不给过程是上一版被打回的原因。能手推的就手推：BPE 要从 `low ×5 / lower ×2` 这样的语料一轮轮推到词表，配演化表；讲 Recall@K 就给一组具体的检索结果算一遍
- **给真实数字建立量感。** 词表大小要列 `BERT 30,522 → LLaMA 3 128,256 → o200k 200,019` 这种真实值。不确定的数字宁可不写，也不要编——写错一个数字，面试现场说出来就是事故
- **用 `<Note>` 放补充和提醒**，按下面「提示框颜色规则」选 `type`，不要一律用默认的灰色
- **串联比罗列值钱。** 主动接上下游：讲 tokenization 要连到「为什么 LLM 数不清 strawberry 里有几个 r」「为什么 prompt caching 有用」。面试官考的就是这种串联
- **给可验证的手段。** 能跑的 `tiktoken` 片段胜过一段断言

不要写：论文引用、数学推导、「众所周知」「显而易见」、把 Level 3 写成 Level 1 的复述。

## MDX 约定（踩过的坑，别再踩）

- **`<Note>` 内容前后必须空行**，否则里面的 markdown 块（列表、表格）不解析
- **正文里的 `<bos>`、`<pad>`、`<eos>` 这类尖括号必须包反引号**（或放进代码块）。MDX 会把裸露的 `<bos>` 当成 JSX 标签，整页编译失败、直接 404
- **表格单元格里不能出现 `|`，包在反引号里也不行**。GFM 会把它当成列分隔符，整行错位。像 `<|end|>` 这种 chat template 特殊 token 放进表格时，改写成文字或写成 `\|`
- **不要用 `$...$` 写公式** — 本站没挂 `remark-math`，KaTeX 收不到节点。用代码块写
- 中文加粗已由 `remark-cjk-friendly` 修好（`lib/markdown.ts`），`**词表（Vocabulary）**是` 这种写法现在正常
- 图用 `<Mermaid chart={\`...\`} />`；简单的链用 ASCII 代码块就够，不要为了用而用
- 用户自己的问题用 `<MyQuestion q="问题一句话">答案</MyQuestion>`（蓝色，默认折叠），和正文讲解区分开。`q` 是纯文本，不要放双引号和 markdown；答案前后同样要空行
- **提示框颜色规则**（实现在 `components/markdown/callout.ts`）——按内容选颜色，看颜色就知道这块在讲什么：
  - 灰 `<Note>`（默认）：补充说明、术语辨析、背景——主线之外、知道就好
  - 绿 `<Note type="tip">`：串联与面试加分——连到别的机制或经典现象，或面试时值得主动说出来的点
  - 橙 `<Note type="warning">`：陷阱——容易理解错、容易被追问
  - 红 `<Note type="danger">`：错误说法——面试里说出来就扣分
  - 蓝 `<MyQuestion>`：用户自己的问题和解答
- 可用组件见 `lib/components.ts`

## 双语

正文中英两版，靠右上角语言切换。**按小节交错**，不要整页中文再整页英文——交错才好维护。

```mdx
<Locale lang="zh">

### 什么是 Tokenization？为什么它对 LLM 至关重要？

……中文正文……

</Locale>

<Locale lang="en">

### What is tokenization and why does it matter?

……English……

</Locale>
```

- `<Locale>` 内首尾必须空行（同 `<Note>`）
- 标题必须顶格，`getTable` 的正则 `^(#{2,4})\s` 靠行首匹配
- TOC 会自动过滤掉未渲染语种的标题（`components/toc/anchor.tsx` 按 DOM 存在性过滤），不用额外处理
- **英文版不是中文版的翻译**，是面试时真的会那样说的话。中文版可以更啰嗦地解释，英文版要更接近口语表达
- **中英标题文字不能完全一样**：rehype-slug 会给后出现的那个加 `-1`，英文 TOC 就找不到锚点
- `## 面试问题`：中文块写中文题干，后面括号附英文原题，如 `1. 为什么 attention 是 O(n²)？（Why is attention O(n²)?）`；英文块只写英文题干
- `<MyQuestion>` 中英两个 Locale 块各放一个，问题和答案都要翻译
- 留给用户自己写的小节（`## 我的答案` / `## 项目锚点`）**只做标题双语**：两个 Locale 块里各放一个标题，下面的空壳（`-`、`>`、`- [ ]` 列表）放在 Locale 块外共用。中文标题保持原字不动，`/drill` 靠它定位
- 纯英文、不含中文注释的代码块 / ASCII 图放在 Locale 外共用；含中文就两边各放一份
- 收尾往 `journal` 加的那一行也按 Locale 写中英两份

## Frontmatter

```yaml
title: Tokenization
titleEn: Tokenization
description: 中文一句话
descriptionEn: One line in English
date: <今天>              # 每次改动都更新，首页热力图靠它
keywords: [...]
tier: A | B | C           # A 必答 / B 要懂 / C 知道，决定投入
status: todo              # 新生成的页一律 todo
cursor: ''                # 由 /drill 维护
mastery: { talk: 0, probe: 0 }
```

`tier` 决定详细度：A 层每个 Level 都要厚，`我的答案` 留 30s + 2min；B 层只留 30s；C 层可以只写最基础的一两个 Level + 面试问题。

## 收尾

1. 跑一次 `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001<页面路径>` 确认能渲染（端口以实际 dev server 为准）
2. 在 `contents/docs/journal/index.mdx` 今天的日期下加一行
3. 回报：写了哪页、多少字、`<MyQuestion>` 补答 / 挪动 / 合并了几条、当前 todo 积压几页
4. **不要 commit**
