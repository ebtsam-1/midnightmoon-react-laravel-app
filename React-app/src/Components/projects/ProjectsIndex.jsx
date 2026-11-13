import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosClient from "../../AxiosClient";

const imageUrl = import.meta.env.VITE_STORAGE_BASE_URL;

const pad = (n) => String(n).padStart(2, "0");
const formatDate = (v) => {
    if (!v) return "-";
    const [y, m, d] = String(v).slice(0, 10).split("-");
    return y && m && d ? `${pad(d)}-${pad(m)}-${y}` : "-";
};

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

function EmptyArt() {
    return (
        <svg viewBox="0 0 200 150" width="150" aria-hidden="true">
            <path
                d="M24 78c-4-30 16-56 50-60 36-5 72 8 80 40 7 30-12 58-48 66-36 7-76-14-82-46z"
                fill="#f1ddf1"
            />
            <circle cx="92" cy="70" r="26" fill="#fff" stroke="#c99fca" strokeWidth="8" />
            <line x1="112" y1="90" x2="140" y2="118" stroke="#7b4b7e" strokeWidth="10" strokeLinecap="round" />
            <circle cx="164" cy="34" r="6" fill="#e3c3e3" />
            <circle cx="30" cy="120" r="5" fill="#e3c3e3" />
        </svg>
    );
}

export default function ProjectsIndex() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [query, setQuery] = useState("");
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchData = (page = 1) => {
        setIsLoading(true);
        AxiosClient.get(`/projects?page=${page}`)
            .then(({ data }) => {
                const rec = data.records;
                setProjects(rec.data);
                setTotal(rec.total);
                setMeta({ current_page: rec.current_page, last_page: rec.last_page });
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
    };

    const confirmDelete = () => {
        setDeleting(true);
        AxiosClient.delete(`/projects/${toDelete.id}`)
            .then(() => {
                // if that was the last row of the page, go back one page
                const page =
                    projects.length === 1 && meta.current_page > 1
                        ? meta.current_page - 1
                        : meta.current_page;
                setToDelete(null);
                fetchData(page);
            })
            .catch((err) => console.log(err))
            .finally(() => setDeleting(false));
    };

    /* search through the projects already loaded on this page */
    const q = query.trim().toLowerCase();
    const filtered = q
        ? projects.filter((p) =>
              `${p.id} ${p.title ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q),
          )
        : projects;

    const showUpdated = projects.some((p) => p.updated_at);
    const colCount = showUpdated ? 4 : 3;

    return (
        <div className="ap-page">
            <div className="ap-head">
                <div>
                    <h2>Projects</h2>
                    <p>
                        {total} {total === 1 ? "project" : "projects"} in total
                    </p>
                </div>
            </div>

            <section className="ap-card">
                {/* Toolbar */}
                <div className="ap-toolbar">
                    <label className="ap-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.5" y2="16.5" />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search projects"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                                ×
                            </button>
                        )}
                    </label>

                    <span className="ap-result">
                        {filtered.length} of {projects.length} shown
                    </span>

                    <div className="ap-spacer" />

                    <Link to="/admin-panel/projects/create" className="ap-btn">
                        Create new project
                    </Link>
                </div>

                {/* Table */}
                <div className="ap-table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>
                                <th className="ap-th-id">ID</th>
                                <th>Project</th>
                                {showUpdated && <th>Updated</th>}
                                <th className="ap-th-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading &&
                                Array.from({ length: 5 }, (_, i) => (
                                    <tr key={i} className="ap-skeleton">
                                        {Array.from({ length: colCount }, (_, j) => (
                                            <td key={j}><div className="ap-sk" /></td>
                                        ))}
                                    </tr>
                                ))}

                            {!isLoading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={colCount}>
                                        <div className="ap-empty">
                                            <EmptyArt />
                                            <h3>{q ? "No projects match your search" : "No projects yet"}</h3>
                                            <p>{q ? "Try a different word." : "Create your first project to get started."}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                filtered.map((p) => (
                                    <tr key={p.id}>
                                        <td className="ap-id">#{p.id}</td>
                                        <td>
                                            <div className="ap-project">
                                                <span className="ap-thumb">
                                                    {p.image ? (
                                                        <img src={`${imageUrl}/${p.image}`} alt="" loading="lazy" />
                                                    ) : (
                                                        <span>{p.title?.charAt(0)}</span>
                                                    )}
                                                </span>
                                                <div className="ap-project-text">
                                                    <strong>{p.title}</strong>
                                                    <p>{p.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {showUpdated && <td className="ap-date">{formatDate(p.updated_at)}</td>}
                                        <td>
                                            <div className="ap-actions">
                                                <Link to={`/admin-panel/projects/edit/${p.id}`} className="ap-act ap-act--edit">
                                                    Edit
                                                </Link>
                                                <button type="button" className="ap-act ap-act--delete" onClick={() => setToDelete(p)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <nav className="ap-pagination" aria-label="Projects pagination">
                        <button
                            type="button"
                            className="ap-page-btn"
                            onClick={() => goToPage(meta.current_page - 1)}
                            disabled={meta.current_page <= 1}
                        >
                            Previous
                        </button>

                        {getPages(meta.current_page, meta.last_page).map((p, i) =>
                            p === "..." ? (
                                <span key={`dots-${i}`} className="ap-dots">...</span>
                            ) : (
                                <button
                                    type="button"
                                    key={p}
                                    className={`ap-page-btn${p === meta.current_page ? " is-active" : ""}`}
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
                            className="ap-page-btn"
                            onClick={() => goToPage(meta.current_page + 1)}
                            disabled={meta.current_page >= meta.last_page}
                        >
                            Next
                        </button>
                    </nav>
                )}
            </section>

            {/* Delete confirmation */}
            {toDelete && (
                <div className="ap-overlay" onClick={() => setToDelete(null)}>
                    <div className="ap-dialog" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete project?</h3>
                        <p>
                            <strong>{toDelete.title}</strong> will be removed. This can't be undone.
                        </p>
                        <div className="ap-dialog-actions">
                            <button type="button" className="ap-btn ap-btn--ghost" onClick={() => setToDelete(null)}>
                                Cancel
                            </button>
                            <button type="button" className="ap-btn ap-btn--danger" onClick={confirmDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
