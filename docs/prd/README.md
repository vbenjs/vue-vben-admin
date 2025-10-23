# FactoryOS PRD Shards

本目录按主题对 `docs/prd.md` 进行拆分/索引，便于协作、评审与用例编写。

- 源文档（权威）：../prd.md

子文档
- AI 助手现状与规划（含 GWT E2E 模板）：./ai-assistant.md
- Epics 索引（链接至主文档锚点）：./epics/README.md

同步脚本（自动镜像主 PRD → 分片）
- 运行：`pnpm shard:prd`（等价：`node internal/scripts/shard-prd.mjs`）
- 作用：扫描 `docs/prd.md` 中“## Epic 详细设计”下的 `### Epic N:` 区块，按编号写入 `docs/prd/epics/epic-0N.md`
- 说明：主文档仍为权威，更新主文档后执行本脚本即可刷新所有分片

维护说明
- 源文档仍为唯一权威版本；子文档以“复制片段 + 回链”的方式便于专人维护
- 更新顺序建议：先改 `docs/prd.md`，再同步子文档（若涉及相应片段）
