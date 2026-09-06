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
      { title: { zh: 'Transformer', en: 'Transformer' }, href: '/transformer' },
      { title: { zh: 'Attention', en: 'Attention' }, href: '/attention' },
      { title: { zh: 'Training', en: 'Training' }, href: '/training' },
      { title: { zh: 'Fine-tuning', en: 'Fine-tuning' }, href: '/fine-tuning' },
      { title: { zh: 'Inference', en: 'Inference' }, href: '/inference' },
    ],
  },
  {
    title: { zh: 'RAG', en: 'RAG' },
    href: '/rag',
    items: [
      { title: { zh: 'Embedding', en: 'Embedding' }, href: '/embedding' },
      { title: { zh: 'Retrieval', en: 'Retrieval' }, href: '/retrieval' },
      { title: { zh: 'Reranking', en: 'Reranking' }, href: '/reranking' },
      { title: { zh: 'Hybrid Search', en: 'Hybrid Search' }, href: '/hybrid-search' },
      { title: { zh: 'Evaluation', en: 'Evaluation' }, href: '/evaluation' },
    ],
  },
  {
    title: { zh: 'Agent', en: 'Agent' },
    href: '/agent',
    items: [
      { title: { zh: 'Tool Calling', en: 'Tool Calling' }, href: '/tool-calling' },
      { title: { zh: 'Planning', en: 'Planning' }, href: '/planning' },
      { title: { zh: 'Memory', en: 'Memory' }, href: '/memory' },
      { title: { zh: 'Multi-Agent', en: 'Multi-Agent' }, href: '/multi-agent' },
      { title: { zh: 'Reliability', en: 'Reliability' }, href: '/reliability' },
    ],
  },
  {
    title: { zh: '系统设计', en: 'System Design' },
    href: '/system-design',
    items: [
      { title: { zh: 'Architecture', en: 'Architecture' }, href: '/architecture' },
      { title: { zh: 'Scalability', en: 'Scalability' }, href: '/scalability' },
      { title: { zh: 'Latency', en: 'Latency' }, href: '/latency' },
      { title: { zh: 'Cost', en: 'Cost' }, href: '/cost' },
      { title: { zh: 'Reliability', en: 'Reliability' }, href: '/reliability' },
      { title: { zh: 'Observability', en: 'Observability' }, href: '/observability' },
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
