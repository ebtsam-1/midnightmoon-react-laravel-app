import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AxiosClient from "../../AxiosClient";

/* ---------- Illustrations (same blue style as the modal) ---------- */
function HeroArt() {
    return (
        <svg viewBox="0 0 300 220" className="pt-hero-art" aria-hidden="true">
            <path
                d="M40 120c-8-48 24-92 80-100 58-8 118 14 130 66 11 48-20 96-76 108-58 12-124-24-134-74z"
                fill="#d6e9fb"
            />
            <circle cx="262" cy="40" r="10" fill="#bcdcf8" />
            <circle cx="34" cy="188" r="7" fill="#bcdcf8" />
            {/* board */}
            <rect x="72" y="42" width="156" height="120" rx="14" fill="#fff" />
            <rect x="72" y="42" width="156" height="26" rx="14" fill="#4a9ee8" />
            <rect x="72" y="56" width="156" height="12" fill="#4a9ee8" />
            <circle cx="88" cy="55" r="3.5" fill="#fff" opacity=".9" />
            <circle cx="100" cy="55" r="3.5" fill="#fff" opacity=".7" />
            {/* columns */}
            <rect x="86" y="80" width="40" height="22" rx="6" fill="#d6e9fb" />
            <rect x="86" y="108" width="40" height="22" rx="6" fill="#bcdcf8" />
            <rect x="136" y="80" width="40" height="30" rx="6" fill="#1f6fc2" />
            <rect x="136" y="116" width="40" height="22" rx="6" fill="#d6e9fb" />
            <rect x="186" y="80" width="30" height="22" rx="6" fill="#bcdcf8" />
            <rect x="186" y="108" width="30" height="34" rx="6" fill="#d6e9fb" />
            {/* check badge */}
            <circle cx="224" cy="160" r="22" fill="#1f6fc2" />
            <path
                d="M214 160l7 7 13-14"
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

export default function UserProjectsIndex() {
    const imageUrl = import.meta.env.VITE_STORAGE_BASE_URL;

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null,
    });
    const [query, setQuery] = useState("");

    const fetchData = (page = 1) => {
        setIsLoading(true);
        AxiosClient.get(`/projects?page=${page}`)
            .then(({ data }) => {
                setProjects(data.records.data);
                setTotal(data.records.total);
                setMeta({
                    current_page: data.records.current_page,
                    last_page: data.records.last_page,
                    prev_page_url: data.records.prev_page_url,
                    next_page_url: data.records.next_page_url,
                });
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const goToPage = (page) => {
        if (page < 1 || page > meta.last_page) return;
        fetchData(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleAssign = (project) => {
        AxiosClient.post(`/projects/${project.id}/assign`)
            .then(() => {
                setProjects((prev) =>
                    prev.map((p) =>
                        p.id == project.id ? { ...p, is_assigned: true } : p,
                    ),
                );
            })
            .catch((err) => console.log(err));
    };

    /* search through the projects already loaded on this page */
    const q = query.trim().toLowerCase();
    const filtered = q
        ? projects.filter((p) =>
              `${p.title ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q),
          )
        : projects;

    const assignedCount = projects.filter((p) => p.is_assigned).length;
    const availableCount = projects.length - assignedCount;

    return (
        <main className="pt-page">
            {/* Hero */}
            <section className="pt-hero">
                <div>
                    <h1>Projects</h1>
                    <p>Browse every project, jump to its reports, and get assigned to the ones you work on.</p>
                </div>
                <HeroArt />
            </section>

            {/* Stat cards, one color per type */}
            <section className="pt-stats" aria-label="Summary">
                <div className="pt-stat pt-stat--blue">
                    <span className="pt-stat-num">{total}</span>
                    <span className="pt-stat-label">Total projects</span>
                </div>
                <div className="pt-stat pt-stat--green">
                    <span className="pt-stat-num">{assignedCount}</span>
                    <span className="pt-stat-label">Assigned (this page)</span>
                </div>
                <div className="pt-stat pt-stat--amber">
                    <span className="pt-stat-num">{availableCount}</span>
                    <span className="pt-stat-label">Available (this page)</span>
                </div>
            </section>

            {/* Table card */}
            <section className="pt-card">
                <div className="pt-toolbar">
                    <label className="pt-search">
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
                            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>
                        )}
                    </label>
                    <span className="pt-result">
                        {filtered.length} of {projects.length} shown
                    </span>
                </div>

                <div className="pt-table-wrap">
                    <table className="pt-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Status</th>
                                <th className="pt-th-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading &&
                                Array.from({ length: 5 }, (_, i) => (
                                    <tr key={i} className="pt-skeleton">
                                        <td><div className="pt-sk pt-sk--wide" /></td>
                                        <td><div className="pt-sk pt-sk--pill" /></td>
                                        <td><div className="pt-sk pt-sk--wide" /></td>
                                    </tr>
                                ))}

                            {!isLoading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={3}>
                                        <div className="pt-empty">
                                            <EmptyArt />
                                            <h3>{q ? "No projects match your search" : "No projects yet"}</h3>
                                            <p>{q ? "Try a different word." : "New projects will show up here."}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                filtered.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            <div className="pt-project">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                    state={{ fromPage: meta.current_page }}
                                                    className="pt-thumb"
                                                    tabIndex={-1}
                                                    aria-hidden="true"
                                                >
                                                    {project.image ? (
                                                        <img src={`${imageUrl}/${project.image}`} alt="" loading="lazy" />
                                                    ) : (
                                                        <span>{project.title?.charAt(0)}</span>
                                                    )}
                                                </Link>
                                                <div className="pt-project-text">
                                                    <Link
                                                        to={`/projects/${project.id}`}
                                                        state={{ fromPage: meta.current_page }}
                                                        className="pt-title"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                    <p className="pt-desc">{project.description}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className={`pt-badge ${project.is_assigned ? "is-assigned" : "is-available"}`}>
                                                {project.is_assigned ? "Assigned" : "Available"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="pt-actions">
                                                <Link to={`/projects/${project.id}/activities`} className="pt-btn pt-btn--ghost">
                                                    Activities
                                                </Link>
                                                <Link to={`/projects/${project.id}/reports`} className="pt-btn pt-btn--ghost">
                                                    Reports
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="pt-btn pt-btn--primary"
                                                    onClick={() => handleAssign(project)}
                                                    disabled={project.is_assigned}
                                                >
                                                    {project.is_assigned ? "Assigned" : "Get assigned"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {meta.last_page > 1 && (
                    <nav className="pt-pagination" aria-label="Projects pagination">
                        <button
                            type="button"
                            className="pt-page-btn pt-page-btn--nav"
                            onClick={() => goToPage(meta.current_page - 1)}
                            disabled={!meta.prev_page_url}
                        >
                            Previous
                        </button>

                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                            <button
                                type="button"
                                key={n}
                                className={`pt-page-btn${n === meta.current_page ? " is-active" : ""}`}
                                onClick={() => goToPage(n)}
                                aria-label={`Page ${n}`}
                                aria-current={n === meta.current_page ? "page" : undefined}
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="pt-page-btn pt-page-btn--nav"
                            onClick={() => goToPage(meta.current_page + 1)}
                            disabled={!meta.next_page_url}
                        >
                            Next
                        </button>
                    </nav>
                )}
            </section>
        </main>
    );
}
