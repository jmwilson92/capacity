/**
 * Production lead-time rules.
 * Ordering: 1h per job, 6 weeks before kitting start.
 * Kitting: 1h per kit, 3 days before job start.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CapacityLeadTimes = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ORDERING_HOURS = 1;
  const ORDERING_WEEKS_BEFORE_KIT = 6;
  const KITTING_HOURS_PER_KIT = 1;
  const KITTING_DAYS_BEFORE_JOB = 3;

  const ROLES = {
    ordering: {
      id: "wc_ordering",
      name: "Ordering",
      role: "ordering",
      notes: "1h per job · 6 weeks before kitting start",
      color: "#1d4e89"
    },
    kitting: {
      id: "wc_kitting",
      name: "Kitting",
      role: "kitting",
      notes: "1h per kit · 3 days before job start",
      color: "#8a3b12"
    }
  };

  function num(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function parseDate(value) {
    if (rootCalc() && rootCalc().parseDate) return rootCalc().parseDate(value);
    if (!value) return null;
    const s = String(value);
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  function formatISO(date) {
    if (rootCalc() && rootCalc().formatISO) return rootCalc().formatISO(date);
    if (!date) return "";
    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + mo + "-" + d;
  }

  function addDays(date, n) {
    if (rootCalc() && rootCalc().addDays) return rootCalc().addDays(date, n);
    const d = parseDate(date);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + Number(n));
  }

  function rootCalc() {
    return typeof CapacityCalc !== "undefined" ? CapacityCalc : null;
  }

  function jobStart(wo) {
    return parseDate(wo && (wo.startDate || wo.dueDate));
  }

  function kitCount(wo) {
    const kits = num(wo && wo.kitQty, NaN);
    if (Number.isFinite(kits) && kits > 0) return kits;
    return 1;
  }

  function kittingStart(wo) {
    const start = jobStart(wo);
    if (!start) return null;
    return addDays(start, -KITTING_DAYS_BEFORE_JOB);
  }

  function orderingStart(wo) {
    const kit = kittingStart(wo);
    if (!kit) return null;
    return addDays(kit, -(ORDERING_WEEKS_BEFORE_KIT * 7));
  }

  function kittingHours(wo) {
    return kitCount(wo) * KITTING_HOURS_PER_KIT;
  }

  function orderingHours() {
    return ORDERING_HOURS;
  }

  function findRoleCenter(centers, role) {
    const list = centers || [];
    return (
      list.find(function (c) {
        return c && c.role === role;
      }) ||
      list.find(function (c) {
        return String(c.name || "").toLowerCase() === role;
      }) ||
      null
    );
  }

  function ensureRoleCenters(centers) {
    const next = (centers || []).slice();
    Object.keys(ROLES).forEach(function (role) {
      if (!findRoleCenter(next, role)) next.push(Object.assign({}, ROLES[role]));
    });
    return next;
  }

  function shadowOrders(wo, centers) {
    if (!wo || wo.status === "complete") return [];
    const kitWc = findRoleCenter(centers, "kitting");
    const ordWc = findRoleCenter(centers, "ordering");
    const out = [];
    const kitDate = kittingStart(wo);
    const ordDate = orderingStart(wo);
    if (kitWc && kitDate) {
      out.push({
        id: String(wo.id) + "_kit",
        number: String(wo.number || "") + "-KIT",
        title: "Kit " + (wo.title || wo.number || ""),
        workCenterId: kitWc.id,
        hours: kittingHours(wo),
        remainingHours: kittingHours(wo),
        dueDate: formatISO(kitDate),
        status: wo.status || "queued",
        priority: wo.priority || "medium",
        notes: "Auto: 1h/kit, 3 days before job start",
        generatedFrom: wo.id,
        role: "kitting"
      });
    }
    if (ordWc && ordDate) {
      out.push({
        id: String(wo.id) + "_ord",
        number: String(wo.number || "") + "-ORD",
        title: "Order material · " + (wo.title || wo.number || ""),
        workCenterId: ordWc.id,
        hours: orderingHours(wo),
        remainingHours: orderingHours(wo),
        dueDate: formatISO(ordDate),
        status: wo.status || "queued",
        priority: wo.priority || "medium",
        notes: "Auto: 1h, 6 weeks before kitting start",
        generatedFrom: wo.id,
        role: "ordering"
      });
    }
    return out;
  }

  function expandWorkOrders(data) {
    const centers = ensureRoleCenters((data && data.workCenters) || []);
    const source = (data && data.workOrders) || [];
    const generated = [];
    source.forEach(function (wo) {
      if (wo.generatedFrom) return;
      shadowOrders(wo, centers).forEach(function (row) {
        generated.push(row);
      });
    });
    return {
      workCenters: centers,
      workOrders: source.concat(generated)
    };
  }

  return {
    ORDERING_HOURS: ORDERING_HOURS,
    ORDERING_WEEKS_BEFORE_KIT: ORDERING_WEEKS_BEFORE_KIT,
    KITTING_HOURS_PER_KIT: KITTING_HOURS_PER_KIT,
    KITTING_DAYS_BEFORE_JOB: KITTING_DAYS_BEFORE_JOB,
    ROLES: ROLES,
    jobStart: jobStart,
    kitCount: kitCount,
    kittingStart: kittingStart,
    orderingStart: orderingStart,
    kittingHours: kittingHours,
    orderingHours: orderingHours,
    findRoleCenter: findRoleCenter,
    ensureRoleCenters: ensureRoleCenters,
    shadowOrders: shadowOrders,
    expandWorkOrders: expandWorkOrders
  };
});
