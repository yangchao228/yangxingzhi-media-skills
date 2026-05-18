# expected-output-notes

必须包含：

- `## 路由判断`
- 平台应优先判断为公众号
- 阶段应判断为定题或立骨，而不是直接出刊
- `content_state.request.current_stage`
- `content_state.distribution.primary_platform`
- `content_state.next_step.skill`
- 至少一个可选后续步骤

不应该出现：

- 直接生成完整终稿
- 直接判断可发布
- 替用户做最终归档决定

