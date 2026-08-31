import { type I18nText } from '@/lib/i18n/types'
import { companylink } from '@/settings/main'

export const RESUME_PDF_HREF = '/resume/Zeren_Shen_Resume_2026.pdf'
export const RESUME_PDF_FILENAME = 'Zeren_Shen_Resume_2026.pdf'

export const resumeProfile = {
  name: { zh: '沈泽人', en: 'Zeren Shen' } satisfies I18nText,
  initials: 'ZS',
  pronouns: 'He/Him',
  headline: {
    zh: 'LLM Engineer @ Unilever Horizon3 AI Labs',
    en: 'LLM Engineer @ Unilever Horizon3 AI Labs',
  } satisfies I18nText,
  location: {
    zh: '多伦多，加拿大',
    en: 'Toronto, Ontario, Canada',
  } satisfies I18nText,
  focus: ['Generative AI', 'Agentic AI', 'Production ML Systems'],
  github: {
    label: 'GitHub',
    href: companylink,
  },
  about: {
    zh: '我是 Unilever Horizon3 AI Labs 的 LLM Engineer，专注于构建可落地的生成式 AI 与智能体系统，解决真实业务问题。我的工作覆盖完整 AI 应用栈——从 LLM 与 Agent 编排，到检索、工具调用、数据集成、评估与生产部署。在 Unilever，我参与并构建了面向采购分析、可持续发展、关税情报与谈判的 AI Agent，使用的技术包括 Google Gemini、Google ADK、LangGraph、LangChain、BigQuery、FastAPI 和 React。\n\n此前作为 Machine Learning Engineer，我的工作覆盖 LLM 应用、RAG、实时语音 AI、计算机视觉、Transformer 与生成建模。我构建过低延迟语音与对话系统、面向研究的 RAG 管线，以及基于 PyTorch 的 3D 人体运动深度学习模型。\n\n我拥有多伦多大学工程硕士学位，以及滑铁卢大学数学学士学位。我更关注能走出原型、稳定运行在真实生产环境中的可靠、可扩展 AI 系统。',
    en: "I'm an LLM Engineer at Unilever's Horizon3 AI Labs, focused on building production-grade Generative AI and agentic systems that solve real-world business problems.My work spans the full AI application stack — from LLM and agent orchestration to retrieval, tool calling, data integration, evaluation, and production deployment. At Unilever, I've built and contributed to AI agents for procurement analytics, sustainability, tariff intelligence, and negotiation, using technologies including Google Gemini, Google ADK, LangGraph, LangChain, BigQuery, FastAPI, and React.\n\nPreviously, as a Machine Learning Engineer, I worked across LLM applications, RAG, real-time voice AI, computer vision, transformers, and generative modeling. I built low-latency voice and dialogue systems, research-oriented RAG pipelines, and deep learning models for 3D human motion using PyTorch.\n\nI hold a Master of Engineering from the University of Toronto and a Bachelor of Mathematics from the University of Waterloo. I'm particularly interested in building reliable, scalable AI systems that move beyond prototypes and into real-world production.",
  } satisfies I18nText,
  skills: [
    'Large Language Models',
    'Agentic AI',
    'RAG',
    'LangGraph / LangChain',
    'Google ADK',
    'FastAPI',
    'PyTorch',
    'GCP / BigQuery',
    'React',
    'Deep Learning',
  ],
  skillGroups: [
    {
      label: { zh: 'LLM & Agents', en: 'LLM & Agents' },
      items: ['Large Language Models', 'Agentic AI', 'RAG', 'LangGraph / LangChain', 'Google ADK'],
    },
    {
      label: { zh: '工程', en: 'Engineering' },
      items: ['Python', 'FastAPI', 'React', 'PyTorch', 'Deep Learning'],
    },
    {
      label: { zh: '云与数据', en: 'Cloud & Data' },
      items: ['GCP', 'BigQuery', 'MongoDB', 'Pinecone', 'Docker'],
    },
  ],
}

export interface ResumeExperience {
  company: I18nText
  mark: string
  role: I18nText
  period: I18nText
  duration?: I18nText
  location: I18nText
  mode?: I18nText
  current?: boolean
  summary?: I18nText
  bullets: I18nText[]
  projects?: {
    name: I18nText
    bullets: I18nText[]
  }[]
}

export const resumeExperience: ResumeExperience[] = [
  {
    company: { zh: 'Unilever — Horizon3 AI Labs', en: 'Unilever — Horizon3 AI Labs' },
    mark: 'U',
    role: { zh: 'LLM Engineer', en: 'LLM Engineer' },
    period: { zh: '2025.05 — 至今', en: 'May 2025 — Present' },
    duration: { zh: '1 年 4 个月', en: '1 yr 4 mos' },
    location: { zh: '多伦多，加拿大', en: 'Toronto, Canada' },
    current: true,
    bullets: [
      {
        zh: '面向采购、可持续发展、关税情报与谈判等场景，构建生产级智能体 AI 系统，技术栈包括 Google Gemini、Google ADK 与 LangGraph。',
        en: 'Build production-grade agentic AI systems across procurement, sustainability, tariff intelligence, and negotiation, leveraging Google Gemini, Google ADK, and LangGraph.',
      },
      {
        zh: '设计整合 RAG、工具调用、网络研究、BigQuery/SQL 分析与结构化输出的 LLM 工作流，使企业数据可通过自然语言访问，并自动完成业务分析。',
        en: 'Design LLM workflows integrating RAG, tool calling, web research, BigQuery/SQL analytics, and structured outputs, enabling natural-language access to enterprise data and automated business analysis.',
      },
      {
        zh: '使用 Python、FastAPI、React/Streamlit、GCP、BigQuery 与 MongoDB/Cosmos DB 开发端到端 AI 应用，打通 Agent 编排、API、企业数据与生产服务。',
        en: 'Develop end-to-end AI applications with Python, FastAPI, React/Streamlit, GCP, BigQuery, and MongoDB/Cosmos DB, integrating agent orchestration, APIs, enterprise data, and production services.',
      },
      {
        zh: '使用 DeepEval 与 LLM-as-a-judge 方法建设 LLM 评估与可靠性流程，衡量正确性、完整性、相关性与 Agent 表现。',
        en: 'Develop LLM evaluation and reliability workflows using DeepEval and LLM-as-a-judge methods to assess correctness, completeness, relevance, and agent performance.',
      },
    ],
  },
  {
    company: { zh: 'ThinkGenAI Lab Inc.', en: 'ThinkGenAI Lab Inc.' },
    mark: 'T',
    role: { zh: 'Machine Learning Engineer', en: 'Machine Learning Engineer' },
    period: { zh: '2023.05 — 2024.11', en: 'May 2023 — Nov 2024' },
    duration: { zh: '1 年 7 个月', en: '1 yr 7 mos' },
    location: { zh: '多伦多，加拿大', en: 'Toronto, Canada' },
    bullets: [
      {
        zh: '为研究团队搭建端到端 RAG 系统，自动化 PDF 入库、语义检索与 LLM 摘要，使用 LangChain、Pinecone、FastAPI 与 Docker；并用 ReAct Agent 做实时研究与问答。',
        en: 'Built an end-to-end RAG system for research teams, automating PDF ingestion, semantic retrieval, and LLM-based summarization using LangChain, Pinecone, FastAPI, and Docker; implemented ReAct agents for real-time research and question answering.',
      },
      {
        zh: '开发实时语音 AI 管线，整合 Whisper STT、GPT-3.5 与 Google TTS，端到端延迟 1.2s；通过异步处理、音频分片流水线、请求批处理与 token 级流式生成，支撑 20+ 请求/分钟，并将响应延迟降低 50%。',
        en: 'Developed a real-time voice AI pipeline integrating Whisper STT, GPT-3.5, and Google TTS, achieving 1.2s end-to-end latency; optimized asynchronous processing, audio-chunk pipelining, request batching, and token-level streaming to support 20+ requests/min and reduce response latency by 50%.',
      },
      {
        zh: '开发 3D 人体运动理解与生成的深度学习系统，包括结合 MANO 的条件扩散模型（MPJPE 2.8mm），以及基于 Transformer 的高尔夫姿态分类器（F1 92%）。',
        en: 'Developed deep learning systems for 3D human motion understanding and generation, including a conditional diffusion model with MANO achieving 2.8mm MPJPE and a Transformer-based golf posture classifier achieving 92% F1.',
      },
    ],
  },
  {
    company: { zh: '多伦多大学', en: 'University of Toronto' },
    mark: 'UT',
    role: { zh: '机器学习研究助理', en: 'Machine Learning Research Assistant' },
    period: { zh: '2021.09 — 2022.05', en: 'Sep 2021 — May 2022' },
    duration: { zh: '9 个月', en: '9 mos' },
    location: { zh: '多伦多，加拿大', en: 'Toronto, Ontario, Canada' },
    bullets: [
      {
        zh: '用 TensorFlow / Keras 实现并部署 FCN、U-Net、DeepLabv3，检测与跟踪金属 3D 打印气孔，MeanIoU 约 0.93。',
        en: 'Implemented and deployed FCN, U-Net, and DeepLabv3 with TensorFlow / Keras for pore detection in metal 3D printing, reaching MeanIoU ≈ 0.93.',
      },
      {
        zh: '系统调参，将错误率从约 10% 降到约 6%。',
        en: 'Tuned hyperparameters extensively, reducing error rate from ~10% to ~6%.',
      },
      {
        zh: '设计工业场景气泡跟踪方案，检测与分析能力提升约 15%。',
        en: 'Designed bubble-tracking for industrial printing, improving detection and analysis by ~15%.',
      },
    ],
  },
  {
    company: { zh: '浙江大学', en: 'Zhejiang University' },
    mark: 'ZJ',
    role: { zh: '自动驾驶研究实习生', en: 'Autonomous Driving Research Intern' },
    period: { zh: '2018.05 — 2018.08', en: 'May 2018 — Aug 2018' },
    duration: { zh: '4 个月', en: '4 mos' },
    location: { zh: '杭州，中国', en: 'Hangzhou, Zhejiang, China' },
    bullets: [
      {
        zh: '主导驾驶环境数据采集，支撑后续计算机视觉模型训练。',
        en: 'Led driving-environment data collection to support computer-vision model training for self-driving research.',
      },
      {
        zh: '累计 50+ 小时驾驶数据：10 万+ 视频帧，以及 LiDAR / GPS 等 50 万+ 传感点。',
        en: 'Collected 50+ driving hours: 100,000+ video frames and 500,000+ multimodal sensor points including LiDAR and GPS.',
      },
    ],
  },
]

export const resumeEducation = [
  {
    mark: 'UT',
    school: { zh: '多伦多大学', en: 'University of Toronto' },
    period: { zh: '2021.09 — 2022.11', en: 'Sep 2021 — Nov 2022' },
    notes: [
      {
        zh: '工程硕士，机械与工业工程 — AI/ML 方向',
        en: 'Master of Engineering, Mechanical and Industrial Engineering - AI/ML Focus',
      },
    ],
  },
  {
    mark: 'W',
    school: { zh: '滑铁卢大学', en: 'University of Waterloo' },
    period: { zh: '2016.09 — 2021.04', en: 'Sep 2016 — Apr 2021' },
    notes: [
      {
        zh: '数学学士，统计与机器学习，辅修计算机科学',
        en: 'Bachelor of Mathematics, Statistics & Machine Learning, Minor in Computer Science',
      },
    ],
  },
]

export const resumeLabels = {
  zh: {
    download: '下载简历',
    about: '简介',
    experience: '经历',
    education: '教育',
    skills: '技能',
    projects: '项目',
    present: '至今',
    current: '在职',
    viewFull: '查看完整经历',
    profile: '个人介绍',
    resume: '简历',
  },
  en: {
    download: 'Download resume',
    about: 'About',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    present: 'Present',
    current: 'Current',
    viewFull: 'View full experience',
    profile: 'About',
    resume: 'Resume',
  },
} as const
