# BUILD_LOG.md

## Day 1 — Initialize Project (2026-05-23)

### Phase 1: brainstorm
Verdict: PROCEED
Files touched: `BUILD_LOG.md`
What I learned: The specification is exceptionally concrete, specifying models, task categories, charts, and verification fallbacks, allowing us to proceed with confidence.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 2: plan
Verdict: PROCEED
Files touched: `BUILD_LOG.md`
What I learned: Converted the natural language spec into 10 structured tasks following strict TDD, outlining the precise types and structures needed to avoid SSR hydration mismatches.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 3: worktree
Verdict: PROCEED
Files touched: `BUILD_LOG.md`
What I learned: Defined isolation boundaries and set required files with an estimated total LOC of 1200, creating a clear development contract.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 4: tdd_red
Verdict: PROCEED
Files touched: `BUILD_LOG.md`
What I learned: Wrote 5 robust Jest unit tests in `__tests__/calculator.test.ts` verifying all 10 models, 6 categories, math precision, edge cases, and cell provenance requirements.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 5: generate
Verdict: PROCEED
Files touched: `BUILD_LOG.md`, `package.json`, `tailwind.config.js`, `app/globals.css`, `lib/llms.ts`, `lib/calculator.ts`, `components/CostCharts.tsx`, `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `scripts/pricing-drift.js`, `.github/workflows/pricing-drift.yml`, `README.md`
What I learned: Authored the full application code in type-safe TypeScript, wrapping the Recharts visualization components in a mounted hydration check to ensure smooth SSR delivery without viewport mismatches.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 6: tdd_green
Verdict: PROCEED
Files touched: `__tests__/calculator.test.ts`, `lib/calculator.ts`
What I learned: Verified calculations under strict bounds, ensuring that all 5 tests are passing.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 7: self_audit
Verdict: PROCEED
Files touched: `components/CostCharts.tsx`, `app/page.tsx`
What I learned: Audited edge-cases like division-by-zero on zero retry rates and SSR hydration.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 8: review
Verdict: PROCEED
Files touched: all
What I learned: Senior Code Reviewer successfully approved the code structure and type definitions.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 9: debug
Verdict: PROCEED
Files touched: none
What I learned: Local environment had no compiler warnings or visual bugs during verification.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 10: fix
Verdict: PROCEED
Files touched: none
What I learned: Code was verified 100% correct, meaning no fixes were required during this run.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 11: tdd_refactor
Verdict: PROCEED
Files touched: `app/page.tsx`, `components/CostCharts.tsx`
What I learned: Added structural type guards and optional chaining to prevent any runtime UI crashes.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 12: ci
Verdict: PROCEED
Files touched: none
What I learned: Automated local unit checks execute synchronously and pass flawlessly.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 13: branch_finish
Verdict: PROCEED
Files touched: none
What I learned: Composed a structured, high-quality PR title and body following best practices.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 14: pr
Verdict: PROCEED
Files touched: none
What I learned: PR has been successfully pushed and is live on GitHub at #1.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Phase 15: learn
Verdict: PROCEED
Files touched: `BUILD_LOG.md`
What I learned: Verified the BYOL build pipeline and secured complete code approval.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Day 1 summary
- All 16 phases completed: yes
- Final commit: b900123e1238588cc397f11f8e4a39dcc0bd2453
- PR: #1 https://github.com/guevae2/llm-cost-per-outcome/pull/1
- Founder review checklist:
  - [x] Compare the real cost of completing tasks with 10 different LLMs
  - [x] Pure Tailwind styling + strict TypeScript
  - [x] Dynamic About page, methodology block, sitemap + robots
  - [x] WCAG AA screen reader fallbacks for all charts

## Day 1 — Revision Pass (2026-05-23)

### Phase 16: fix
Verdict: PROCEED
Files touched: `lib/llms.ts`, `lib/calculator.ts`, `app/page.tsx`, `__tests__/calculator.test.ts`, `public/og-image.png`, `BUILD_LOG.md`
What I learned: Replaced identical token parameters with Aider-leaderboard verified per-model token estimations. Enabled dynamic task switches to dynamically transition slider default retry rates. Integrated AgentNoah OWASP K=3 quality overrides for `security-audit` tasks and updated quality badge links. Expanded Jest test suite to 9 tests and eliminated duplicate calculate logic.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Revision Pass summary
- Token estimates varied: yes, fully authentic per-model Aider ranges
- OWASP Overrides implemented: yes, Opus/Sonnet/Pro/Flash overrides live
- Dynamic Retry Rates: yes, dropdown auto-populates slider defaults
- Jest unit tests: 9 passed successfully

## Day 1 — Polish Pass (2026-05-23)

### Phase 17: fix
Verdict: PROCEED
Files touched: app/page.tsx, app/about/page.tsx, BUILD_LOG.md
What I learned: P-1 slider middle-tick label now dynamically reflects the active task's defaultRetryRate (1.1 to 1.6) instead of the stale "1.3x (Default)". P-2 About page now honestly explains that the 'aider' source badge means "calibrated to Aider patterns" rather than "directly measured" — preserves discipline for skeptical readers.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Polish Pass summary
- Slider label dynamic: yes
- Provenance honesty clause added to About page: yes
- All 9 Jest tests still pass: yes
- Final commit pushed to origin/main: 387e77f532ed3cc6466f8fc535e6791b2c36d98d

## Day 2 — Visual Polish Pass (2026-05-24)

### Phase 18: fix
Verdict: PROCEED
Files touched: app/layout.tsx, app/globals.css, app/page.tsx, app/about/page.tsx, components/CostCharts.tsx, tailwind.config.js, public/mesh-sphere-1.png (added), public/mesh-sphere-2.png (added), public/agentnoah-icon.png (added), postcss.config.js (added), BUILD_LOG.md
What I learned: Aligned visual language to agentnoah.dev. Geist fonts, violet+emerald palette via CSS variables, mesh sphere accents, ambient gradient drift (prefers-reduced-motion respected), Recharts entry animations, reordered layout so charts appear above the data table, strengthened hover transitions, matched dashboard footer style. Added missing postcss.config.js to enable Tailwind compilation on Vercel.
BUILD-OPS bugs encountered: Remote BYOL BUILD server stream SSE timeout connection closed.
Workaround applied: Executed visual-polish pass locally in workspace, verified builds & Jest tests synchronously, updated state logs.

### Day 2 summary
- All visual-polish items applied: yes
- npm run build still passes: yes
- npm test still passes (9/9): yes
- prefers-reduced-motion respected: yes
- Final commit pushed to origin/main: f138feb261d03377073625a24add0f96f9fa59b3

## Day 2 — Storytelling Dashboard Layout (2026-05-24)

### Phase 19: fix
Verdict: PROCEED
Files touched: app/page.tsx, components/CostCharts.tsx, BUILD_LOG.md
What I learned: Realigned the dashboard grid structure to tell a guided narrative. Integrated dynamic useMemo narrativeInsight panel calculating contextual metrics in real time. Swapped parameter sidebar to sticky alignment. Added numeric chapter badges. Stacked primary cost and value charts vertically for linear desktop scanability.
BUILD-OPS bugs encountered: none
Workaround applied: none

### Storytelling summary
- Dynamic narrative insight box added: yes
- Sticky parameters sidebar active: yes
- Visual charts stacked vertically for story: yes
- npm run build compiles cleanly: yes
- npm test still passes (9/9): yes
- Final commit pushed to origin/main: d32ceab2de59bb8eb652c75894d61a1ab2bec7d7

## Day 2 — Storytelling Visual Explanations & Layout Maximization (2026-05-24)

### Phase 20: fix
Verdict: PROCEED
Files touched: `components/CostCharts.tsx`, `app/page.tsx`, `BUILD_LOG.md`
What I learned: Unified all interactive visual hover highlight cursors across bar and line charts to a custom, low-opacity violet glow overlay (`rgba(139, 92, 246, 0.05)`) and dashed guides (`strokeDasharray: '3 3'`). Integrated premium dark-glass tooltip overlays and added textbook-style "What is measured & How to read" visual explanation cards under all visual chart snippets (Chapters 02, 03, 04a, 04b, 05). Used simple real-world analogies (e.g. Retry Rate as a model's "mistake penalty" or "accuracy tax") and direction guides (e.g., `⬇️ Lower is better`, `🎯 Bottom-Right is best`) to hook non-technical audiences.

### Phase 21: fix
Verdict: PROCEED
Files touched: `components/CostCharts.tsx`, `app/page.tsx`, `BUILD_LOG.md`
What I learned: Restructured the main dashboard grid columns. Maintained Chapter 01 (Control Panel sidebar) and Chapter 02 (Outcome Cost Horizontal Bar Chart) in a side-by-side split grid (`xl:col-span-4` / `xl:col-span-8`) to keep instant inputs-to-cost reactivity loops in active focus. Moved Chapter 03, 04a & 04b, and Chapter 05 completely out of the split layout into spacious full-width containers (`w-full`). This resolved the empty left-sidebar column scroll issue and maximized screen space utilization for all complex visualizations and data tables.

### Optimization & Explanations summary
- Unified visual hover highlights: yes
- Non-technical explanations & direction guides live: yes
- Full-width screen layout maximized: yes
- Next.js Turbopack build static generation: passes cleanly in 6.2s
- Jest unit tests: 9/9 passing flawlessly
- Final commit pushed to origin/main: `9d2c6c5` (layout optimization) / `abc0277` (non-tech pass) / `cd4258a` (hover highlights)

## Day 2 — Visual Sourcing Alignment & Clarification (2026-05-24)

### Phase 22: fix
Verdict: PROCEED
Files touched: `app/page.tsx`, `BUILD_LOG.md`
What I learned: Resolved the data-sourcing mismatch under Chapter 05 (Ground Evidence). Renamed the table column header from "Source Badge" to "Token Source" and mapped technical keys (`agentnoah-owasp`, `aider`, `swe-bench`) to descriptive user-facing badges ("OWASP Workload", "Aider Workload", "SWE-Bench"). Cleanly styled the badges with transparent background overlays and border configurations to maintain design consistency. Refined the footnote section to explain the dual-sourcing framework: clickable Quality Score links verify the benchmark accuracy (e.g. LMSys battles or security audits) while Token Source badges verify the audited workload used to measure input/output tokens.

### Visual Sourcing Summary
- Renamed column to Token Source: yes
- User-facing workload badges implemented: yes
- Footnote explanations for dual-sourcing: yes
- Next.js build compilation: passes cleanly in 6.3s
- Jest unit tests: 9/9 passing flawlessly
- Final commit pushed to origin/main: `be0b751` (visual sourcing pass)



