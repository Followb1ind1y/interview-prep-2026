---
name: publish-note
description: >-
  Distill an Inbox session note into Followblindly Docs after the user confirms.
  Use when the user asks to archive, publish, or merge notes into the knowledge
  base (归档到 Docs, 发布笔记, 把 Inbox 合并进知识库, publish note, @publish-note).
  Never write docs before explicit confirmation.
---

# Publish Note

Turn a private Inbox file into distilled interview notes on this site. Wait for confirmation before any `contents/` or `settings/documents.ts` edit.

Read [taxonomy.md](taxonomy.md) for destinations and page shapes.

Inbox directory: `notes/inbox/` (repo root). Session files are gitignored.

## When to run

Only when the user asks to archive/publish/merge into Docs. Do not scan Inbox or propose publishing unprompted.

## Steps

1. Pick the source: the file they named, else the newest `notes/inbox/*.md` with `status: inbox` (skip `README.md`).
2. If `type: work` → set `status: skipped`, tell them it stays off the site, stop. Do not edit docs.
3. If `mixed`, split knowledge vs work in the confirmation card; only knowledge may be published.
4. Search `contents/docs/**/*.mdx` (title, `keywords`, headings) plus [taxonomy.md](taxonomy.md). Prefer **merge**.
5. Print the confirmation card below, then **stop**. No file writes yet.
6. After they say `确认归档` (or name a different target / `跳过`):
   - `跳过` → set inbox `status: skipped`, stop
   - otherwise write the distilled MDX, update `date` to today on touched docs pages
   - new page only: add nav in `settings/documents.ts`
   - append one bullet under today's date in `contents/docs/journal/index.mdx` (create the `## YYYY-MM-DD` heading if missing)
   - set inbox `status: published` and add the site path(s) under 归档建议 or a `published:` frontmatter field
7. Reply with the paths changed. Do not commit.

## Confirmation card (required)

```
准备归档：notes/inbox/<file>.md

类型: knowledge | mixed | work
建议:
- 动作: 合并 | 新建
- 路径: contents/docs/...
- 小节: （对齐目标页已有标题）
- 标签: ...
- 重复: 已有「…」，将补充例子 / 新开小节 / 跳过该点
- 新建页面: 否 | 是（将改 settings/documents.ts）
- Journal: （一行）

工作内容: 无 | 已排除，不上网站

请回复：确认归档 / 改到 <页> / 跳过
```

## Distill, do not paste

Public docs must match the destination page voice: short, interview-ready Chinese, optional `titleEn` / `descriptionEn`.

- Inbox keeps full Q&A; Docs get 「必能讲清」bullets, one skeleton, or one example — not the chat transcript
- Add at most a handful of new bullets per page per publish
- Use existing MDX components already on that page (`Note`, `Step`, tables) if they already appear there
- Keep bilingual frontmatter; refresh `keywords` only with terms that belong on that page
- `date` on edited docs pages = today (heatmap)

## Forbidden

- Writing docs before `确认归档`
- Publishing `type: work`
- Dumping the full Inbox into MDX
- Git commit
- Mentioning unpublished Inbox files unless the user asked to publish
