# expected-output-notes

必须包含：

- `## 发布结论`
- 因缺摘要、标签、配图，建议不能是无条件“可发布”
- `## 必补项`
- `## 平台发布包`
- 若目标平台包含小红书，必须包含 `### 小红书发布包`
- 小红书发布包必须包含爆款标题候选、正文描述、热门话题标签
- `## content_state 更新`
- `publish_assets`
- `publish_assets.xiaohongshu`
- `distribution.secondary_platforms`
- 如果用户已确认标题、封面、卡片或归档选择，必须包含 `decisions`
- 如果建议归档，应在 `decisions` 中记录默认归档，且不要因归档本身要求用户确认
- `handoff.accepted_inputs`
- `handoff.ignored_context`

不应该出现：

- 替用户发布
- 假装配图、摘要、标签已经齐全
- 跳过 Human3.0 归档建议
- 把默认归档写成默认发布、默认上传或默认最终入书
