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
    heading: { zh: '面试准备', en: 'Interview Prep' },
    title: { zh: '项目深挖', en: 'Projects' },
    href: '/projects',
  },
  {
    title: { zh: 'LLM / RAG / Agent', en: 'LLM / RAG / Agent' },
    href: '/genai',
  },
  {
    title: { zh: '系统设计', en: 'System Design' },
    href: '/system-design',
  },
  {
    title: { zh: '算法', en: 'Algorithms' },
    href: '/algorithms',
    items: [
      { title: { zh: '数组与哈希', en: 'Arrays & Hashing' }, href: '/arrays' },
      { title: { zh: '链表', en: 'Linked Lists' }, href: '/linked-list' },
      { title: { zh: '树与图', en: 'Trees & Graphs' }, href: '/trees' },
      { title: { zh: '动态规划', en: 'Dynamic Programming' }, href: '/dp' },
      { title: { zh: 'SQL', en: 'SQL' }, href: '/sql' },
    ],
  },
  {
    title: { zh: '计算机基础', en: 'CS Fundamentals' },
    href: '/cs-fundamentals',
  },
  {
    title: { zh: '前端', en: 'Frontend' },
    href: '/frontend',
    items: [
      { title: { zh: 'JavaScript', en: 'JavaScript' }, href: '/javascript' },
      { title: { zh: 'React', en: 'React' }, href: '/react' },
    ],
  },
  {
    spacer: true,
  },
  {
    heading: { zh: '面试表现', en: 'Performance' },
    title: { zh: '行为面试', en: 'Behavioral' },
    href: '/behavioral',
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
