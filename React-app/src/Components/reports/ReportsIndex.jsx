import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosClient from "../../AxiosClient";
import ReportsForm from "./ReportsForm";

/* ---------- Illustrations (same blue style as the modal) ---------- */

function HeroArt() {
    return (
        <svg viewBox="0 0 300 220" className="rt-hero-art" aria-hidden="true">
            <path
                d="M40 120c-8-48 24-92 80-100 58-8 118 14 130 66 11 48-20 96-76 108-58 12-124-24-134-74z"
                fill="#d6e9fb"
            />
            <circle cx="262" cy="40" r="10" fill="#bcdcf8" />
            <circle cx="34" cy="188" r="7" fill="#bcdcf8" />
            {/* back sheet */}
            <rect x="92" y="38" width="124" height="150" rx="12" fill="#a9d1f5" transform="rotate(-7 154 113)" />
            {/* main sheet */}
            <rect x="100" y="30" width="124" height="150" rx="12" fill="#fff" />
            <rect x="116" y="48" width="52" height="9" rx="4.5" fill="#4a9ee8" />
            <rect x="116" y="65" width="84" height="5" rx="2.5" fill="#d6e9fb" />
            <rect x="116" y="77" width="66" height="5" rx="2.5" fill="#d6e9fb" />
            {/* bars */}
            <rect x="118" y="130" width="18" height="34" rx="4" fill="#a9d1f5" />
            <rect x="142" y="110" width="18" height="54" rx="4" fill="#4a9ee8" />
            <rect x="166" y="94" width="18" height="70" rx="4" fill="#1f6fc2" />
            {/* check badge */}
            <circle cx="224" cy="168" r="22" fill="#1f6fc2" />
            <path
                d="M214 168l7 7 13-14"
                stroke="#fff"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
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
            <circle cx="30" cy="120" r="5" fill="#bcdcf8" />
        </svg>
    );
}

/* ---------- Small icons ---------- */

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
);

/* report = solid document, sheet = outlined grid */
const TypeIcon = ({ type }) =>
    type === "report" ? (
        <svg width="20" height="24" viewBox="0 0 18 22" aria-hidden="true">
            <path d="M2 1H12L16 5V21H2V1Z" fill="#4a9ee8" />
            <path d="M12 1L16 5H12V1Z" fill="#bcdcf8" />
            <line x1="5" y1="11" x2="13" y2="11" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="5" y1="15" x2="11" y2="15" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    ) : (
        <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
            <rect x="1" y="1" width="18" height="22" rx="3" fill="#f1f8ff" stroke="#4a9ee8" strokeWidth="1.4" />
            <line x1="1" y1="9" x2="19" y2="9" stroke="#bcdcf8" strokeWidth="1.2" />
            <line x1="1" y1="15" x2="19" y2="15" stroke="#bcdcf8" strokeWidth="1.2" />
            <line x1="10" y1="9" x2="10" y2="23" stroke="#bcdcf8" strokeWidth="1.2" />
        </svg>
    );

/* ---------- Status badge: one color per status ---------- */

const KNOWN_STATUSES = ["approved", "in-review", "draft"];
const statusKey = (s) => (s ?? "").toString().toLowerCase().trim().replace(/\s+/g, "-");
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const StatusBadge = ({ status }) => {
    const key = statusKey(status);
    const variant = KNOWN_STATUSES.includes(key) ? key : "other";
    return <span className={`rt-badge rt-badge--${variant}`}>{capitalize(status)}</span>;
};

export default function ReportsIndex() {
    const [rows, setRows] = useState([]);
    const [checkedIds, setCheckedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const { projectId } = useParams();
    const [openForm, setOpenForm] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        const endPoint = projectId ? `/projects/${projectId}/reports` : "/reports";
        setLoading(true);
        AxiosClient.get(endPoint)
            .then(({ data }) => {
                setRows(data.records.data);
            })
            .finally(() => setLoading(false));
    };

    /* search through the reports already loaded */
    const q = query.trim().toLowerCase();
    const filtered = q
        ? rows.filter((r) =>
              `${r.title ?? ""} ${r.type ?? ""} ${r.status ?? ""} ${r.project ?? ""}`
                  .toLowerCase()
                  .includes(q),
          )
        : rows;

    /* selection (works on the rows currently visible) */
    const visibleIds = filtered.map((r) => r.id);
    const allChecked = visibleIds.length > 0 && visibleIds.every((id) => checkedIds.includes(id));
    const someChecked = visibleIds.some((id) => checkedIds.includes(id));

    const toggleRow = (id) => {
        setCheckedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x != id) : [...prev, id],
        );
    };
    const toggleAll = () => {
        setCheckedIds((prev) =>
            allChecked
                ? prev.filter((id) => !visibleIds.includes(id))
                : [...new Set([...prev, ...visibleIds])],
        );
    };

    const countOf = (key) => rows.filter((r) => statusKey(r.status) === key).length;

    return (
        <div className="rt-page">
            {/* Hero */}
            <section className="rt-hero">
                <div>
                    <h1>Your Reports</h1>
                    <p>Create, review and track every report and sheet in one place.</p>
                </div>
                <HeroArt />
            </section>

            {/* Stat cards, one color per status */}
            <section className="rt-stats" aria-label="Summary">
                <div className="rt-stat rt-stat--blue">
                    <span className="rt-stat-num">{rows.length}</span>
                    <span className="rt-stat-label">Total</span>
                </div>
                <div className="rt-stat rt-stat--green">
                    <span className="rt-stat-num">{countOf("approved")}</span>
                    <span className="rt-stat-label">Approved</span>
                </div>
                <div className="rt-stat rt-stat--amber">
                    <span className="rt-stat-num">{countOf("in-review")}</span>
                    <span className="rt-stat-label">In review</span>
                </div>
                <div className="rt-stat rt-stat--slate">
                    <span className="rt-stat-num">{countOf("draft")}</span>
                    <span className="rt-stat-label">Draft</span>
                </div>
            </section>

            <section className="rt-card">
                {/* Toolbar */}
                <div className="rt-toolbar">
                    <label className="rt-search">
                        <SearchIcon />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search reports"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                                ×
                            </button>
                        )}
                    </label>

                    <span className="rt-result">
                        {checkedIds.length > 0
                            ? `${checkedIds.length} selected`
                            : `${filtered.length} of ${rows.length} shown`}
                    </span>

                    <div className="rt-toolbar-spacer" />

                    <button className="rt-btn rt-btn--ghost" onClick={() => setOpenForm(true)}>
                        New sheet
                    </button>
                    <button className="rt-btn rt-btn--primary" onClick={() => setOpenForm(true)}>
                        New report
                    </button>
                </div>

                {/* Table */}
                <div className="rt-table-wrap">
                    <table className="rt-table">
                        <thead>
                            <tr>
                                <th className="rt-th-check">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someChecked && !allChecked;
                                        }}
                                        onChange={toggleAll}
                                        aria-label="Select all"
                                    />
                                </th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Project</th>
                                <th>Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading &&
                                Array.from({ length: 6 }, (_, i) => (
                                    <tr key={i} className="rt-skeleton">
                                        <td><div className="rt-sk rt-sk--sm" /></td>
                                        <td><div className="rt-sk rt-sk--wide" /></td>
                                        <td><div className="rt-sk rt-sk--sm" /></td>
                                        <td><div className="rt-sk rt-sk--pill" /></td>
                                        <td><div className="rt-sk rt-sk--mid" /></td>
                                        <td><div className="rt-sk rt-sk--mid" /></td>
                                    </tr>
                                ))}

                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="rt-empty">
                                            <EmptyArt />
                                            <h3>{q ? "No reports match your search" : "No reports yet"}</h3>
                                            <p>{q ? "Try a different word." : "Create your first report to get started."}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filtered.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={checkedIds.includes(row.id) ? "is-selected" : ""}
                                    >
                                        <td className="rt-th-check">
                                            <input
                                                type="checkbox"
                                                checked={checkedIds.includes(row.id)}
                                                onChange={() => toggleRow(row.id)}
                                                aria-label={`Select ${row.title}`}
                                            />
                                        </td>
                                        <td>
                                            <div className="rt-name">
                                                <span className="rt-doc-icon">
                                                    <TypeIcon type={row.type} />
                                                </span>
                                                <span className="rt-doc-name">{row.title}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="rt-type">{row.type}</span>
                                        </td>
                                        <td>
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="rt-project">{row.project}</td>
                                        <td className="rt-date">{row.updated_at}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Creating form */}
            <ReportsForm
                isOpen={openForm}
                onClose={() => setOpenForm(false)}
                onCreated={fetchData}
            />
        </div>
    );
}
