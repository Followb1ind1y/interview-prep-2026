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

## 划词翻译

笔记正文用英文写（面试要用英文说），读不懂的地方现场查。

1. `cp .env.example .env.local`，填上 `ANTHROPIC_API_KEY`
2. 重启 `npm run dev`
3. 全站任何能选中文字的地方（正文、标题、首页、简历、导航栏……）选中一个词或一句话 → 旁边出现「翻译」气泡 → 点它或直接按 `T`

方向自动判断：选中英文给中文理解，选中中文给面试里能说出口的英文。翻译会带上所在段落和页面标题做上下文，所以同一个词在不同专栏会给不同解释。代码块内不触发；某个元素不想被翻译可以加 `data-no-translate` 属性手动排除。

返回刻意只有三样东西：**释义 / 词性 / 易错提示**。

- 默认模型 `claude-haiku-4-5`。实测单次 **1.1–3.1 秒（中位约 2 秒）**，平均 498 input + 74 output token，约 **$0.00087/次**——$5 约够 5700 次。改 `TRANSLATE_MODEL` 可换 `claude-sonnet-5` / `claude-opus-5`，更慢更贵
- 输入里只有约 10% 是你选中的内容，其余是每次都要重发的翻译规则和 JSON schema。Haiku 4.5 的 prompt cache 门槛是 4096 token，这个前缀（约 450）够不着，缓存不生效——所以省钱只能靠精简 prompt 和下面两层本地缓存
- 查过的结果同时存在浏览器和服务端内存里，重复查同一处不再打接口

早期版本还会返回其他义项、术语对照和面试例句，实测下来单次 $0.0026、中位 7 秒，而多出来的内容多半是把释义换个说法重复一遍。砍掉后成本降到 1/3、延迟降到 1/3.5，输出质量反而更稳。要加回来就改 `lib/translate/types.ts` 的 schema 和 `prompt.ts` 的字段说明——注意两者必须同时改。
- 接口在 `app/api/translate/route.ts`，只接受同源请求并限流 40 次/分钟
- 没配 key 时功能静默不可用，站点其余部分照常

## 高亮与批注

选中文字后，「翻译」旁边还有两个按钮：

- **高亮**（`H`）：荧光笔黄底
- **批注**（`N`）：波浪下划线 + 自己写的备注，`⌘/Ctrl + Enter` 保存

鼠标停在高亮或批注上会弹出卡片，显示备注和日期，可以编辑、删除，或给高亮补一条批注。触屏点一下文字也能打开。

**翻译存为批注**：翻译面板里点「存为批注」（或按 `S`），释义 / 词性 / 易错提示就存成这段文字的批注，悬停直接看，还能在下面补自己的备注。之后在同一页再选中同一段文字点翻译，会直接读这条批注，不调接口。和「划词翻译」里的本地缓存相比，它不会被挤掉（缓存只留最近 200 条），而且看得见。

- **存在仓库里**：`contents/site/annotations.json`，按页面路径分组。只有本地 `npm run dev` 能加 / 改 / 删——每次保存由 `/api/annotations` 写进这个文件；**commit + push 后线上随部署展示**
- **线上只读**：看得到批注和存下的翻译，但没有高亮 / 批注 / 存为批注按钮，卡片里也没有编辑删除；`/api/annotations` 在生产环境直接 404
- **公开可见**：仓库和网站都是公开的，写进去的备注所有人都能看到
- 早期版本存在浏览器 `localStorage` 里的批注，打开 `npm run dev` 时会自动搬进文件
- 同时开着的多个本地标签页会互相同步；JSON 格式固定（页面排序、字段顺序），diff 只显示改动的那几条
- 定位靠「选中的原文 + 前后各 32 个字符」，不依赖 DOM 结构。如果改了笔记里被划的那句话，这条就找不到位置、暂时不显示（数据还在，文字改回来会自动出现）；切换中英文同理
- 用浏览器的 CSS Custom Highlight API 上色，不往正文里插 `<mark>`，不会干扰 React 渲染。需要 Chrome 105+ / Safari 17.2+ / Firefox 140+，更老的浏览器不出现这两个按钮
- 只能划页面主体 `<main>`，导航栏和页脚不行；某块不想被划可以加 `data-no-annotate`

### 线上（Vercel）

Vercel 上不用改代码，只要把同一个环境变量配进去：

1. Vercel Dashboard → 项目 → Settings → Environment Variables
2. 加 `ANTHROPIC_API_KEY`，Production / Preview / Development 三个环境都勾上 → Save
3. 重新部署一次（改环境变量不会自动生效于已有部署，push 代码会顺带触发）

注意这个功能需要 Node 服务端。Vercel 没问题；如果哪天改成静态导出到 GitHub Pages，`/api/translate` 就不存在了，划词会一直报错。

站点是公开的，所以线上这个接口花的是你的钱。已经做了两道防护：接口只接受同源请求（`Origin` 头必须存在且匹配，curl 直接打会 403），以及每 IP 40 次/分钟限流。但 Vercel 是 serverless，限流计数存在实例内存里，多实例时会被摊薄。**去 Anthropic Console → Settings → Limits 设一个月度花费上限**，那是唯一确定的兜底。

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
| `/resume/*` | 个人介绍与简历 |

Logo 是三阶上升台阶：表示面试准备按阶段推进。

## Agent / UI 约定

改 UI 时请遵循：

1. **模版**：保持 [Documents](https://vercel.com/templates/next.js/documents-simple-next-js-documentation) 文档站排版（docs/companies 左栏+文章+右 TOC；首页无侧栏；resume 独立宽版）
2. **Skill**：项目已安装 shadcn skill（`.agents/skills/shadcn`）；装组件用 `npx shadcn@latest add …`
3. **规则**：`.cursor/rules/documents-ui.mdc`（改 `app/` / `components/` / `styles/` 时自动生效）

提示词可写：`按 Documents 模版和 documents-ui 规则改，先对照现有布局与 shadcn skill，不要换视觉语言。`

颜色深浅由「当天有多少条带 `date` 的更新」决定：

- 每个 `contents/docs|companies|resume/**/index.mdx` 的 frontmatter `date`
- 加上 `contents/site/timeline.json` 里的条目

同一天每多 1 条，计数 +1。映射为：0 → 空，1 → 浅，2 → 中，3–4 → 深，≥5 → 最深。
