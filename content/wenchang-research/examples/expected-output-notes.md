# expected-output-notes

必须包含：

- `## 采证结论`
- `## 来源清单`
- `## 关键事实`
- `## 反向数据 / 限制条件`
- `## 可引用句子`
- `content_state.research.sources`
- `content_state.research.key_facts`
- `content_state.research.contrarian_points`
- `content_state.research.confidence`
- `content_state.handoff.accepted_inputs`
- `content_state.handoff.ignored_context`
- 至少 1 条反向数据、限制条件或不确定性；理想为 3 条
- 如果找不到反向证据，必须说明已查来源、未找到原因、待验证问题，并降低 confidence
- 下一步推荐应指向起稿、立骨或回到定题

不应该出现：

- 直接生成完整文章
- 无来源的确定性数据
- 把反向数据省略
- 找不到反向数据却仍给 High confidence
- 替用户做最终发布或归档决定
