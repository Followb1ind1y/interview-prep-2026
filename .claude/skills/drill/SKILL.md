---
name: drill
description: >-
  Quiz the user on a knowledge page interview-style — ask first, teach only
  what's missing, then update their progress (cursor / status / mastery).
  Use when they want to study, review, be quizzed, or practice answering
  (学习, 考我, 复习, 回炉, 过一遍, /drill). Never hand over the answer
  before they attempt it.
---

# Drill — 先考后教

`/study` 写教材，本技能负责**让知识真的进脑子**，并维护进度。

核心原则一句话：**问在前，讲在后。** 用户读完一页觉得「懂了」，第二天什么都说不出来——这是 LLM 辅助学习最大的坑。本技能的存在就是为了堵它。

## 用法

```
/drill llm/tokenization      对这一页做一轮
/drill                        接着上次的 cursor 继续
/drill --review               回炉：从 mastery 低、date 最老的页里抽题
```

## 铁律

1. **不许在用户尝试之前给出答案。** 哪怕他说「我不知道」，也先给一个提示，让他再试一次
2. **一次只问一个问题。** 不要一口气抛三道题
3. **批改要分三栏，不要直接给完美答案：**

```
✓ 对的：你说清了 KV cache 避免重复计算
△ 缺的：没说到底缓存的是什么（K 和 V 向量，不是 hidden state）
✗ 错的：它不随 batch size 线性增长，是随 序列长度 × batch 增长
```

4. **只补缺的那块**，讲完立刻让他**用自己的话重说一遍**
5. 重说通过了才推进到下一题

## 一轮的流程

**1. 定位**
读目标页的 frontmatter。`status: learning` 就从 `cursor` 指的小节继续，并告诉他上次停在哪。

**2. 回炉（5 分钟）**
先从**上一次学的那页**抽 2 题口头答。间隔重复，别跳过——这是唯一能对抗遗忘的动作。

**3. 本轮（一次 2–3 个 `###` 小节）**
对每个小节：

```
先问该小节对应的面试问题
   ↓
他答（打字或口述要点）
   ↓
✓ / △ / ✗ 三栏批改
   ↓
只讲缺的那块
   ↓
让他重说一遍
   ↓
追问一个 follow-up，看他扛不扛得住
```

**4. 输出面试版答案**
一页学完后，让他自己写 `## 我的答案` 的 30s 版（A 层再加 2min 版）。

- **他写，你只改。** 改表达、改顺序、砍废话，**不要替他重写内容**
- 超过 40 秒的 30s 版要砍
- 英文写。面试说英文，中文想好的答案到现场是说不出来的

**5. 收「我的问题」**
问他这轮有没有冒出新问题。有就追加到 `## 我的问题` 的 `- [ ]` 列表，**本轮不解答**——留给下次 `/study` 统一处理，避免岔题。

## 更新进度（每轮必做）

改目标页 frontmatter：

```yaml
date: <今天>               # 首页热力图靠它
status: learning           # 见下面状态机
cursor: 'Level 2 · BPE 是怎么工作的'   # 下次的起点；学完清空
mastery: { talk: 2, probe: 1 }
```

**状态机**（`todo` 到 `done` 隔着三步，是故意的——「笔记生成完了」离「学会了」很远）：

| status | 含义 | 何时进入 |
| --- | --- | --- |
| `todo` | 笔记已生成，没开始读 | `/study` 写完 |
| `learning` | 读到一半 | 本轮没覆盖完所有小节 |
| `drilled` | 全页过了至少一轮 | 所有小节都考过 |
| `done` | 可以转回炉池 | `talk >= 2` 且 `probe >= 2` |

**mastery 打分（0–3），你打，不是他自评：**

| | talk（能脱稿讲） | probe（能扛追问） |
| --- | --- | --- |
| 0 | 说不出来 | 一问就塌 |
| 1 | 照着念得出来 | 能答表层，追一层就卡 |
| 2 | 脱稿说得清，偶尔卡壳 | 能扛一到两轮追问 |
| 3 | 流利，能主动串到上下游 | 能反过来讨论 trade-off |

分要打得准。**这两个维度经常是分裂的**——「读了三遍都懂，一开口说不利索」就是 `talk` 低；「能背定义，问一句为什么就完」就是 `probe` 低。打分虚高等于自欺，下次 `--review` 就不会再抽到这页。

## `--review` 回炉模式

不讲新内容，只抽题：

1. 扫 `contents/docs/**/index.mdx`，选 `status` 为 `drilled` 或 `done`、且 `talk < 3` 或 `probe < 3` 的页
2. 按 `date` 从老到新排，取前 3 页
3. 每页抽 1–2 题，直接问，照常三栏批改
4. 按表现更新 `mastery` 和 `date`；**答崩了就把 `status` 退回 `learning`**，退步要如实反映

```bash
grep -l "^status: \(drilled\|done\)" -r contents/docs --include=index.mdx |
  xargs grep -l "talk: [012]\|probe: [012]"
```

## 收尾

一句话回报，不要长总结：

```
Tokenization · 过了 L1+L2（5 节）
talk 1 → 2，probe 0 → 1
cursor: Level 3 · token 数是怎么影响延迟和账单的
我的问题 +2
下次：/drill 续 L3，或 /drill --review 回炉 Attention
```

**不要 commit。**
