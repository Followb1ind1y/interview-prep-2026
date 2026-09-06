# Docs taxonomy

Map tags to existing pages. Prefer merge. New pages need a `settings/documents.ts` nav item.

Search these files (title, `keywords`, headings) before proposing a destination.

Hub pages (`index.mdx` of a column) are **plan + cards only**. Write answers on the child page.

## Playbook

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| playbook, 准备手册, 六个模块 | `contents/docs/overview/index.mdx` | 原则 / 六模块 / 侧边栏约定 |
| positioning, target role, intro, 30s, 60s | `contents/docs/positioning/index.mdx` | Target Job Profile / 叙事 / 开场稿 |

## Knowledge

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| transformer | `contents/docs/llm/transformer/index.mdx` | 必能讲清 / 权衡 / 项目锚点 / 我的答案 |
| attention, qkv | `contents/docs/llm/attention/index.mdx` | 同上 |
| sft, rlhf, dpo, training | `contents/docs/llm/training/index.mdx` | 同上 |
| lora, qlora, peft, fine-tuning | `contents/docs/llm/fine-tuning/index.mdx` | 同上 |
| kv cache, vllm, inference | `contents/docs/llm/inference/index.mdx` | 同上 |
| llm index only | `contents/docs/llm/index.mdx` | 目录，不要堆正文 |
| embedding | `contents/docs/rag/embedding/index.mdx` | 必能讲清 / 权衡 / 项目锚点 / 我的答案 |
| retrieval, bm25 | `contents/docs/rag/retrieval/index.mdx` | 同上 |
| rerank | `contents/docs/rag/reranking/index.mdx` | 同上 |
| hybrid, rrf, faiss | `contents/docs/rag/hybrid-search/index.mdx` | 同上 |
| rag evaluation, deepeval | `contents/docs/rag/evaluation/index.mdx` | 同上 |
| rag index only | `contents/docs/rag/index.mdx` | 目录，不要堆正文 |
| tool calling | `contents/docs/agent/tool-calling/index.mdx` | 必能讲清 / 权衡 / 项目锚点 / 我的答案 |
| planning, react | `contents/docs/agent/planning/index.mdx` | 同上 |
| memory | `contents/docs/agent/memory/index.mdx` | 同上 |
| multi-agent, langgraph | `contents/docs/agent/multi-agent/index.mdx` | 同上 |
| agent reliability, guardrails | `contents/docs/agent/reliability/index.mdx` | 同上 |
| agent index only | `contents/docs/agent/index.mdx` | 目录，不要堆正文 |
| system design architecture | `contents/docs/system-design/architecture/index.mdx` | 维度要点 / 练过的题 |
| scalability | `contents/docs/system-design/scalability/index.mdx` | 同上 |
| latency | `contents/docs/system-design/latency/index.mdx` | 同上 |
| cost, tokens | `contents/docs/system-design/cost/index.mdx` | 同上 |
| system design reliability | `contents/docs/system-design/reliability/index.mdx` | 同上 |
| observability | `contents/docs/system-design/observability/index.mdx` | 同上 |
| system design index only | `contents/docs/system-design/index.mdx` | 开口框架 / 计划，不要堆题解 |
| python, oop | `contents/docs/engineering/python/index.mdx` | 必能讲清 / 我的答案 |
| asyncio, concurrency | `contents/docs/engineering/concurrency/index.mdx` | 同上 |
| rest, fastapi | `contents/docs/engineering/rest/index.mdx` | 同上 |
| sql, join, window, cte, bigquery | `contents/docs/engineering/sql/index.mdx` | 覆盖点 / 骨架 / 代表题 |
| docker, gcp, cloud | `contents/docs/engineering/cloud/index.mdx` | 必能讲清 / 我的答案 |
| distributed | `contents/docs/engineering/distributed/index.mdx` | 同上 |
| testing, git | `contents/docs/engineering/testing/index.mdx` | 同上 |
| engineering index only | `contents/docs/engineering/index.mdx` | 目录，不要堆正文 |
| array, hash, two pointers, sliding window, prefix | `contents/docs/algorithms/arrays/index.mdx` | 模式 / 骨架 / 代表题 / 复盘 |
| linked list, reverse, dummy, cycle | `contents/docs/algorithms/linked-list/index.mdx` | 模式 / 代表题 |
| tree, graph, dfs, bfs, lca, topo | `contents/docs/algorithms/trees/index.mdx` | 模式 / 代表题 |
| dp, knapsack, subsequence | `contents/docs/algorithms/dp/index.mdx` | 提问顺序 / 代表题 |
| algorithms index only | `contents/docs/algorithms/index.mdx` | 目录，不要往这里堆题解 |

## Interview performance

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| negotiation, websocket | `contents/docs/projects/negotiation/index.mdx` | What / Architecture / Trade-offs / Results |
| tariff, multi-agent project | `contents/docs/projects/tariff/index.mdx` | 同上 |
| voice, whisper | `contents/docs/projects/voice/index.mdx` | 同上 |
| pmi | `contents/docs/projects/pmi/index.mdx` | 同上 |
| llama fine-tuning project | `contents/docs/projects/fine-tuning/index.mdx` | 同上 |
| projects index only | `contents/docs/projects/index.mdx` | Tier + 卡片，不要堆全文 |
| star | `contents/docs/behavioral/star/index.mdx` | 故事清单 STAR |
| communication, 分层 | `contents/docs/behavioral/communication/index.mdx` | 两层讲解 |
| mock | `contents/docs/behavioral/mock/index.mdx` | 记录表 |
| behavioral index only | `contents/docs/behavioral/index.mdx` | 计划 + 必练题 |
| journal, 日志 | `contents/docs/journal/index.mdx` | 只追加一行日期索引 |

## Not Docs

| Content | Destination |
| --- | --- |
| CV bullets, PDF, About 对外稿 | `contents/resume/` + `lib/resume-data.ts` |
| 投递状态、轮次、该公司特有追问 | `contents/companies/` |
| 薪资数字、谈薪 | Companies 或本地 notes，不上公开 Docs |
| 前端 | 不收录。React 决策写进 Negotiation 项目页 |

## Rules

- Default: merge into the best **child** page. Hub indexes stay plan-only.
- New page must also add an item in `settings/documents.ts`.
- `type: work` never maps here. Mark inbox `status: skipped`.
- Journal is always a one-liner pointer, never the full note.
