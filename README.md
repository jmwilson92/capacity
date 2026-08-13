# Capacity Tracker

A shop-floor capacity tool you can drop on a SharePoint page. Create work centers, keep employees on a roster, assign them to a center, and log PTO or sick time on each person’s file. Work orders with a due date and hours then load against the hours that are actually available that week.

## What it calculates

**A person’s available hours in a week** = (hours per week − PTO/sick hours that week) × efficiency %. Weekends are skipped unless you turn on **Works weekends** on the employee or **Include Saturday and Sunday** on that time-off row. Leave hours blank on a time-off row to count full work days.

**Work center capacity** for a week = sum of assigned employees’ available hours that week. Unassigned employees do not add capacity.

**Load** = remaining hours on work orders that are not marked complete. On-hold work still reserves time.

Hours are booked either:

- **Due week** (default) — the whole job lands in the week of the projected due date
- **Spread** — hours are split evenly from this week through the due week

Red on the planning board means that week is over 100%. Overdue work is called out separately and is not hidden inside a future week.

## Use it

Open `index.html` in a browser, or from this folder:

```bash
npm start
```

Then visit [http://localhost:8080](http://localhost:8080).

1. Create a **work center** (Welding, CNC, Assembly, …).
2. Open **Employees**, add people to the roster, and assign a work center from the dropdown. Hours per week and efficiency live on the employee.
3. Open an **employee file** to log PTO or sick days. Those hours drop out of that week’s capacity on the planning board.
4. **Add work orders** with a projected due date and hours to complete. Reduce hours remaining as the job runs. Mark it done to free the capacity.
5. Use **Planning** for the week-by-week load vs capacity grid.

**Load sample shop** on the empty dashboard if you want to click around on realistic numbers first.

Data stays in this browser until you export a JSON backup or connect SharePoint lists.

## Put it on SharePoint

Locked tenants (including `sharepoint.us`) will **download** HTML from Documents instead of running it. Shared data belongs in **SharePoint lists**, not in a file.

1. Read [sharepoint/READ-THIS-FIRST.txt](sharepoint/READ-THIS-FIRST.txt).
2. Create the four lists: run `sharepoint/New-CapacityLists.ps1`, or follow [sharepoint/CREATE-LISTS-IN-THE-BROWSER.txt](sharepoint/CREATE-LISTS-IN-THE-BROWSER.txt).
3. Put those lists on one page (or run `sharepoint/New-CapacityPage.ps1`).
4. To get the full planning-board UI on that page, send [sharepoint/IT-REQUEST.txt](sharepoint/IT-REQUEST.txt) to IT.

## Project layout

| Path | Role |
| --- | --- |
| `CapacityTracker.html` | Single-file app to upload to SharePoint Documents |
| `index.html` / `index.aspx` | Local / multi-file shell |
| `css/app.css` | Layout and theme |
| `js/calc.js` | Capacity math |
| `js/store.js` | Local save / import / sample data |
| `js/sharepoint.js` | SharePoint REST lists |
| `js/app.js` | Screens and forms |
| `tests/calc.test.js` | Calculation tests |

```bash
npm test
```
