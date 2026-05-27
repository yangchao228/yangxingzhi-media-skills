# expected-output-notes

必须包含：

- `## 路由判断`
- 平台应优先判断为公众号
- 阶段应判断为定题或立骨，而不是直接出刊
- `content_state.request.current_stage`
- `content_state.distribution.primary_platform`
- `content_state.next_step.skill`
- `content_state.handoff.accepted_inputs`
- `content_state.handoff.ignored_context`
- 如果用户已明确拍板平台、标题或归档方向，必须写入 `content_state.decisions`
- 至少一个可选后续步骤
- 如果已定题但缺事实证据，下一步应优先指向 `wenchang-research`
- 定题/路由阶段应输出 brief：Angle、Hook、Subpoints、What to avoid、Suggested format
- Hook 必须是判断句，不应是提问句

不应该出现：

- 直接生成完整终稿
- 路由/定题阶段直接写正文
- 直接判断可发布
- 替用户做最终归档决定
