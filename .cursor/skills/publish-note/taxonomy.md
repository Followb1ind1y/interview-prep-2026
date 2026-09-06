# Docs taxonomy

Map tags to existing pages. Prefer merge. New pages need a `settings/documents.ts` nav item.

Search these files (title, `keywords`, headings) before proposing a destination.

## Algorithms

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| array, hash, two pointers, sliding window, prefix | `contents/docs/algorithms/arrays/index.mdx` | 模式 / 骨架 / 代表题 / 复盘 |
| linked list, reverse, dummy, cycle | `contents/docs/algorithms/linked-list/index.mdx` | 模式 / 代表题 |
| tree, graph, dfs, bfs, lca, topo | `contents/docs/algorithms/trees/index.mdx` | 模式 / 代表题 |
| dp, knapsack, subsequence | `contents/docs/algorithms/dp/index.mdx` | 提问顺序 / 代表题 |
| algorithms index only | `contents/docs/algorithms/index.mdx` | 目录，不要往这里堆题解 |

Also grep parent `contents/docs/algorithms/index.mdx` keywords: algorithms, leetcode.

## Frontend

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| javascript, closure, event-loop, prototype, this, promise | `contents/docs/frontend/javascript/index.mdx` | 必能讲清 / 手写清单 |
| react, hooks, concurrent, key | `contents/docs/frontend/react/index.mdx` | 必能讲清 / 项目里要准备的故事 |
| frontend index only | `contents/docs/frontend/index.mdx` | 目录，不要堆正文 |

## Other knowledge

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| system design, 估算, 权衡 | `contents/docs/system-design/index.mdx` | 开口框架 / 想覆盖的题 / 每题一节（需求、容量、架构图、权衡） |
| os, network, database, 进程, TCP, 索引 | `contents/docs/cs-fundamentals/index.mdx` | 操作系统 / 网络 / 数据库 |
| behavioral, star, 故事 | `contents/docs/behavioral/index.mdx` | 故事卡片 STAR |
| journal, 日志 | `contents/docs/journal/index.mdx` | 只追加一行日期索引，不放详细推导 |

## Rules

- Default: merge into the best existing section. Create a new `contents/docs/.../index.mdx` only if no row fits.
- New page must also add an item in `settings/documents.ts`.
- `type: work` never maps here. Mark inbox `status: skipped`.
- Journal is always a one-liner pointer, never the full note.
