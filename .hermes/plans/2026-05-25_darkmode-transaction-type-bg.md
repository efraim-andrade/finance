# Fix: Dark mode selected transaction type background

## Goal

Fix the Despesa/Receita toggle buttons in the New Transaction modal so the selected option has a dark background in dark mode (currently stays white/light gray).

## Current Context

- **File:** `frontend/src/components/new-transaction-modal/index.tsx` (lines 176-212)
- **Bug:** When a transaction type (Despesa or Receita) is selected, the background is always `bg-gray-100` with `text-gray-900` regardless of theme. In dark mode this appears as a white/light pill on a dark surface — should be a darker surface.
- **Dark mode strategy:** Class-based `.dark` on `<html>`, Tailwind `dark:` prefix. Configured in `styles.css` line 3: `@custom-variant dark (&:where(.dark, .dark *))`.
- **Edit modal** (`edit-transaction-modal/index.tsx`) uses a `<Select>` dropdown for type, not toggle buttons — not affected.

## Root Cause

Lines 181-183 (Despesa) and 200-201 (Receita):
```
type === "EXPENSE"
  ? "border border-red-base bg-gray-100 text-gray-900"
  : "border border-transparent text-gray-500"
```

`bg-gray-100` is `#f8f9fa` — always light. No `dark:` variant.

## Proposed Approach

Add `dark:` background and text colors to the selected state of each button:

- **Despesa selected (EXPENSE):**
  - Light: `border border-red-base bg-gray-100 text-gray-900` (unchanged)
  - Dark: `dark:bg-red-900/40 dark:text-red-light` (dark red-tinted surface, light red text)

- **Receita selected (INCOME):**
  - Light: `border border-green-base bg-gray-100 text-gray-900` (unchanged)
  - Dark: `dark:bg-green-900/40 dark:text-green-light` (dark green-tinted surface, light green text)

- **Unselected (both):**
  - Light: `border border-transparent text-gray-500` (unchanged)
  - Dark: `dark:text-gray-400` (slightly lighter muted for dark contrast)

## Step-by-Step Plan

1. **Edit** `frontend/src/components/new-transaction-modal/index.tsx`
   - Update the Despesa button's `cn()` selected classes (line 181-183) to include dark variants
   - Update the Receita button's `cn()` selected classes (line 200-201) to include dark variants
   - Update unselected classes for both buttons to include `dark:text-gray-400`

2. **Verify** visually by running `pnpm dev`, toggling dark mode, and opening the new transaction modal

3. **Run** `pnpm check` (Biome lint + format) to ensure no style issues

4. **Run** `pnpm test` to confirm no regressions

## Files Likely to Change

| File | Change |
|---|---|
| `frontend/src/components/new-transaction-modal/index.tsx` | Add `dark:` bg + text classes to selected Despesa/Receita buttons |

## Tests / Validation

- Visual: toggle dark mode, open modal, select Despesa → should show dark red-tinted bg; select Receita → dark green-tinted bg
- `pnpm check` passes
- `pnpm test` passes

## Risks / Tradeoffs

- Low risk — purely cosmetic class changes, no logic
- Using `bg-red-900/40` / `bg-green-900/40` (Tailwind opacity syntax) keeps the tint subtle; if those exact shades don't exist in the custom theme, fallback to `dark:bg-gray-800` with the colored border/text providing the semantic cue

## Open Questions

- Should the dark bg use the project's custom semantic tokens (`--color-red-light` / `--color-green-light` as bg at low opacity) or standard Tailwind `red-900/40`? Recommendation: use `dark:bg-gray-800` for the surface + keep the colored border, since the project defines custom color tokens and `red-900` may not map to the design system.
