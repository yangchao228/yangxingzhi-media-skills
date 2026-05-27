# AI/Codex Cost Savings

## Objective

Build a practical AI/Codex/Token cost-saving plan and reusable asset pack for the current tranche.

## Original Request

请帮我省点钱

## Intake Summary

- Input shape: `vague`
- Audience: user
- Authority: `requested`
- Proof type: `artifact`
- Completion proof: A final Judge/PM audit confirms the produced cost-saving checklist and reusable assets are specific, actionable, and mapped back to AI/Codex/Token cost reduction.
- Goal oracle: Artifact review of the completed cost-saving checklist plus reusable asset pack.
- Likely misfire: Producing generic money-saving advice without identifying concrete AI/Codex/Token waste patterns or reusable workflow assets.
- Blind spots considered: Avoid cutting valuable capability only to reduce spend; optimize cost per useful output, not just total spend.
- Existing plan facts: User chose AI/Codex/Token cost as the target and accepted the default proof of an executable savings checklist plus reusable assets.

## Goal Oracle

The oracle for this goal is:

`A receipt-backed artifact review proves there is an actionable AI/Codex/Token cost-saving checklist plus reusable asset pack, with clear next actions and no dependency on production credentials or sensitive billing data.`

The PM must keep comparing task receipts to this oracle. Planning, discovery, a passing tiny slice, or a clean-looking board is not enough. The goal finishes only when a final Judge/PM audit maps receipts and verification back to this oracle and records `full_outcome_complete: true`.

## Goal Kind

`open_ended`

## Current Tranche

Discover the highest-leverage local AI/Codex/Token cost-saving opportunities that can be assessed without sensitive billing credentials, produce a practical savings checklist, and package the reusable parts into durable assets.

## Non-Negotiable Constraints

- Do not request, expose, or store secrets, tokens, payment credentials, or private billing data.
- Do not change production-sensitive configuration.
- Prefer concrete evidence from local files, usage patterns, prompts, workflows, and existing content assets over generic cost advice.
- Preserve user judgment for final tradeoffs between cost reduction and capability.
- Keep outputs reusable as SOP, checklist, template, Skill idea, or content asset.

## Stop Rule

Stop only when a final audit proves the full original outcome is complete.

Do not stop after planning, discovery, or Judge selection if a safe Worker task can be activated.

Do not stop after a single verified Worker package when the broader owner outcome still has safe local follow-up work.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny.

A good task is the largest safe useful slice.

## Canonical Board

Machine truth lives at:

`docs/goals/ai-cost-savings/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins for task status, active task, receipts, verification freshness, and completion truth.

## Run Command

```text
/goal Follow docs/goals/ai-cost-savings/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter.
2. Read `state.yaml`.
3. Run the bundled GoalBuddy update checker when available and mention a newer version without blocking.
4. Re-check the intake: original request, input shape, authority, proof, blind spots, existing plan facts, and likely misfire.
5. Work only on the active board task.
6. Assign Scout, Judge, Worker, or PM according to the task.
7. Write a compact task receipt.
8. Update the board.
9. If safe local work remains, choose the next largest reversible Worker package and continue unless blocked.
10. Finish only with a Judge/PM audit receipt that maps receipts and verification back to the original user outcome and records `full_outcome_complete: true`.
