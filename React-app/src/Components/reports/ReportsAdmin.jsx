import React, { useState, useEffect, useCallback } from "react";
import AxiosClient from "../../AxiosClient";
import ConfirmDialog from "./ConfirmDialog";
import { initials, avatarColor, formatDate } from "./adminUtils";

// Edit these to match the statuses your backend uses.
// `tone` picks the color (green | amber | grey | blue).
const STATUSES = [
    { value: "all", label: "All" },
    { value: "published", label: "Published", tone: "green" },
    { value: "draft", label: "Draft", tone: "amber" },
    { value: "archived", label: "Archived", tone: "grey" },
];

const statusInfo = (value) =>
    STATUSES.find((s) => s.value === value) || { label: value || "Unknown", tone: "blue" };

/**
 * Props (all optional): hook these up to your own pages/modals
 *   onNew()          -> "New report" button
 *   onView(report)   -> eye button
 *   onEdit(report)   -> pencil button
 */
function ReportsAdmin({ onNew, onView, onEdit }) {
    const [reports, setReports] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        next_page_url: null,
        prev_page_url: null,
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState("");
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [notice, setNotice] = useState("");

    // Wait until the user stops typing before hitting the API
    useEffect(() => {
        const t = setTimeout(() => setDebounced(search.trim()), 350);
        return () => clearTimeout(t);
    }, [search]);

    const fetchReports = useCallback(
        (page = 1) => {
            setLoading(true);
            AxiosClient.get("/reports", {
                params: {
                    page,
                    search: debounced || undefined,
                    status: status === "all" ? undefined : status,
                },
            })
                .then(({ data }) => {
                    setReports(data.records.data);
                    setMeta({
                        current_page: data.records.current_page,
                        last_page: data.records.last_page,
                        total: data.records.total ?? data.records.data.length,
                        next_page_url: data.records.next_page_url,
                        prev_page_url: data.records.prev_page_url,
                    });
                })
                .finally(() => setLoading(false));
        },
        [debounced, status]
    );

    // Back to page 1 whenever the filter or search changes
    useEffect(() => {
        fetchReports(1);
    }, [fetchReports]);

    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(() => setNotice(""), 3000);
        return () => clearTimeout(t);
    }, [notice]);

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        AxiosClient.delete(`/reports/${toDelete.id}`)
            .then(() => {
                setNotice("Report deleted");
                const page =
                    reports.length === 1 && meta.current_page > 1
                        ? meta.current_page - 1
                        : meta.current_page;
                fetchReports(page);
            })
            .finally(() => {
                setDeleting(false);
                setToDelete(null);
            });
    };

    const goToPage = (page) => {
        if (page < 1 || page > meta.last_page) return;
        fetchReports(page);
    };

    return (
        <section className="ad-page rp">
            <header className="ad-head">
                <div>
                    <h2 className="ad-title">Reports</h2>
                    <p className="ad-sub">
                        {meta.total} {meta.total === 1 ? "report" : "reports"} across your workspace.
                    </p>
                </div>
                <button type="button" className="ad-btn ad-btn-primary" onClick={() => onNew?.()}>
                    + New report
                </button>
            </header>

            {notice && (
                <div className="ad-notice" role="status">
                    {notice}
                </div>
            )}

            <div className="rp-card">
                <div className="rp-toolbar">
                    <div className="rp-tabs" role="tablist" aria-label="Filter by status">
                        {STATUSES.map((s) => (
                            <button
                                key={s.value}
                                type="button"
                                role="tab"
                                aria-selected={status === s.value}
                                className={`rp-tab ${status === s.value ? "is-active" : ""}`}
                                onClick={() => setStatus(s.value)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <label className="ad-search">
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                        </svg>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search reports"
                            aria-label="Search reports"
                        />
                    </label>
                </div>

                <div className="rp-table-wrap">
                    <table className="rp-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Project</th>
                                <th>Modified</th>
                                <th className="rp-col-actions">
                                    <span className="rp-sr">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="rp-state">
                                        Loading reports...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="rp-state">
                                        No reports match your filters.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((r) => {
                                    const st = statusInfo(r.status);
                                    const owner = r.user?.name ?? r.author ?? "Unknown";
                                    return (
                                        <tr key={r.id} className="rp-row" data-tone={st.tone}>
                                            <td>
                                                <div className="rp-report">
                                                    <span className="rp-doc" aria-hidden="true">
                                                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                                                            <path d="M14 3v5h5" />
                                                            <path d="M9 13h6M9 17h4" />
                                                        </svg>
                                                    </span>
                                                    <div className="rp-report-text">
                                                        <span className="rp-report-title">{r.title || "Untitled report"}</span>
                                                        <span className="rp-report-meta">
                                                            {r.type || "General"} &middot; #{r.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="rp-pill" data-tone={st.tone}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="rp-owner">
                                                    <span className="ad-avatar" style={{ background: avatarColor(owner) }}>
                                                        {initials(owner)}
                                                    </span>
                                                    <span>{owner}</span>
                                                </div>
                                            </td>
                                            <td className="rp-date">{formatDate(r.updated_at || r.created_at)}</td>
                                            <td className="rp-col-actions">
                                                <div className="rp-actions">
                                                    <button type="button" className="rp-ibtn" title="View" aria-label={`View ${r.title || "report"}`} onClick={() => onView?.(r)}>
                                                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    </button>
                                                    <button type="button" className="rp-ibtn" title="Edit" aria-label={`Edit ${r.title || "report"}`} onClick={() => onEdit?.(r)}>
                                                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <path d="M12 20h9" />
                                                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                        </svg>
                                                    </button>
                                                    <button type="button" className="rp-ibtn rp-ibtn-danger" title="Delete" aria-label={`Delete ${r.title || "report"}`} onClick={() => setToDelete(r)}>
                                                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <path d="M3 6h18" />
                                                            <path d="M8 6V4h8v2" />
                                                            <path d="M19 6l-1 14H6L5 6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <nav className="ad-pager" aria-label="Reports pagination">
                <button type="button" className="ad-btn ad-btn-ghost" disabled={!meta.prev_page_url} onClick={() => goToPage(meta.current_page - 1)}>
                    Previous
                </button>
                <span>
                    Page {meta.current_page} of {meta.last_page}
                </span>
                <button type="button" className="ad-btn ad-btn-ghost" disabled={!meta.next_page_url} onClick={() => goToPage(meta.current_page + 1)}>
                    Next
                </button>
            </nav>

            {toDelete && (
                <ConfirmDialog
                    title="Delete this report?"
                    message={`"${toDelete.title || "Untitled report"}" will be permanently removed. This can't be undone.`}
                    confirmLabel="Delete report"
                    loading={deleting}
                    onConfirm={confirmDelete}
                    onCancel={() => setToDelete(null)}
                />
            )}
        </section>
    );
}

export default ReportsAdmin;
