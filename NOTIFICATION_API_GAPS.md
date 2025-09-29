# Notification API Gaps

前端已接入现有的通知服务接口，当前能力覆盖：

- `/user-notification/list` 用户通知分页查询（支持类型、状态、优先级筛选）。
- `/user-notification/read` 单条标记已读。
- `/user-notification/unread-count` 未读数量统计。
- `/notification/detail` 通知主体详情回显。

在集成过程中仍有以下接口或返回字段缺失，建议补齐以支撑完整的消息中心体验：

## 建议新增的接口

| 能力 | 建议 Method & Path | 请求示例 | 响应 | 说明 |
| --- | --- | --- | --- | --- |
| 单条标记为未读 | `POST /user-notification/unread` | `{ "userId": 1001, "userNotifiId": 20001 }` | `R<Void>` | 当前仅支持已读，无法撤销阅读状态，前端暂以内存回退处理，刷新后状态与后端不一致。 |
| 批量标记已读 | `POST /user-notification/read-all` | `{ "userId": 1001, "userNotifiIds": [20001,20002] }` 或 `{ "userId": 1001 }` | `R<Void>` | 现在前端需对每条未读循环调用单条接口，存在性能与幂等风险。 |
| 删除单条通知 | `DELETE /user-notification/{userNotifiId}` | Path 参数 `userNotifiId`，Query/Body 携带 `userId` | `R<Void>` | 支持用户在通知中心移除单条消息；当前按钮仅清除前端缓存。 |
| 清空用户通知 | `POST /user-notification/clear` | `{ "userId": 1001 }` | `R<Void>` | 用于消息中心“清空通知”操作，期望同时更新未读计数。 |
| SSE 鉴权参数 | `GET /notification-sse/connect?token=xxxx` | Query 携带访问令牌 | `text/event-stream` | 浏览器 `EventSource` 无法自定义 `X-Auth-Token` 头，需支持通过 query/cookie 进行认证，否则前端无法接入实时推送。 |

## 建议补充的返回字段

| 场景 | 建议字段 | 说明 |
| --- | --- | --- |
| 通知列表 `/user-notification/list` | `summary` 或 `previewText` | 提供精简摘要用于列表及头部下拉，避免前端自行截断 `content`。 |
| 通知列表 `/user-notification/list` | `avatar` / `icon` / `link` | 供前端显示来源头像或跳转链接，现阶段使用占位图且缺少跳转能力。 |
| 通知详情 `/notification/detail` | `attachments`（如有） | 预留附件、动作链接等扩展信息，便于增强通知详情。 |

## 可选的查询能力增强

- 为 `/user-notification/list` 增加 `keyword` 模糊查询参数，使后端支持按标题/内容检索，与前端搜索框保持一致。
- 支持 `page` / `size` 以外的排序字段（如创建时间倒序）明确化，避免依赖默认排序。

以上改动完成后，可删除前端的临时内存操作（标记未读、删除、清空）逻辑，实现通知中心与后台数据的完全一致。EOF
