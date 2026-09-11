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

把一个知识点写成「能学懂 + 能面试」的一页。**一次只做一页**，不批量生成整个专栏。

配套技能：[drill](../drill/SKILL.md) 负责考你、批改、更新进度。本技能只负责写教材。

格式基准：`contents/docs/llm/tokenization/index.mdx`。有疑问先读它，不要凭印象写。

## 核心边界：事实可以代写，表达不能代写

| 本技能生成 | 本技能**绝不**生成 |
| --- | --- |
| 需要掌握 / 三个 Level 的讲解 / 陷阱 / 连接 | `## 我的答案`（30s / 2min） |
| 面试问题（**只有题干，没有答案**） | `## 项目锚点` |
| | `mastery` 自评分 |

用户自己写不出来的东西，agent 替他写了等于没学。留空位、留提示，不要填内容。

## 目标路径

`/study <collection>/<slug>` → `contents/docs/<collection>/<slug>/index.mdx`

没给参数时，按 `status` 选：先找 `learning`（提示应该用 `/drill` 续上，而不是重新生成），再找最靠前的 `todo`。

写新页要在 `settings/documents.ts` 加导航；归属看 `.cursor/skills/publish-note/taxonomy.md`，不要把别的页该管的内容写进来。

## 生成前的两道闸

**1. 先清「我的问题」。** 目标页有 `## 我的问题` 且存在未勾选项时，**先处理它们再写别的**：

- 属于本页的 → 把答案写进对应 Level 的正文，然后把该行改成 `- [x] …… → 已并入 L2`
- 属于别页的 → 改成 `- [x] …… → 见 [Inference](/docs/llm/inference)`，并告诉用户那页要补什么，**不要顺手去改那页**

**2. 查 todo 积压。** 统计 `contents/docs/**/index.mdx` 里 `status: todo` 的页数：

```bash
grep -rl "^status: todo" contents/docs --include=index.mdx | wc -l
```

**超过 5 页就停下**，告诉用户积压了哪几页，建议先 `/drill` 消化。笔记生成得比人学得快，最后会变成「全站金光闪闪，实际学了八页」——这是这套流程唯一真正的失败模式。用户坚持要生成就照做，但要先说这句话。

## 页面结构（九段，顺序固定）

```
（开场白：两三句，说清这个知识点为什么值得学，不要写成摘要）

## 需要掌握          清单，6–8 条
## Level 1 · 基本概念   每个 ### 是一个问题
## Level 2 · <机制名>   同上，必须有手推 / 完整例子
## Level 3 · 工程影响   同上，连到 cost / latency / 线上故障
## 陷阱               <Note type="warning"> 或 "danger"
## 连接               一张 ASCII 链 + 站内链接分组
## 面试问题            L1 / L2 / L3 分组，只有题
## 我的问题            留空壳，带一行示例注释
## 我的答案            留空壳
## 项目锚点            留空壳
```

三个 Level 的命名跟着内容走（`Level 2 · 分词方法`、`Level 2 · 检索机制`），但 `Level N · ` 前缀固定，`/drill` 靠它定位 `cursor`。

## 怎么写（这是本技能的重点）

目标读者是**有 3 年 LLM 工程经验、但没系统学过底层**的人。不是写给研究员，也不是写速记卡。

- **每个 `###` 是一个真实会被问到的问题**，标题就是问句，正文直接回答
- **必须有具体 Example。** 只说结论不给过程是上一版被打回的原因。能手推的就手推：BPE 要从 `low ×5 / lower ×2` 这样的语料一轮轮推到词表，配演化表；讲 Recall@K 就给一组具体的检索结果算一遍
- **给真实数字建立量感。** 词表大小要列 `BERT 30,522 → LLaMA 3 128,256 → o200k 200,019` 这种真实值。不确定的数字宁可不写，也不要编——写错一个数字，面试现场说出来就是事故
- **用 `<Note>` 放补充**，主线之外但值得知道的（术语辨析、为什么这个区分重要、顺带解释的经典现象）
- **串联比罗列值钱。** 主动接上下游：讲 tokenization 要连到「为什么 LLM 数不清 strawberry 里有几个 r」「为什么 prompt caching 有用」。面试官考的就是这种串联
- **给可验证的手段。** 能跑的 `tiktoken` 片段胜过一段断言

不要写：论文引用、数学推导、「众所周知」「显而易见」、把 Level 3 写成 Level 1 的复述。

## MDX 约定（踩过的坑，别再踩）

- **`<Note>` 内容前后必须空行**，否则里面的 markdown 块（列表、表格）不解析
- **不要用 `$...$` 写公式** — 本站没挂 `remark-math`，KaTeX 收不到节点。用代码块写
- 中文加粗已由 `remark-cjk-friendly` 修好（`lib/markdown.ts`），`**词表（Vocabulary）**是` 这种写法现在正常
- 图用 `<Mermaid chart={\`...\`} />`；简单的链用 ASCII 代码块就够，不要为了用而用
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
- `## 面试问题` 只有英文，不做双语。`## 我的答案` 本来就写英文

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

`tier` 决定详细度：A 层三个 Level 都要厚，`我的答案` 留 30s + 2min；B 层只留 30s；C 层可以只写 Level 1 + 面试问题。

## 收尾

1. 跑一次 `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001<页面路径>` 确认能渲染（端口以实际 dev server 为准）
2. 在 `contents/docs/journal/index.mdx` 今天的日期下加一行
3. 回报：写了哪页、多少字、`我的问题` 处理了几条、当前 todo 积压几页
4. **不要 commit**
