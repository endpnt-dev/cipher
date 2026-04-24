# BUGS.md — Cipher API Bug Tracker

**Scope:** Bugs specific to the Cipher API (`cipher.endpnt.dev`). Cross-cutting bugs live at `../BUGS.md`.

**ID prefix:** `CI-NNN` (sequential, do not reuse).

**Last updated:** 2026-04-24 (created by first biweekly code health audit).

---

## Open bugs

### CI-001 — Free-tier rate limit discrepancy: CLAUDE.md says 1,000/month, config enforces 100/month

- **Severity:** Medium (pre-launch blocker — one of them is wrong)
- **Files:** `CLAUDE.md`, `lib/config.ts`
- **Discovered:** 2026-04-24 (biweekly code health audit)
- **Symptom:** `CLAUDE.md` states: "Free tier is 1,000 operations/month, NOT 100." The actual `lib/config.ts` `TIER_LIMITS.free.requests_per_month` is `100`. These contradict each other — the rate limiter enforces the config value (100), not the CLAUDE.md claim (1,000).
- **Root cause:** Either (a) the config was not updated when a decision was made to give cipher a higher free tier, or (b) the CLAUDE.md was written with an aspirational free-tier limit that was never implemented in config.
- **Impact:** Free-tier cipher users are limited to 100 operations/month. If the intent was 1,000/month (to match the complexity of crypto operations vs. simpler APIs), free users are being under-served. If 100 is correct, the CLAUDE.md is misleading future CC sessions into believing the config should be 1,000. Either way, one of these values is wrong.
- **Fix approach:**
  1. Determine the correct free-tier limit for cipher — check `web/lib/pricing.ts` for what the marketing site promises.
  2. If the limit should be 1,000: update `lib/config.ts` `TIER_LIMITS.free.requests_per_month` to 1000.
  3. If the limit should be 100: update `CLAUDE.md` to remove the "NOT 100" claim.
  4. Ensure `web/lib/pricing.ts` matches whatever is enforced.
- **Status:** Open. Resolve before launch — pricing must match enforcement.

---

## Resolved bugs

*(None resolved yet — file created 2026-04-24.)*

---

## Bug entry template

```markdown
### CI-XXX — [Short descriptive title]

- **Severity:** Critical | High | Medium | Low
- **File:** [path]
- **Discovered:** [YYYY-MM-DD, context]
- **Symptom:** [observable behavior]
- **Root cause:** [best-known explanation]
- **Impact:** [customer/security risk]
- **Fix approach:** [high-level plan]
- **Cross-reference:** [related bugs if any]
- **Status:** Open | In progress | Awaiting deployment
```
