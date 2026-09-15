# Docs taxonomy

Map tags to existing pages. Prefer merge. New pages need a `settings/documents.ts` nav item.

Search these files (title, `keywords`, headings) before proposing a destination.

Hub pages (`index.mdx` of a column) are **plan + cards only**. Write answers on the child page.

Knowledge child pages use: 需要掌握 / 机制 / 三级回答 / 面试问题 / 我的答案 / 项目锚点.

System Design child pages use the 14 dimensions, not Architecture/Latency/Cost folders.

## Playbook

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
| playbook, 准备手册, 九大模块, phase | `contents/docs/overview/index.mdx` | 原则 / 6 模块 / 9 专栏 / 学习顺序 / Phase |
| positioning, target role, intro, 30s, 60s, production llm | `contents/docs/positioning/index.mdx` | Target Job Profile / 叙事 / 开场稿 |

## 01 LLM Fundamentals

| Tags / keywords | Path |
| --- | --- |
| tokenization, bpe, sentencepiece | `contents/docs/llm/tokenization/index.mdx` |
| transformer, attention, encoder, decoder, decoder-only, self-attention, qkv, mha, mqa, gqa, ffn, positional encoding, rope, layernorm | `contents/docs/llm/transformer/index.mdx` |
| pretraining, next-token, scaling laws | `contents/docs/llm/training/index.mdx` |
| sft, rlhf, dpo, alignment, post-training | `contents/docs/llm/post-training/index.mdx` |
| lora, qlora, peft, adapters, rag vs fine-tuning | `contents/docs/llm/fine-tuning/index.mdx` |
| kv cache, prefill, decode, quantization, flashattention, vllm, inference | `contents/docs/llm/inference/index.mdx` |
| llm index only | `contents/docs/llm/index.mdx` |

## 02 LLM Application

| Tags / keywords | Path |
| --- | --- |
| prompt engineering, few-shot, instruction hierarchy | `contents/docs/application/prompt-engineering/index.mdx` |
| structured output, json schema, pydantic, json mode | `contents/docs/application/structured-output/index.mdx` |
| model selection, gpt, claude, gemini | `contents/docs/application/model-selection/index.mdx` |
| model routing, cascade, fallback | `contents/docs/application/model-routing/index.mdx` |
| application index only | `contents/docs/application/index.mdx` |

## 03 RAG / Retrieval

| Tags / keywords | Path |
| --- | --- |
| rag architecture, pipeline | `contents/docs/rag/architecture/index.mdx` |
| ingestion, ocr, pdf, metadata | `contents/docs/rag/ingestion/index.mdx` |
| chunking, overlap, parent-child | `contents/docs/rag/chunking/index.mdx` |
| embedding, cosine, dense embedding | `contents/docs/rag/embedding/index.mdx` |
| ann, hnsw, ivf, pq, vector db, vector search | `contents/docs/rag/vector-search/index.mdx` |
| bm25, inverted index, sparse retrieval | `contents/docs/rag/sparse-retrieval/index.mdx` |
| hybrid search, rrf, faiss | `contents/docs/rag/hybrid-search/index.mdx` |
| rerank, cross encoder | `contents/docs/rag/reranking/index.mdx` |
| hyde, query rewriting, graphrag, agentic rag | `contents/docs/rag/advanced/index.mdx` |
| rag debugging, failure diagnosis | `contents/docs/rag/debugging/index.mdx` |
| rag index only | `contents/docs/rag/index.mdx` |

RAG metrics (Recall@K, faithfulness) go to Evaluation / RAG Eval, not this column.

## 04 Context Engineering

| Tags / keywords | Path |
| --- | --- |
| model context, system prompt, tool results | `contents/docs/context/model-context/index.mdx` |
| context window, lost-in-the-middle, long context | `contents/docs/context/window/index.mdx` |
| context construction, context selection | `contents/docs/context/construction/index.mdx` |
| context compression, rolling summary | `contents/docs/context/compression/index.mdx` |
| prompt caching, kv cache vs prompt cache, semantic caching | `contents/docs/context/caching/index.mdx` |
| context isolation, security boundary | `contents/docs/context/isolation/index.mdx` |
| context index only | `contents/docs/context/index.mdx` |

## 05 Agent Engineering

| Tags / keywords | Path |
| --- | --- |
| agent loop, observe, reason, act | `contents/docs/agent/loop/index.mdx` |
| tool calling, function calling, idempotency | `contents/docs/agent/tool-calling/index.mdx` |
| react, thought, observation | `contents/docs/agent/react/index.mdx` |
| workflow vs agent, deterministic | `contents/docs/agent/workflow-vs-agent/index.mdx` |
| planning, replanning, reflection, verification | `contents/docs/agent/planning/index.mdx` |
| memory, episodic, semantic memory, procedural | `contents/docs/agent/memory/index.mdx` |
| multi-agent, supervisor, router, langgraph | `contents/docs/agent/multi-agent/index.mdx` |
| agent reliability, circuit breaker, hitl | `contents/docs/agent/reliability/index.mdx` |
| prompt injection, excessive agency, agent security | `contents/docs/agent/security/index.mdx` |
| agent index only | `contents/docs/agent/index.mdx` |

## 06 Evaluation

| Tags / keywords | Path |
| --- | --- |
| evaluation fundamentals, metric | `contents/docs/evaluation/fundamentals/index.mdx` |
| offline eval, golden dataset, regression testing | `contents/docs/evaluation/offline/index.mdx` |
| llm-as-judge, pairwise, rubric | `contents/docs/evaluation/llm-eval/index.mdx` |
| recall@k, ndcg, faithfulness, groundedness, rag eval, deepeval | `contents/docs/evaluation/rag-eval/index.mdx` |
| agent eval, trajectory evaluation | `contents/docs/evaluation/agent-eval/index.mdx` |
| production eval, eval-driven | `contents/docs/evaluation/production-eval/index.mdx` |
| evaluation index only | `contents/docs/evaluation/index.mdx` |

## 07 Production AI

| Tags / keywords | Path |
| --- | --- |
| streaming, retries, rate limit, api engineering | `contents/docs/production/api-engineering/index.mdx` |
| latency, ttft, tpot, cold start | `contents/docs/production/latency/index.mdx` |
| cost, tokens, unit economics | `contents/docs/production/cost/index.mdx` |
| scaling, queue, batching, load balancing | `contents/docs/production/scaling/index.mdx` |
| observability, tracing, prompt version | `contents/docs/production/observability/index.mdx` |
| production reliability, fallback, graceful degradation | `contents/docs/production/reliability/index.mdx` |
| production index only | `contents/docs/production/index.mdx` |

## 08 AI System Design

| Tags / keywords | Path |
| --- | --- |
| rag chatbot | `contents/docs/system-design/rag-chatbot/index.mdx` |
| knowledge assistant, enterprise rag | `contents/docs/system-design/knowledge-assistant/index.mdx` |
| document qa | `contents/docs/system-design/document-qa/index.mdx` |
| customer support | `contents/docs/system-design/customer-support/index.mdx` |
| ai search | `contents/docs/system-design/ai-search/index.mdx` |
| meeting summarization, asr | `contents/docs/system-design/meeting-summarization/index.mdx` |
| document extraction | `contents/docs/system-design/document-extraction/index.mdx` |
| design an ai agent | `contents/docs/system-design/ai-agent/index.mdx` |
| design coding agent | `contents/docs/system-design/coding-agent/index.mdx` |
| design multi-agent system | `contents/docs/system-design/multi-agent/index.mdx` |
| long-running agent | `contents/docs/system-design/long-running-agent/index.mdx` |
| chatgpt-like | `contents/docs/system-design/chatgpt/index.mdx` |
| agent platform | `contents/docs/system-design/agent-platform/index.mdx` |
| inference platform, llm serving | `contents/docs/system-design/inference-platform/index.mdx` |
| large-scale rag platform | `contents/docs/system-design/rag-platform/index.mdx` |
| system design index only | `contents/docs/system-design/index.mdx` |

Do not put system-design answers under Production dimension pages. Dimensions are a template on each problem page.

## 09 AI-Native Engineering

| Tags / keywords | Path |
| --- | --- |
| mcp, model context protocol, json-rpc | `contents/docs/ai-native/mcp/index.mdx` |
| agent harness, harness engineering | `contents/docs/ai-native/harness/index.mdx` |
| claude code, codex | `contents/docs/ai-native/coding-workflow/index.mdx` |
| agentic coding, feedback loop | `contents/docs/ai-native/agentic-coding/index.mdx` |
| context compaction, context anxiety | `contents/docs/ai-native/compaction/index.mdx` |
| agent state, checkpoint | `contents/docs/ai-native/agent-state/index.mdx` |
| sandbox, permissions, blast radius | `contents/docs/ai-native/sandbox/index.mdx` |
| ai-native index only | `contents/docs/ai-native/index.mdx` |

## Engineering / Algorithms

| Tags / keywords | Path | Page structure |
| --- | --- | --- |
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
