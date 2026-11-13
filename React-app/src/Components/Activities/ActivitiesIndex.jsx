import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AxiosClient from "../../AxiosClient";

/* ---------- Status: one color + icon per status ---------- */

const STATUS_META = {
    active: {
        label: "Active",
        tone: "green",
        icon: <polyline points="5 12 10 17 19 7" />,
    },
    ongoing: {
        label: "Ongoing",
        tone: "blue",
        icon: (
            <>
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
            </>
        ),
    },
    inactive: {
        label: "Inactive",
        tone: "slate",
        icon: (
            <>
                <line x1="9" y1="6" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="18" />
            </>
        ),
    },
    overdue: {
        label: "Overdue",
        tone: "red",
        icon: (
            <>
                <path d="M12 3L2 20h20z" />
                <line x1="12" y1="10" x2="12" y2="14" />
                <line x1="12" y1="17.5" x2="12" y2="17.6" />
            </>
        ),
    },
};
const statusKey = (s) => (s ?? "").toString().toLowerCase().trim();
const metaOf = (s) =>
    STATUS_META[statusKey(s)] ?? { label: s ?? "-", tone: "other", icon: <circle cx="12" cy="12" r="3" /> };

/* ---------- Date helpers (expiration_date is a plain date) ---------- */

const pad = (n) => String(n).padStart(2, "0");
const toDate = (v) => {
    if (!v) return null;
    const [y, m, d] = String(v).slice(0, 10).split("-").map(Number);
    return y ? new Date(y, m - 1, d) : null;
};
const formatDate = (v) => {
    const d = toDate(v);
    return d ? `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}` : "-";
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

const projectName = (a) =>
    a.project?.title ??
    a.project?.name ??
    (typeof a.project === "string" ? a.project : null) ??
    `Project #${a.project_id}`;

/* page numbers with "..." for long lists */
function getPages(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    const pages = [1];
    const from = Math.max(2, current - 1);
    const to = Math.min(last - 1, current + 1);
    if (from > 2) pages.push("...");
    for (let p = from; p <= to; p++) pages.push(p);
    if (to < last - 1) pages.push("...");
    pages.push(last);
    return pages;
}

/* ---------- Illustrations (same blue style as the other pages) ---------- */

function HeroArt() {
    return (
        <svg viewBox="0 0 300 220" className="ac-hero-art" aria-hidden="true">
            <path
                d="M40 120c-8-48 24-92 80-100 58-8 118 14 130 66 11 48-20 96-76 108-58 12-124-24-134-74z"
                fill="#d6e9fb"
            />
            <circle cx="262" cy="40" r="10" fill="#bcdcf8" />
            <circle cx="34" cy="188" r="7" fill="#ffd36b" />
            {/* calendar */}
            <rect x="76" y="40" width="148" height="132" rx="16" fill="#fff" />
            <rect x="76" y="40" width="148" height="34" rx="16" fill="#4a9ee8" />
            <rect x="76" y="58" width="148" height="16" fill="#4a9ee8" />
            <rect x="104" y="30" width="8" height="22" rx="4" fill="#1f6fc2" />
            <rect x="188" y="30" width="8" height="22" rx="4" fill="#1f6fc2" />
            {/* task rows */}
            <circle cx="104" cy="96" r="7" fill="#3fbf9a" />
            <path d="M100.5 96l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="120" y="92" width="80" height="8" rx="4" fill="#d6e9fb" />
            <circle cx="104" cy="120" r="7" fill="#4a9ee8" />
            <rect x="120" y="116" width="60" height="8" rx="4" fill="#d6e9fb" />
            <circle cx="104" cy="144" r="7" fill="#f26b5b" />
            <rect x="120" y="140" width="70" height="8" rx="4" fill="#d6e9fb" />
            {/* clock badge */}
            <circle cx="222" cy="164" r="24" fill="#1f6fc2" />
            <circle cx="222" cy="164" r="14" fill="none" stroke="#fff" strokeWidth="3" />
            <path d="M222 156v8l6 4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function EmptyArt() {
    return (
        <svg viewBox="0 0 200 150" width="170" aria-hidden="true">
            <path
                d="M24 78c-4-30 16-56 50-60 36-5 72 8 80 40 7 30-12 58-48 66-36 7-76-14-82-46z"
                fill="#d6e9fb"
            />
            <circle cx="92" cy="70" r="26" fill="#fff" stroke="#4a9ee8" strokeWidth="8" />
            <line x1="112" y1="90" x2="140" y2="118" stroke="#1f6fc2" strokeWidth="10" strokeLinecap="round" />
            <circle cx="164" cy="34" r="6" fill="#bcdcf8" />
            <circle cx="30" cy="120" r="5" fill="#ffd36b" />
        </svg>
    );
}

export default function ActivitiesIndex() {
    const { pathname } = useLocation();
    const isAdmin = pathname.startsWith("/admin-panel");

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [query, setQuery] = useState("");

    const fetchData = (page = 1) => {
        setIsLoading(true);
        AxiosClient.get(`/activities?page=${page}`)
            .then(({ data }) => {
                const rec = data.records ?? data;
                const rows = Array.isArray(rec) ? rec : rec.data ?? [];
                setActivities(rows);
                setTotal(rec.total ?? rows.length);
                setMeta({
                    current_page: rec.current_page ?? 1,
                    last_page: rec.last_page ?? 1,
                });
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const goToPage = (page) => {
        if (page < 1 || page > meta.last_page || page === meta.current_page) return;
        fetchData(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* search through the activities already loaded on this page */
    const q = query.trim().toLowerCase();
    const filtered = q
        ? activities.filter((a) =>
              `${a.id} ${a.title ?? ""} ${a.description ?? ""} ${a.status ?? ""} ${projectName(a)} ${formatDate(a.expiration_date)}`
                  .toLowerCase()
                  .includes(q),
          )
        : activities;

    const countOf = (key) => activities.filter((a) => statusKey(a.status) === key).length;

    return (
        <main className="ac-page">
            {/* Hero */}
            <section className="ac-hero">
                <div>
                    <h1>Activities</h1>
                    <p>
                        {total} {total === 1 ? "activity" : "activities"} across your projects.
                        Keep an eye on what is active, ongoing or overdue.
                    </p>
                </div>
                <HeroArt />
            </section>

            {/* Stat cards, one color per status */}
            <section className="ac-stats" aria-label="Summary">
                <div className="ac-stat ac-stat--green">
                    <span className="ac-stat-num">{countOf("active")}</span>
                    <span className="ac-stat-label">Active</span>
                </div>
                <div className="ac-stat ac-stat--blue">
                    <span className="ac-stat-num">{countOf("ongoing")}</span>
                    <span className="ac-stat-label">Ongoing</span>
                </div>
                <div className="ac-stat ac-stat--slate">
                    <span className="ac-stat-num">{countOf("inactive")}</span>
                    <span className="ac-stat-label">Inactive</span>
                </div>
                <div className="ac-stat ac-stat--red">
                    <span className="ac-stat-num">{countOf("overdue")}</span>
                    <span className="ac-stat-label">Overdue</span>
                </div>
            </section>

            <section className="ac-card">
                {/* Toolbar */}
                <div className="ac-toolbar">
                    <label className="ac-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.5" y2="16.5" />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search activities"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                                ×
                            </button>
                        )}
                    </label>

                    <span className="ac-result">
                        {filtered.length} of {activities.length} shown
                    </span>

                    <div className="ac-spacer" />

                    {isAdmin && (
                        <Link to="/admin-panel/activities/create" className="ac-btn">
                            New activity
                        </Link>
                    )}
                </div>

                {/* Table */}
                <div className="ac-table-wrap">
                    <table className="ac-table">
                        <thead>
                            <tr>
                                <th className="ac-th-id">ID</th>
                                <th>Activity</th>
                                <th>Status</th>
                                <th>Project</th>
                                <th>Expires</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading &&
                                Array.from({ length: 6 }, (_, i) => (
                                    <tr key={i} className="ac-skeleton">
                                        <td><div className="ac-sk ac-sk--sm" /></td>
                                        <td><div className="ac-sk ac-sk--wide" /></td>
                                        <td><div className="ac-sk ac-sk--pill" /></td>
                                        <td><div className="ac-sk ac-sk--mid" /></td>
                                        <td><div className="ac-sk ac-sk--mid" /></td>
                                    </tr>
                                ))}

                            {!isLoading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="ac-empty">
                                            <EmptyArt />
                                            <h3>{q ? "No activities match your search" : "No activities yet"}</h3>
                                            <p>{q ? "Try a different word." : "New activities will show up here."}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                filtered.map((a) => {
                                    const m = metaOf(a.status);
                                    const left = daysLeft(a.expiration_date);
                                    return (
                                        <tr key={a.id}>
                                            <td className="ac-id">#{a.id}</td>
                                            <td>
                                                <div className="ac-activity">
                                                    <span className={`ac-icon ac-icon--${m.tone}`}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            {m.icon}
                                                        </svg>
                                                    </span>
                                                    <div className="ac-activity-text">
                                                        <strong>{a.title}</strong>
                                                        <p>{a.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`ac-badge ac-badge--${m.tone}`}>{m.label}</span>
                                            </td>
                                            <td>
                                                <span className="ac-project">{projectName(a)}</span>
                                            </td>
                                            <td>
                                                <div className="ac-date">
                                                    <span>{formatDate(a.expiration_date)}</span>
                                                    {left !== null && (
                                                        <small className={dueTone(left)}>{dueText(left)}</small>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <nav className="ac-pagination" aria-label="Activities pagination">
                        <button
                            type="button"
                            className="ac-page-btn"
                            onClick={() => goToPage(meta.current_page - 1)}
                            disabled={meta.current_page <= 1}
                        >
                            Previous
                        </button>

                        {getPages(meta.current_page, meta.last_page).map((p, i) =>
                            p === "..." ? (
                                <span key={`dots-${i}`} className="ac-dots">...</span>
                            ) : (
                                <button
                                    type="button"
                                    key={p}
                                    className={`ac-page-btn${p === meta.current_page ? " is-active" : ""}`}
                                    onClick={() => goToPage(p)}
                                    aria-label={`Page ${p}`}
                                    aria-current={p === meta.current_page ? "page" : undefined}
                                >
                                    {p}
                                </button>
                            ),
                        )}

                        <button
                            type="button"
                            className="ac-page-btn"
                            onClick={() => goToPage(meta.current_page + 1)}
                            disabled={meta.current_page >= meta.last_page}
                        >
                            Next
                        </button>
                    </nav>
                )}
            </section>
        </main>
    );
}
