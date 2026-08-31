# Followblindly

面向 2026 的个人面试准备站。基于 [Documents](https://vercel.com/templates/next.js/documents-simple-next-js-documentation) 模版改造：用 Markdown 记笔记，网站自己更新。

- 仓库：https://github.com/Followb1ind1y/interview-prep-2026
- 默认中文、默认白天模式

## 本地启动

需要 Node.js 20+。

```bash
npm install
npm run generate-content-json
npm run dev
```

打开 http://localhost:3000。

## 日常怎么更新

1. 在 `contents/docs|companies|resume/` 下改或新增 `index.mdx`
2. 新页还要在对应的 `settings/documents.ts` / `companies.ts` / `resume.ts` 里加导航
3. 首页介绍、时间线、计划分别改：
   - `contents/site/profile.json`
   - `contents/site/timeline.json`
   - `contents/site/roadmap.json`
4. 给 MDX 写上 `date: YYYY-MM-DD`，首页当月小方块会点亮

开发时改 MDX 保存即可刷新页面。搜索索引走 `/api/search`，一般不用手动生成。部署构建会自动跑 `generate-content-json`。

## 信息架构

| 路由 | 内容 |
| --- | --- |
| `/` | 自我介绍、时间线、热力图、倒计时、Roadmap |
| `/docs/*` | 面试笔记 |
| `/companies/*` | 投递记录 |
| `/resume/*` | 简历与自我介绍 |

Logo 是三阶上升台阶：表示面试准备按阶段推进。


颜色深浅由「当天有多少条带 `date` 的更新」决定：

- 每个 `contents/docs|companies|resume/**/index.mdx` 的 frontmatter `date`
- 加上 `contents/site/timeline.json` 里的条目

同一天每多 1 条，计数 +1。映射为：0 → 空，1 → 浅，2 → 中，3–4 → 深，≥5 → 最深。
