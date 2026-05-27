# T001 Scout: AI/Codex/Token Cost Surfaces

## Cost Surface Map

1. Token cost is already framed as workflow cost.
   - Evidence: `human3.0_book/entries/2026-05-21-token-economics-workflow-cost.md:19-23` says the useful angle is not model price, but how context, tool calls, model routing, and stable rules are organized.
   - Implication: the savings plan should focus on reducing heavy context, tool loops, and rework, then turning repeated work into reusable assets.

2. The current content package already identifies the four billing surfaces.
   - Evidence: `content/outputs/2026-05-21-ai-cost-token-economics-wechat-zhihu-xhs.md:17-22` lists input, cached input, output, and reasoning/thinking costs, while warning that specific model prices drift.
   - Implication: the artifact should avoid hardcoded prices and instead use a stable diagnostic checklist.

3. The known high-frequency waste patterns are concrete.
   - Evidence: `human3.0_book/entries/2026-05-21-token-economics-workflow-cost.md:47-51` names heavy questions, full-repo context, uncontrolled tool loops, high-end model use for simple tasks, unstable cache prefixes, and long conversations.
   - Evidence: `content/outputs/2026-05-21-ai-cost-token-economics-wechat-zhihu-xhs.md:87-93` repeats the same pattern for practical user diagnosis.

4. There is already a practical "cost exam" hook.
   - Evidence: `content/outputs/2026-05-21-ai-cost-token-economics-wechat-zhihu-xhs.md:99-103` proposes the next step: an AI cost health check covering subscriptions, heavy context, agent pathfinding, expensive model choice, and proxy metrics when precise Token data is unavailable.
   - Implication: first Worker package should produce that health check instead of another generic article.

5. The repo has a reusable context handoff mechanism.
   - Evidence: `README.md:76-81` and `content/CONTENT_STATE.md:3-6` describe `content_state` as a structured handoff that prevents every stage from re-understanding the user.
   - Implication: the savings assets should include a compact context budget template and handoff checklist.

6. Some content-generation skills have explicit token pressure.
   - Evidence: `content/redbook-cards/EXAMPLE.md:49-52` says complete HTML output costs roughly 3000-5000 tokens and needs `max_tokens >= 8000`.
   - Evidence: `content/xiaohongshu-viral-image-skill-v4/templates/output-template.md:48-52` structures repeated per-page image prompts.
   - Implication: card/image workflows need a "page budget and prompt reuse" rule: diagnose once, reuse visual spec, vary only per-page copy.

7. The broader asset strategy is already stable.
   - Evidence: `ai_study/series-plan.md:119-126` requires every article to produce a reusable asset such as prompt template, practice checklist, review template, self-test, or acceptance table.
   - Implication: the cost-saving deliverable should be both a checklist and an asset pack, not just advice.

## Ranked Waste Patterns

1. Heavy context by default: long chat history, full files, tool output, logs, and project rules are repeatedly sent for small questions.
2. Agent pathfinding without a plan: agents read too broadly or loop through tools before stating a search plan.
3. Model/reasoning mismatch: simple classification, formatting, or extraction tasks use expensive models or high reasoning.
4. Low cache reuse: stable rules, project context, tool definitions, and task templates are not kept stable or front-loaded.
5. Output overproduction: long multi-platform or card outputs are generated before the decision point is validated.
6. Rework from weak handoff: each stage repeats background because handoff state is incomplete or buried in chat.
7. Subscription/tool overlap: Cursor/Claude/Codex/ChatGPT-style tools may overlap, but local evidence here is not enough to inspect real subscriptions without user-provided summaries.

## Reusable Asset Opportunities

1. AI cost health check: a weekly or per-project diagnostic sheet for heavy context, model choice, tool loops, cacheability, output size, and rework.
2. Context budget template: "what to include / what to summarize / what to exclude / when to stop and search first."
3. Agent run guardrails: require search plan, allowed files, max tool loops, output cap, and verification command before expensive runs.
4. Model routing table: default low-cost mode for extraction/formatting, higher reasoning only for architecture, debugging, and final review.
5. Prompt/cache prefix template: stable project rules first, dynamic task last, no volatile timestamps or one-off details in reusable prefix.
6. Content workflow token budget: one diagnosis pass, one structured handoff, one platform-specific generation pass, and no full regeneration unless the core angle changes.

## Recommended First Worker Package

Create two artifacts under `docs/goals/ai-cost-savings/notes/`:

1. `ai-codex-cost-saving-checklist.md`
   - A practical checklist that the user can apply immediately.
   - Must cover token/model waste, subscriptions/tool overlap, agent rework, cache/prompt reuse, and output scope.

2. `reusable-cost-assets.md`
   - A reusable asset pack: context budget template, agent run guardrail, model routing table, cache prefix rules, weekly review template, and possible Skill ideas.

Do not require private billing data. If real spend is needed later, ask only for user-summarized totals or screenshots with sensitive details removed.
