# Agent Skill Routing

This workspace contains multiple agent skill repos. When a prompt arrives, classify it first and route it to the best matching skill before doing anything else.

## Routing Rules

1. Pick one primary skill for the prompt.
2. Use a secondary skill only if the prompt clearly needs it.
3. If no skill is a good fit, answer normally without forcing a skill.
4. If a prompt is ambiguous, choose the skill that minimizes unnecessary work and explain the choice briefly.
5. Keep the response aligned with the selected skill's style and constraints.

## Skill Selection

- Use **Ponytail** for:
  - minimal code changes
  - overengineering review
  - deleting unnecessary code
  - terse, lazy-senior-dev guidance
  - refactors where the goal is "less code, same behavior"

- Use **UI UX Pro Max** for:
  - UI/UX design
  - layout and visual polish
  - design system generation
  - component styling
  - frontend taste, structure, and accessibility improvements

- Use **Graphify** for:
  - codebase mapping
  - knowledge graph queries
  - tracing relationships between files, concepts, or modules
  - architecture exploration
  - "what connects X to Y?" style questions

- Use **GSD** for:
  - agent workflow orchestration
  - multi-step coding plans
  - project setup and task execution
  - review, verification, and ship-style workflows
  - cross-tool or cross-agent coordination

## Decision Heuristics

- If the prompt asks to "make it smaller", "simplify it", "remove boilerplate", or "review for overengineering", route to Ponytail.
- If the prompt asks to "make it look better", "design a UI", "build a dashboard", or "choose a visual style", route to UI UX Pro Max.
- If the prompt asks to "map", "query", "explain connections", "find related code", or "show architecture", route to Graphify.
- If the prompt asks to "set up", "run", "install", "orchestrate", or "coordinate a workflow", route to GSD.
- If the prompt combines goals, prefer the skill that addresses the main user outcome, then add others only when necessary.

## Output Behavior

- State the chosen skill first when the prompt clearly matches one.
- Use the repo-local files and instructions for that skill.
- Do not invent a new workflow if the selected skill already defines one.
- When two skills both fit, choose the one that best matches the user's end goal, not the one with the most features.

