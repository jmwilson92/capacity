# Production work centers and lead times

Create these two work centers on the Work centers tab if they are not already on the board:

| Work center | Standard hours | When it loads |
| --- | --- | --- |
| **Ordering** | 1 hour per job | 6 weeks before kitting start |
| **Kitting** | 1 hour per kit | 3 days before job start |

## How the dates chain

1. Job start = work order `startDate`, or the projected due date if start is blank.
2. Kitting start = job start minus **3 calendar days**. Hours = `kitQty` (default 1) × 1h.
3. Ordering start = kitting start minus **6 weeks** (42 days). Hours = 1h.

Example: job starts Monday 12 Oct.

- Kitting lands Friday 9 Oct (1h × kits).
- Ordering lands Friday 28 Aug (1h).

Set planning horizon to **12 or 16 weeks** so ordering load is visible.

## In the app

- **New work center** still creates any shop cell (weld, assembly, …).
- Naming a center `Ordering` or `Kitting` (or setting `role` in JSON) turns on the auto-load rules.
- On a work order JSON record use `kitQty` and optional `startDate`:

```json
{
  "number": "WO-2104",
  "title": "E-2 harness kit",
  "workCenterId": "wc_assy",
  "hours": 16,
  "startDate": "2026-10-12",
  "dueDate": "2026-10-16",
  "kitQty": 4,
  "status": "queued"
}
```

That job reserves 4h on Kitting (9 Oct) and 1h on Ordering (28 Aug) without extra work orders on the form.

Math lives in `js/leadtimes.js` (`CapacityLeadTimes`). Planning still uses `CapacityCalc.summarize` on the expanded order list.
