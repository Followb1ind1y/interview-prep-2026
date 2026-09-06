# Docs taxonomy

Map tags to existing pages. Prefer merge. New pages need a `settings/documents.ts` nav item.

Search these files (title, `keywords`, headings) before proposing a destination.

## Playbook & positioning

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| playbook, 准备手册, 六个模块, 知识存在哪 | `contents/docs/overview/index.mdx` | 原则 / 六模块 / 分区职责 |
| positioning, target role, intro, 30s, 60s | `contents/docs/positioning/index.mdx` | Target Job Profile / 叙事 / 开场稿 |
| project, deep dive, tariff, negotiation, voice | `contents/docs/projects/index.mdx` | Tier / 卡片必答 / 口述骨架 |
| llm, rag, agent, inference, fine-tuning, evaluation | `contents/docs/genai/index.mdx` | LLM / RAG / Agent / SD 指针 / ML-SE |

## Algorithms

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| array, hash, two pointers, sliding window, prefix | `contents/docs/algorithms/arrays/index.mdx` | 模式 / 骨架 / 代表题 / 复盘 |
| linked list, reverse, dummy, cycle | `contents/docs/algorithms/linked-list/index.mdx` | 模式 / 代表题 |
| tree, graph, dfs, bfs, lca, topo | `contents/docs/algorithms/trees/index.mdx` | 模式 / 代表题 |
| dp, knapsack, subsequence | `contents/docs/algorithms/dp/index.mdx` | 提问顺序 / 代表题 |
| sql, join, window, cte, bigquery | `contents/docs/algorithms/sql/index.mdx` | 覆盖点 / 骨架 / 代表题 |
| algorithms index only | `contents/docs/algorithms/index.mdx` | 目录，不要往这里堆题解 |

Also grep parent `contents/docs/algorithms/index.mdx` keywords: algorithms, leetcode.

## Frontend

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| javascript, closure, event-loop, prototype, this, promise | `contents/docs/frontend/javascript/index.mdx` | 必能讲清 / 手写清单 |
| react, hooks, concurrent, key | `contents/docs/frontend/react/index.mdx` | 必能讲清 / 项目里要准备的故事 |
| frontend index only | `contents/docs/frontend/index.mdx` | 目录，不要堆正文 |

Frontend is **P2** this cycle (LLM Engineer). Merge only if the session is actually frontend.

## Other knowledge

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| system design, 估算, 权衡, production rag | `contents/docs/system-design/index.mdx` | 开口框架 / 想覆盖的题 / 每题一节 |
| os, network, database, python, asyncio, docker | `contents/docs/cs-fundamentals/index.mdx` | 操作系统 / 网络 / 数据库 / 工程追问 |
| behavioral, star, mock, tell me about yourself | `contents/docs/behavioral/index.mdx` | 故事卡片 STAR / 技术表达 / Mock |
| journal, 日志 | `contents/docs/journal/index.mdx` | 只追加一行日期索引，不放详细推导 |

## Not Docs

| Content | Destination |
| --- | --- |
| CV bullets, PDF, About 对外稿 | `contents/resume/` + `lib/resume-data.ts` |
| 投递状态、轮次、该公司特有追问 | `contents/companies/` |
| 薪资数字、谈薪 | Companies 或本地 notes，不上公开 Docs |

## Rules

- Default: merge into the best existing section. Create a new `contents/docs/.../index.mdx` only if no row fits.
- New page must also add an item in `settings/documents.ts`.
- `type: work` never maps here. Mark inbox `status: skipped`.
- Journal is always a one-liner pointer, never the full note.
