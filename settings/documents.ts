import { type Paths } from '@/lib/paths'

export const Documents: Paths[] = [
  {
    heading: { zh: '总览', en: 'Overview' },
    title: { zh: '准备手册', en: 'Playbook' },
    href: '/overview',
  },
  {
    title: { zh: '求职定位', en: 'Positioning' },
    href: '/positioning',
  },
  {
    spacer: true,
  },
  {
    heading: { zh: '知识点', en: 'Knowledge' },
    title: { zh: 'LLM Fundamentals', en: 'LLM Fundamentals' },
    href: '/llm',
    items: [
      { title: { zh: 'Tokenization', en: 'Tokenization' }, href: '/tokenization' },
      {
        title: { zh: 'Attention & Transformer', en: 'Attention & Transformer' },
        href: '/transformer',
      },
      { title: { zh: 'Training', en: 'Training' }, href: '/training' },
      { title: { zh: 'Post-training', en: 'Post-training' }, href: '/post-training' },
      { title: { zh: 'Fine-tuning', en: 'Fine-tuning' }, href: '/fine-tuning' },
      { title: { zh: 'Inference', en: 'Inference' }, href: '/inference' },
    ],
  },
  {
    title: { zh: 'LLM Application', en: 'LLM Application' },
    href: '/application',
    items: [
      {
        title: { zh: 'Prompt Engineering', en: 'Prompt Engineering' },
        href: '/prompt-engineering',
      },
      { title: { zh: 'Structured Output', en: 'Structured Output' }, href: '/structured-output' },
      { title: { zh: 'Model Selection', en: 'Model Selection' }, href: '/model-selection' },
      { title: { zh: 'Model Routing', en: 'Model Routing' }, href: '/model-routing' },
    ],
  },
  {
    title: { zh: 'RAG / Retrieval', en: 'RAG / Retrieval' },
    href: '/rag',
    items: [
      { title: { zh: 'Architecture', en: 'Architecture' }, href: '/architecture' },
      { title: { zh: 'Document Ingestion', en: 'Document Ingestion' }, href: '/ingestion' },
      { title: { zh: 'Chunking', en: 'Chunking' }, href: '/chunking' },
      { title: { zh: 'Embedding', en: 'Embedding' }, href: '/embedding' },
      { title: { zh: 'Vector Search', en: 'Vector Search' }, href: '/vector-search' },
      { title: { zh: 'Sparse Retrieval', en: 'Sparse Retrieval' }, href: '/sparse-retrieval' },
      { title: { zh: 'Hybrid Search', en: 'Hybrid Search' }, href: '/hybrid-search' },
      { title: { zh: 'Reranking', en: 'Reranking' }, href: '/reranking' },
      { title: { zh: 'Advanced RAG', en: 'Advanced RAG' }, href: '/advanced' },
      { title: { zh: 'Failure Diagnosis', en: 'Failure Diagnosis' }, href: '/debugging' },
    ],
  },
  {
    title: { zh: 'Context Engineering', en: 'Context Engineering' },
    href: '/context',
    items: [
      { title: { zh: 'Model Context', en: 'Model Context' }, href: '/model-context' },
      { title: { zh: 'Context Window', en: 'Context Window' }, href: '/window' },
      { title: { zh: 'Construction', en: 'Construction' }, href: '/construction' },
      { title: { zh: 'Compression', en: 'Compression' }, href: '/compression' },
      { title: { zh: 'Caching', en: 'Caching' }, href: '/caching' },
      { title: { zh: 'Isolation', en: 'Isolation' }, href: '/isolation' },
    ],
  },
  {
    title: { zh: 'Agent Engineering', en: 'Agent Engineering' },
    href: '/agent',
    items: [
      { title: { zh: 'Agent Loop', en: 'Agent Loop' }, href: '/loop' },
      { title: { zh: 'Tool Calling', en: 'Tool Calling' }, href: '/tool-calling' },
      { title: { zh: 'ReAct', en: 'ReAct' }, href: '/react' },
      { title: { zh: 'Workflow vs Agent', en: 'Workflow vs Agent' }, href: '/workflow-vs-agent' },
      { title: { zh: 'Planning', en: 'Planning' }, href: '/planning' },
      { title: { zh: 'Memory', en: 'Memory' }, href: '/memory' },
      { title: { zh: 'Multi-Agent', en: 'Multi-Agent' }, href: '/multi-agent' },
      { title: { zh: 'Reliability', en: 'Reliability' }, href: '/reliability' },
      { title: { zh: 'Security', en: 'Security' }, href: '/security' },
    ],
  },
  {
    title: { zh: 'Evaluation', en: 'Evaluation' },
    href: '/evaluation',
    items: [
      { title: { zh: 'Fundamentals', en: 'Fundamentals' }, href: '/fundamentals' },
      { title: { zh: 'Offline Eval', en: 'Offline Eval' }, href: '/offline' },
      { title: { zh: 'LLM Evaluation', en: 'LLM Evaluation' }, href: '/llm-eval' },
      { title: { zh: 'RAG Evaluation', en: 'RAG Evaluation' }, href: '/rag-eval' },
      { title: { zh: 'Agent Evaluation', en: 'Agent Evaluation' }, href: '/agent-eval' },
      { title: { zh: 'Production Eval', en: 'Production Eval' }, href: '/production-eval' },
    ],
  },
  {
    title: { zh: 'Production AI', en: 'Production AI' },
    href: '/production',
    items: [
      { title: { zh: 'API Engineering', en: 'API Engineering' }, href: '/api-engineering' },
      { title: { zh: 'Latency', en: 'Latency' }, href: '/latency' },
      { title: { zh: 'Cost', en: 'Cost' }, href: '/cost' },
      { title: { zh: 'Scaling', en: 'Scaling' }, href: '/scaling' },
      { title: { zh: 'Observability', en: 'Observability' }, href: '/observability' },
      { title: { zh: 'Reliability', en: 'Reliability' }, href: '/reliability' },
    ],
  },
  {
    title: { zh: 'AI System Design', en: 'AI System Design' },
    href: '/system-design',
    items: [
      { title: { zh: 'L1 · RAG Chatbot', en: 'L1 · RAG Chatbot' }, href: '/rag-chatbot' },
      {
        title: { zh: 'L1 · Knowledge Assistant', en: 'L1 · Knowledge Assistant' },
        href: '/knowledge-assistant',
      },
      { title: { zh: 'L1 · Document Q&A', en: 'L1 · Document Q&A' }, href: '/document-qa' },
      {
        title: { zh: 'L2 · Customer Support', en: 'L2 · Customer Support' },
        href: '/customer-support',
      },
      { title: { zh: 'L2 · AI Search', en: 'L2 · AI Search' }, href: '/ai-search' },
      {
        title: { zh: 'L2 · Meeting Summarization', en: 'L2 · Meeting Summarization' },
        href: '/meeting-summarization',
      },
      {
        title: { zh: 'L2 · Document Extraction', en: 'L2 · Document Extraction' },
        href: '/document-extraction',
      },
      { title: { zh: 'L3 · AI Agent', en: 'L3 · AI Agent' }, href: '/ai-agent' },
      { title: { zh: 'L3 · Coding Agent', en: 'L3 · Coding Agent' }, href: '/coding-agent' },
      { title: { zh: 'L3 · Multi-Agent', en: 'L3 · Multi-Agent' }, href: '/multi-agent' },
      {
        title: { zh: 'L3 · Long-running Agent', en: 'L3 · Long-running Agent' },
        href: '/long-running-agent',
      },
      { title: { zh: 'L4 · ChatGPT-like', en: 'L4 · ChatGPT-like' }, href: '/chatgpt' },
      { title: { zh: 'L4 · Agent Platform', en: 'L4 · Agent Platform' }, href: '/agent-platform' },
      {
        title: { zh: 'L4 · Inference Platform', en: 'L4 · Inference Platform' },
        href: '/inference-platform',
      },
      { title: { zh: 'L4 · Large-scale RAG', en: 'L4 · Large-scale RAG' }, href: '/rag-platform' },
    ],
  },
  {
    title: { zh: 'AI-Native Engineering', en: 'AI-Native Engineering' },
    href: '/ai-native',
    items: [
      { title: { zh: 'MCP', en: 'MCP' }, href: '/mcp' },
      { title: { zh: 'Agent Harness', en: 'Agent Harness' }, href: '/harness' },
      { title: { zh: 'Claude Code / Codex', en: 'Claude Code / Codex' }, href: '/coding-workflow' },
      { title: { zh: 'Agentic Coding', en: 'Agentic Coding' }, href: '/agentic-coding' },
      { title: { zh: 'Context Compaction', en: 'Context Compaction' }, href: '/compaction' },
      { title: { zh: 'Agent State', en: 'Agent State' }, href: '/agent-state' },
      { title: { zh: 'Sandbox', en: 'Sandbox' }, href: '/sandbox' },
    ],
  },
  {
    title: { zh: '工程基础', en: 'Engineering' },
    href: '/engineering',
    items: [
      { title: { zh: 'Python', en: 'Python' }, href: '/python' },
      { title: { zh: '并发', en: 'Concurrency' }, href: '/concurrency' },
      { title: { zh: 'REST API', en: 'REST API' }, href: '/rest' },
      { title: { zh: 'SQL', en: 'SQL' }, href: '/sql' },
      { title: { zh: 'Docker / Cloud', en: 'Docker / Cloud' }, href: '/cloud' },
      { title: { zh: '分布式', en: 'Distributed' }, href: '/distributed' },
      { title: { zh: '测试 / Git', en: 'Testing / Git' }, href: '/testing' },
    ],
  },
  {
    title: { zh: '算法', en: 'Algorithms' },
    href: '/algorithms',
    items: [
      { title: { zh: '数组与哈希', en: 'Arrays & Hashing' }, href: '/arrays' },
      { title: { zh: '链表', en: 'Linked Lists' }, href: '/linked-list' },
      { title: { zh: '树与图', en: 'Trees & Graphs' }, href: '/trees' },
      { title: { zh: '动态规划', en: 'Dynamic Programming' }, href: '/dp' },
    ],
  },
  {
    spacer: true,
  },
  {
    heading: { zh: '面试表现', en: 'Performance' },
    title: { zh: '项目深挖', en: 'Projects' },
    href: '/projects',
    items: [
      { title: { zh: 'Negotiation Practice', en: 'Negotiation Practice' }, href: '/negotiation' },
      { title: { zh: 'Tariff Agent', en: 'Tariff Agent' }, href: '/tariff' },
      { title: { zh: 'Voice AI', en: 'Voice AI' }, href: '/voice' },
      { title: { zh: 'PMI Logistics', en: 'PMI Logistics' }, href: '/pmi' },
      { title: { zh: 'LLaMA Fine-tuning', en: 'LLaMA Fine-tuning' }, href: '/fine-tuning' },
    ],
  },
  {
    title: { zh: '行为面试', en: 'Behavioral' },
    href: '/behavioral',
    items: [
      { title: { zh: 'STAR 故事', en: 'STAR' }, href: '/star' },
      { title: { zh: '技术表达', en: 'Communication' }, href: '/communication' },
      { title: { zh: 'Mock', en: 'Mock' }, href: '/mock' },
    ],
  },
  {
    spacer: true,
  },
  {
    heading: { zh: '每日记录', en: 'Daily Log' },
    title: { zh: '学习日志', en: 'Journal' },
    href: '/journal',
  },
]
