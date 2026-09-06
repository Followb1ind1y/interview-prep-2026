# LLM / AI Engineer — 8 周求职计划与方针

> 状态：本地梳理稿（不上网站）。思路捋清后再手动同步到 Docs。  
> 更新日期：2026-09-06

---

## 核心原则

目标不是「重新学一遍 AI」，而是把已有 **3+ 年 AI/LLM 工程经验** 包装成能通过市场筛选、技术面试和 System Design 的候选人。

每周约 **10–12 小时**（下班 + 周末）。

核心优先级：

**Resume / LinkedIn → LLM fundamentals → Coding → LLM System Design → Project storytelling → Mock → 投递迭代**

### 最大优势 / 最大风险

- **优势：** 生产级 Agentic AI + RAG + Tool Calling + FastAPI + Cloud + Evaluation + Inference
- **风险：** 简历写得很漂亮，但面试官追问底层细节时讲不深
- **主线：** 「面试化」，不是「再做一个 demo」

你不是：“我做过一些 ChatGPT 项目。”  
而是：

> I build production-grade LLM systems end-to-end — from model/inference optimization to agent orchestration, retrieval, tools, backend infrastructure, evaluation, and deployment.

---

## 0. 求职定位

### Primary（主投）

- LLM Engineer
- AI Engineer / Generative AI Engineer
- Applied AI Engineer
- AI/ML Engineer — GenAI
- Software Engineer, AI
- Machine Learning Engineer — LLM/GenAI

### Secondary（JD 匹配再投）

- Applied Scientist
- ML Engineer
- Research Engineer
- AI Platform Engineer

### 不做的定位

不要包装成泛化的 Data Scientist / 传统 ML Engineer。

暂时**不要**大量投入：

- 传统 ML theory
- LeetCode Hard
- 数学证明
- Kaggle
- 从零训大模型
- 再做一个普通 RAG / chatbot demo

### 职业叙事（面试开场用）

```
ML / Deep Learning
       ↓
LLM Fine-tuning + Inference
       ↓
RAG + Agents
       ↓
Production LLM Applications
       ↓
Enterprise Agentic AI
       ↓
Evaluation + Reliability + Optimization
```

---

## 1. 能力判断与时间分配

### 强弱分布

| 状态 | 内容 |
| --- | --- |
| 已很强 | Python、LLM app、RAG、Agent、Tool calling、FastAPI、Gemini、LangGraph、Enterprise AI、BigQuery、React/Streamlit、Eval、生产应用 |
| 需面试级强化 | Transformer 口述、Inference（KV cache / vLLM）、分布式训练细节、LLM System Design、AsyncIO、分布式系统常识、SQL、Coding 手感 |
| 少投入 | 传统 ML 理论、数学证明、Kaggle、训大模型、Hard 刷题、新 demo |

### 每周 10h 建议配比

| 领域 | 时间 | 占比 |
| --- | --- | --- |
| LLM / RAG / Agent | 3h | 30% |
| System Design | 2h | 20% |
| Coding / Python | 2h | 20% |
| Project Deep Dive | 1.5h | 15% |
| Behavioral | 0.5h | 5% |
| Applications / Resume | 1h | 10% |

**LLM + System Design ≈ 50%。** 不要变成 50% LeetCode。

### 周内节奏（防崩）

| 时段 | 时长 | 做什么 |
| --- | --- | --- |
| 周一～周四 | 60–75 min/天 | 30–40 min 技术口述 + 20–30 min coding / SD |
| 周五 | 0–30 min | 休息或轻量 review |
| 周六 | 3–4h | 1h 技术 + 1h coding + 1h SD + 30–60m 项目/面试 |
| 周日 | 3–4h | Mock、项目故事、简历/投递、周复盘 |

学习方式固定为 **输入 → 输出**：学完一个概念马上关掉资料，用 1–2 分钟自己讲清楚；讲不出再回去补。

不要：看 2 小时 YouTube。  
要：学完 KV Cache → 立刻自答 *What is KV cache and why does it improve LLM inference?*

---

## 2. 八周总览

| 周 | 核心目标 | 最终产出 | 投递 |
| --- | --- | --- | --- |
| W1 | Resume + Interview baseline | 终版 Resume + 5 项目故事骨架 | 可开始熟悉市场 |
| W2 | LLM Fundamentals | LLM / 微调 / 推理口述体系 | 每周 3–5 岗（试水） |
| W3 | RAG + Agent | RAG/Agent 深挖 + 失败模式 | 每周 5–10 高匹配 |
| W4 | LLM System Design | 5–6 道 SD 白板稿 | 同上，观察 JD 反馈 |
| W5 | ML/LLM Coding | 15–20 道核心题 + AsyncIO | 每周 8–15 高质量 |
| W6 | Project Deep Dive | 5 项目完整回答 + 10 STAR | 持续 |
| W7 | Mock Interview | 3–5 次模拟 + 复盘清单 | 持续 |
| W8 | Applications 冲刺 | 高质量投递节奏稳定 | 正式主攻 |

**Week 3 起就可以认真投**，不必等全部准备完。

### 完成标准（什么叫准备好了）

- 任意 P0 项目能讲 **5 min 架构 + 10 min 深挖**，无稿
- RAG / Agent / Eval 各能答 **5 个追问**
- LLM System Design 能按框架白板 **≥4 道标准题**
- Coding：20–30 道高频 Medium，能边写边讲
- STAR：**10 个故事**，各有 2 分钟版 + 45 秒版
- 开场 60–90 秒自我介绍流畅，且能接到任意项目追问

---

## 3. Week 1 — Resume + 项目武器化

**本周不做：** 狂刷 LeetCode。  
**本周必做：** 把经历变成面试可讲的故事。

### Day 建议（可按周末压缩）

1. Resume / Job Targeting — 针对 LLM/AI Engineer 改一版
2. 五个项目整理成面试答案骨架
3. LinkedIn + GitHub 与简历叙事对齐
4. 写出 60–90 秒英文自我介绍（见文末模板）
5. 目标公司清单初稿

### 五张王牌项目

#### P0 — Tariff Agent（Multi-agent flagship）

口述链路：

```
User → Supervisor → Tariff Expert / Impact Expert
         → Research / Tavily / LangGraph
         → BigQuery → Answer
```

必能答：

- 为什么 multi-agent，而不是 single agent？
- ADK vs LangGraph 各自用在哪？
- Agent 如何选 tool？如何保证 tool calling 可靠？
- Web search 与 BigQuery 如何组合？
- Evaluation 怎么做？Hallucination 怎么处理？
- Production 最大 failure mode 是什么？

#### P0 — Negotiation Practice（System Design flagship）

生产级全栈 AI 应用：React + FastAPI + Gemini + WebSocket + MongoDB + JWT + streaming + voice/avatar + eval + latency。

面试题直接对标：*Design a real-time AI negotiation platform.*

这是 personal flagship，应练到可白板讲 30–45 分钟。

#### P1 — PMI Logistics（NL → Analytics）

```
Question → Intent/filters → Agent → Tools → BigQuery
        → Pandas → Analysis → Excel / Chart
```

必能答：*How do you prevent an LLM from generating incorrect SQL?*

#### P1 — Voice AI（Latency story）

```
Audio → Chunking → Whisper → LLM → Streaming → TTS
```

量化锚点：**1.2s end-to-end**

准备解释：asynchronous processing、pipelining、batching、streaming、token generation、network latency、model latency。

#### P1 — LLaMA Fine-tuning（证明不只会调 API）

```
LLaMA-3-8B → QLoRA → 4-bit → DeepSpeed ZeRO-3
          → Multi-GPU → vLLM → PagedAttention
```

区分于纯「LangChain developer」。

#### P2 储备

- Sustainability Agent（LangGraph + hybrid search + Excel）
- Negotiation Expert（RAG + sandbox + FastAPI/Next）

### 每个项目统一卡片模板

1. 一句话产品价值（非技术）
2. 架构图口述（30 秒）
3. 你的个人贡献（不是「我们」）
4. 3 个技术决策 + 权衡
5. 1 个踩坑 / 失败 + 修复
6. 量化结果（或 proxy）
7. 可追问点清单

四张长期王牌：**Negotiation Practice + Tariff Agent + Voice AI + LLaMA Fine-tuning**。不再花大量时间做新项目。

---

## 4. Week 2 — LLM Fundamentals

标准：面试官随机点一个概念，你能 **1–2 分钟讲清**。不重学全部数学。

### Transformer（必熟）

- Self-attention
- Multi-head attention
- Q/K/V
- Positional encoding
- Causal attention
- Encoder vs decoder
- Transformer architecture

### LLM 训练与采样

- Pretraining
- SFT / instruction tuning
- RLHF / DPO
- Reasoning training（概念级）
- Inference
- Temperature / top-k / top-p
- Context window
- Tokenization

### Fine-tuning（简历写了就必须深）

- LoRA / QLoRA / PEFT
- Quantization（4/8-bit、NF4）
- DeepSpeed / ZeRO
- Gradient checkpointing
- Mixed precision

### Inference

- KV cache
- Batching / continuous batching
- Speculative decoding
- Quantization
- Tensor parallelism
- vLLM / PagedAttention

### 笔记结构（每条 topic）

```
Concept
  → Why it matters
  → How it works
  → Trade-offs
  → My project example
  → Interview questions
  → My answer
```

---

## 5. Week 3 — RAG + Agent

这是第一核心领域。W3 起提高投递量。

### RAG 必须能画全图

```
Documents → Parsing → Chunking → Embedding → Vector DB
         → Retriever → Reranker → Context → LLM → Answer
```

每个环节知道 trade-off。例如 chunk size：

- document structure
- semantic boundaries
- retrieval granularity
- context window
- overlap
- downstream task

### Retrieval 必会

- BM25
- Dense retrieval
- Hybrid retrieval
- Reranking
- Metadata filtering
- Query rewriting
- Multi-query retrieval
- Reciprocal Rank Fusion（RRF）

项目锚点：**FAISS + BM25 + RRF**

### Agent（最该深挖）

| 主题 | 要点 |
| --- | --- |
| Agent vs Workflow | Workflow = 预定义路径；Agent = 动态决策 |
| Multi-agent 为何 | 不同任务需要不同 tools / instructions / reasoning；代价是延迟、协调复杂度、更多失败模式 |
| Failure modes | 幻觉 tool call、错选 tool、错误参数、死循环、context pollution、过期信息、tool/部分失败、输出不一致 |
| Reliability | Structured output、schema、validation、guardrails、retry、timeout、fallback、observability、evaluation |

结合 DeepEval：correctness / completeness / relevance + 线上回归。

Multi-agent 一句话可用：

> Multi-agent architectures are useful when different tasks require different tools, instructions, or reasoning strategies, but they introduce additional latency, coordination complexity, and failure modes.

---

## 6. Week 4 — LLM System Design

从「不错的 LLM developer」升级到「AI Engineer」的关键周。至少练 6 题：

1. **Production RAG** — scale / latency / cost / freshness / evaluation
2. **ChatGPT-like app** — gateway、auth、会话状态、streaming、model service、限流、缓存、DB、可观测
3. **Enterprise business Q&A Agent** — 对标 Unilever 工作
4. **Real-time Voice AI** — WebSocket + STT + LLM + streaming TTS；如何压到 1–2s
5. **LLM Evaluation Platform** — dataset → response → judge → metrics → dashboard；offline vs online
6. **Negotiation Practice** — 个人 flagship，练到可白板 **30–45 分钟**

### 开口框架

澄清 → 估算（含 **token/成本**）→ 草图 → 深挖 1–2 难点 → 评测与失败模式

每题留下：需求、容量/成本、架构、权衡、评测。

---

## 7. Week 5 — Coding（要，但不是主线）

目标：**20–30 道高频题**，不是 300 道。语言：**Python**。

### 题型

Hash Map、Array、String、Stack/Queue、Binary Search、Sliding Window、Two Pointers、Heap、BFS/DFS、Tree、Graph basics。

### Python 手感

`dict` / `set` / `list` / `heapq` / `collections`（deque、defaultdict、Counter）

以及：generators、decorators、async/await、multiprocessing vs threading、GIL、context manager、异常。

### AsyncIO（重点）

结合 Voice AI / Negotiation Practice 回答：

- concurrency vs parallelism
- async/await 怎么工作
- 何时 asyncio vs multiprocessing
- 为什么 async 对 LLM 应用有用（I/O、streaming、多工具并发）

---

## 8. Week 6 — 项目深挖 + 10 个 STAR

| # | 主题 | 锚点项目 |
| --- | --- | --- |
| 1 | Latency optimization | Voice AI 1.2s |
| 2 | Architecture decision | Tariff：single → multi-agent |
| 3 | Production reliability | Negotiation Practice streaming / WS / failure |
| 4 | Evaluation | DeepEval 指标与回归 |
| 5 | Technical challenge | RAG retrieval quality |
| 6 | Scaling | Fine-tuning multi-GPU + DeepSpeed |
| 7 | Model optimization | vLLM + PagedAttention |
| 8 | Cross-functional | Unilever procurement 业务方 |
| 9 | Failure | 真实失败 + 诊断（必须有，不能全是成功故事） |
| 10 | Most proud of | Negotiation Practice 或 Enterprise Agentic AI |

每条 STAR：2 分钟版 + 45 秒版。

面试官喜欢：*It didn’t work initially. Here’s how I diagnosed it.*

---

## 9. Week 7 — Mock Interview

目标：3–5 次模拟，覆盖：

1. 自我介绍 + 项目深挖
2. RAG / Agent 概念追问
3. LLM System Design 白板
4. Coding（中等 Python）
5. Behavioral（含 Failure 故事）

每次 Mock 后记：暴露缺口 → 回填知识笔记 → 下周只打缺口。

---

## 10. Week 8 — 高质量投递

- 不求 100 封/周；走 **high-match**
- 简历可备两版侧重：Agentic/RAG 偏重 vs Full-stack AI app 偏重
- 观察反馈：哪些岗要 LeetCode、哪些要 SD、哪些偏 RAG、哪些偏 model/inference

### 投递节奏

| 阶段 | Applications |
| --- | --- |
| W1–2 | 每周 3–5（熟悉市场） |
| W3–4 | 每周 5–10 高匹配 |
| W5+ | 每周 8–15 高质量 |

---

## 11. 知识库结构（以后再上网站）

先在本地按主题记笔记即可。以后同步到 Followblindly Docs 时，建议树：

```
contents/docs/
├── prep-plan/              ← 本计划上站时可放这里
├── genai/
│   ├── llm-fundamentals/
│   ├── rag/
│   ├── agents/
│   ├── evaluation/
│   ├── fine-tuning/
│   ├── llm-system-design/
│   └── production/
├── algorithms/
├── system-design/
├── behavioral/             ← 项目 STAR
├── cs-fundamentals/        ← 轻量
└── journal/
```

可选本地/Obsidian 对照结构：

```
Interview/
├── 00-Job Search
├── 01-LLM Fundamentals
├── 02-RAG
├── 03-Agent
├── 04-System Design
├── 05-Coding
├── 06-Projects
└── 07-Behavioral
```

原则：**不要变成知识收藏夹。** 每条必须能走到 “My answer”。

---

## 12. 60–90 秒自我介绍（目标稿）

> I currently work as an LLM Engineer at Unilever, where I build production-grade agentic AI systems for enterprise use cases. My work spans the full LLM application stack — agent orchestration, RAG, tool calling, enterprise data integration, evaluation, and deployment. For example, I've built multi-agent systems using Gemini, Google ADK and LangGraph, where agents combine web research with BigQuery analytics. Before that, I worked on RAG systems, real-time voice AI, and deep learning systems. I also have hands-on experience with LLM fine-tuning using QLoRA and DeepSpeed, and inference optimization with vLLM. My focus is the intersection of LLM systems and production AI engineering.

背熟后，任意追问都应能接到 **Tariff / Negotiation Practice / Voice / Fine-tune** 之一。

---

## 13. 进度勾选（每周日更新）

### Week 1

- [ ] Resume 终版（LLM/AI Engineer 向）
- [ ] LinkedIn / GitHub 对齐
- [ ] 5 项目卡片骨架
- [ ] 60–90s 自我介绍能脱稿
- [ ] 目标公司清单初稿

### Week 2

- [ ] Transformer / Attention 口述
- [ ] 训练链路（SFT/RLHF/DPO）口述
- [ ] Fine-tuning（LoRA/QLoRA/ZeRO）口述
- [ ] Inference（KV cache/vLLM）口述

### Week 3

- [ ] RAG 全图 + chunk/retrieve 权衡
- [ ] Hybrid / RRF 结合自己项目讲清
- [ ] Agent vs Workflow + multi-agent 理由
- [ ] Agent failure modes + reliability 清单
- [ ] 开始稳定高匹配投递

### Week 4

- [ ] SD：Production RAG
- [ ] SD：ChatGPT-like
- [ ] SD：Enterprise Agent
- [ ] SD：Voice AI
- [ ] SD：Eval Platform
- [ ] SD：Negotiation Practice（30–45 min）

### Week 5

- [ ] 15–20 道核心题过完
- [ ] AsyncIO 能结合项目讲
- [ ] Python 常用库手写不卡

### Week 6

- [ ] 5 项目完整深挖答案
- [ ] 10 个 STAR（含 Failure）

### Week 7

- [ ] Mock ≥ 3 次并复盘
- [ ] 缺口回填笔记

### Week 8

- [ ] 每周 8–15 高质量投递节奏
- [ ] 面试复盘模板稳定使用

---

## 14. 启动顺序（本周立刻做什么）

1. **Resume / Job Targeting** — 定主投 JD 画像
2. **Project Deep Dive** — Tariff / PMI / Negotiation Practice / Voice / Fine-tune 五卡
3. **LLM Fundamentals** — Transformer → Fine-tuning → Inference
4. **RAG** — embedding → retrieval → rerank → generation → eval
5. **Agent** — tool calling → workflow vs agent → multi-agent → reliability
6. **System Design** — 先完整练一道 Production RAG
7. **Mock** — 按面试官方式追问，而不是继续灌知识

---

## 15. 一句话总结

你现在最缺的不是项目，而是把现有项目**面试化**。  
准备比例：**LLM + System Design 占一半**；Coding 够用即可；不要再堆新 demo。
