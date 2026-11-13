import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AxiosClient from "../../AxiosClient";
import Icon from "./AdminIcons";

/* ---------- What to show on the stat cards ---------- */
const STATS = [
    { key: "projects", label: "Projects", tone: "purple" },
    { key: "reports", label: "Reports", tone: "rose" },
    { key: "activities", label: "Activities", tone: "indigo" },
    { key: "products", label: "Products", tone: "amber" },
    { key: "features", label: "Features", tone: "teal" },
    { key: "users", label: "Users", tone: "slate" },
];

const QUICK = [
    { to: "/admin-panel/projects/create", label: "New project" },
    { to: "/admin-panel/activities/create", label: "New activity" },
    { to: "/admin-panel/products/create", label: "New product" },
    { to: "/admin-panel/features/create", label: "New feature" },
    { to: "/admin-panel/users/create", label: "New user" },
];

/* ---------- Helpers ---------- */

const statusKey = (s) => (s ?? "").toString().toLowerCase().trim().replace(/\s+/g, "-");
const TONES = {
    approved: "green",
    active: "green",
    ongoing: "blue",
    "in-review": "amber",
    draft: "slate",
    inactive: "slate",
    overdue: "red",
};
const toneOf = (s) => TONES[statusKey(s)] ?? "purple";
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "-");

const toDate = (v) => {
    if (!v) return null;
    const [y, m, d] = String(v).slice(0, 10).split("-").map(Number);
    return y ? new Date(y, m - 1, d) : null;
};
const daysLeft = (v) => {
    const d = toDate(v);
    if (!d) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((d - today) / 86400000);
};
const dueText = (n) => {
    if (n === null) return "";
    if (n < 0) return `${-n} day${-n === 1 ? "" : "s"} overdue`;
    if (n === 0) return "Due today";
    return `${n} day${n === 1 ? "" : "s"} left`;
};
const dueTone = (n) => (n === null ? "" : n < 0 ? "is-late" : n <= 3 ? "is-soon" : "");

const projectName = (x) =>
    x.project?.title ??
    x.project?.name ??
    (typeof x.project === "string" ? x.project : null) ??
    (x.project_id ? `Project #${x.project_id}` : "-");

const pad = (n) => String(n).padStart(2, "0");
const formatDate = (v) => {
    const d = toDate(v);
    return d ? `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}` : "-";
};

/* numbers that count up smoothly when they change */
function useCountUp(target, duration = 800) {
    const [value, setValue] = useState(0);
    const prev = useRef(0);
    useEffect(() => {
        let raf;
        const from = prev.current;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(from + (target - from) * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
            else prev.current = target;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target]);
    return value;
}

function StatCard({ stat, value, onClick }) {
    const shown = useCountUp(value ?? 0);
    const Tag = onClick ? "button" : "div";
    return (
        <Tag type={onClick ? "button" : undefined} className={`db-stat db-tone--${stat.tone}`} onClick={onClick}>
            <span className="db-stat-icon">
                <Icon name={stat.key} />
            </span>
            <span className="db-stat-body">
                {value === null ? <i className="db-sk db-sk--num" /> : <strong>{shown}</strong>}
                <small>{stat.label}</small>
            </span>
            {onClick && (
                <span className="db-stat-go">
                    <Icon name="arrow" size={16} />
                </span>
            )}
        </Tag>
    );
}

const readRecords = (data) => {
    const rec = data.records ?? data;
    const rows = Array.isArray(rec) ? rec : rec.data ?? [];
    const total = rec.total ?? rows.length;
    return { rows, total };
};

function Dashboard({ onNavigate }) {
    const [data, setData] = useState(null); // { counts, rows }
    const [refreshing, setRefreshing] = useState(false);
    const [updatedAt, setUpdatedAt] = useState(null);
    const [failed, setFailed] = useState(false);

    const load = () => {
        setRefreshing(true);
        Promise.allSettled(STATS.map((s) => AxiosClient.get(`/${s.key}`)))
            .then((results) => {
                const counts = {};
                const rows = {};
                let ok = 0;
                results.forEach((res, i) => {
                    const key = STATS[i].key;
                    if (res.status === "fulfilled") {
                        const r = readRecords(res.value.data);
                        counts[key] = r.total;
                        rows[key] = r.rows;
                        ok++;
                    } else {
                        counts[key] = 0;
                        rows[key] = [];
                    }
                });
                setFailed(ok === 0);
                setData({ counts, rows });
                setUpdatedAt(new Date());
            })
            .finally(() => setRefreshing(false));
    };

    useEffect(() => {
        load();
        const timer = setInterval(load, 60000); // refresh every minute
        return () => clearInterval(timer);
    }, []);

    const go = (key) => (onNavigate ? () => onNavigate(key) : undefined);

    /* upcoming deadlines: nearest expiration first (overdue ones come first) */
    const activities = data?.rows.activities ?? [];
    const upcoming = activities
        .filter((a) => statusKey(a.status) !== "inactive" && a.expiration_date)
        .sort((a, b) =>
            String(a.expiration_date).slice(0, 10).localeCompare(String(b.expiration_date).slice(0, 10)),
        )
        .slice(0, 5);

    /* activity status breakdown */
    const BREAKDOWN = [
        { key: "active", label: "Active", tone: "green" },
        { key: "ongoing", label: "Ongoing", tone: "blue" },
        { key: "inactive", label: "Inactive", tone: "slate" },
        { key: "overdue", label: "Overdue", tone: "red" },
    ].map((b) => ({ ...b, count: activities.filter((a) => statusKey(a.status) === b.key).length }));
    const breakdownTotal = BREAKDOWN.reduce((sum, b) => sum + b.count, 0);

    const latestReports = (data?.rows.reports ?? []).slice(0, 5);

    return (
        <div className="db">
            {/* Heading */}
            <div className="db-head">
                <div>
                    <h2>Overview</h2>
                    <p>
                        Preparation of our events all over the world, and the progress analysis
                        regarding our sales department.
                    </p>
                </div>
                <div className="db-head-actions">
                    {updatedAt && (
                        <span className="db-updated">
                            Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )}
                    <button type="button" className="db-refresh" onClick={load} disabled={refreshing}>
                        <span className={refreshing ? "is-spinning" : ""}>
                            <Icon name="refresh" size={16} />
                        </span>
                        Refresh
                    </button>
                </div>
            </div>

            {failed && (
                <p className="db-alert">Couldn't load the numbers. Check your connection and press Refresh.</p>
            )}

            {/* Stat cards */}
            <section className="db-stats" aria-label="Totals">
                {STATS.map((s) => (
                    <StatCard
                        key={s.key}
                        stat={s}
                        value={data ? data.counts[s.key] : null}
                        onClick={go(s.key)}
                    />
                ))}
            </section>

            <section className="db-grid">
                {/* Upcoming deadlines */}
                <article className="db-panel">
                    <div className="db-panel-head">
                        <h3>Upcoming deadlines</h3>
                        {onNavigate && (
                            <button type="button" className="db-link" onClick={() => onNavigate("activities")}>
                                View all
                            </button>
                        )}
                    </div>

                    {!data && (
                        <div className="db-list">
                            {[1, 2, 3].map((i) => <i key={i} className="db-sk db-sk--row" />)}
                        </div>
                    )}

                    {data && upcoming.length === 0 && (
                        <p className="db-none">Nothing due soon. Nice and calm.</p>
                    )}

                    {data && upcoming.length > 0 && (
                        <ul className="db-list">
                            {upcoming.map((a) => {
                                const left = daysLeft(a.expiration_date);
                                return (
                                    <li key={a.id} className="db-row">
                                        <span className={`db-dot db-tone--${toneOf(a.status)}`}>
                                            <Icon name="activities" size={18} />
                                        </span>
                                        <div className="db-row-text">
                                            <strong>{a.title}</strong>
                                            <small>{projectName(a)}</small>
                                        </div>
                                        <div className="db-row-end">
                                            <span className={`db-badge db-badge--${toneOf(a.status)}`}>
                                                {capitalize(a.status)}
                                            </span>
                                            <small className={dueTone(left)}>{dueText(left)}</small>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </article>

                <div className="db-side">
                    {/* Status breakdown */}
                    <article className="db-panel">
                        <div className="db-panel-head">
                            <h3>Activity status</h3>
                        </div>
                        <div className="db-bar" role="img" aria-label="Activity status breakdown">
                            {breakdownTotal > 0 &&
                                BREAKDOWN.filter((b) => b.count > 0).map((b) => (
                                    <span
                                        key={b.key}
                                        className={`db-seg db-seg--${b.tone}`}
                                        style={{ width: `${(b.count / breakdownTotal) * 100}%` }}
                                        title={`${b.label}: ${b.count}`}
                                    />
                                ))}
                        </div>
                        <ul className="db-legend">
                            {BREAKDOWN.map((b) => (
                                <li key={b.key}>
                                    <i className={`db-seg--${b.tone}`} />
                                    {b.label}
                                    <strong>{b.count}</strong>
                                </li>
                            ))}
                        </ul>
                    </article>

                    {/* Quick actions */}
                    <article className="db-panel">
                        <div className="db-panel-head">
                            <h3>Quick actions</h3>
                        </div>
                        <div className="db-quick">
                            {QUICK.map((q) => (
                                <Link key={q.to} to={q.to}>
                                    <Icon name="plus" size={16} />
                                    {q.label}
                                </Link>
                            ))}
                        </div>
                    </article>
                </div>
            </section>

            {/* Latest reports */}
            <article className="db-panel">
                <div className="db-panel-head">
                    <h3>Latest reports</h3>
                    {onNavigate && (
                        <button type="button" className="db-link" onClick={() => onNavigate("reports")}>
                            View all
                        </button>
                    )}
                </div>

                {!data && <i className="db-sk db-sk--row" />}

                {data && latestReports.length === 0 && <p className="db-none">No reports yet.</p>}

                {data && latestReports.length > 0 && (
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Project</th>
                                    <th>Modified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestReports.map((r) => (
                                    <tr key={r.id}>
                                        <td><strong>{r.title}</strong></td>
                                        <td className="db-cap">{r.type}</td>
                                        <td>
                                            <span className={`db-badge db-badge--${toneOf(r.status)}`}>
                                                {capitalize(r.status)}
                                            </span>
                                        </td>
                                        <td>{projectName(r)}</td>
                                        <td className="db-muted">{r.updated_at ? formatDate(r.updated_at) : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </article>
        </div>
    );
}

export default Dashboard;
