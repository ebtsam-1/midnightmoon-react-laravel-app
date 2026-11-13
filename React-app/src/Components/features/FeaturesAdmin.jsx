import React, { useState, useEffect, useCallback } from "react";
import AxiosClient from "../../AxiosClient";
import FeatureModal from "./FeatureModal";

function FeaturesAdmin() {
    const imageUrl = import.meta.env.VITE_STORAGE_BASE_URL;
    const [features, setFeatures] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ open: false, feature: null });
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [notice, setNotice] = useState("");

    const fetchFeatures = useCallback((page = 1) => {
        setLoading(true);
        AxiosClient.get(`/features?page=${page}`)
            .then(({ data }) => {
                setFeatures(data.records.data);
                setMeta({
                    current_page: data.records.current_page,
                    last_page: data.records.last_page,
                    next_page_url: data.records.next_page_url,
                    prev_page_url: data.records.prev_page_url,
                });
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchFeatures();
    }, [fetchFeatures]);

    // Auto-hide the success message
    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(() => setNotice(""), 3000);
        return () => clearTimeout(t);
    }, [notice]);

    const openCreate = () => setModal({ open: true, feature: null });
    const openEdit = (feature) => setModal({ open: true, feature });
    const closeModal = () => setModal({ open: false, feature: null });

    const handleSaved = (message) => {
        closeModal();
        setNotice(message);
        fetchFeatures(meta.current_page);
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        AxiosClient.delete(`/features/${toDelete.id}`)
            .then(() => {
                setNotice("Feature deleted");
                // If we removed the last row on this page, step back one page
                const page =
                    features.length === 1 && meta.current_page > 1
                        ? meta.current_page - 1
                        : meta.current_page;
                fetchFeatures(page);
            })
            .finally(() => {
                setDeleting(false);
                setToDelete(null);
            });
    };

    const goToPage = (page) => {
        if (page < 1 || page > meta.last_page) return;
        fetchFeatures(page);
    };

    return (
        <section className="fa">
            <header className="fa-head">
                <div>
                    <h2 className="fa-title">
                        Features <span className="fa-count">{features.length}</span>
                    </h2>
                    <p className="fa-sub">Create, edit and remove what shows on the user page.</p>
                </div>
                <button type="button" className="fa-btn fa-btn-primary" onClick={openCreate}>
                    + New feature
                </button>
            </header>

            {notice && (
                <div className="fa-notice" role="status">
                    {notice}
                </div>
            )}

            <div className="fa-card">
                <div className="fa-table-wrap">
                    <table className="fa-table">
                        <thead>
                            <tr>
                                <th className="fa-col-img">Image</th>
                                <th className="fa-col-title">Title</th>
                                <th>Description</th>
                                <th className="fa-col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="fa-state">
                                        Loading...
                                    </td>
                                </tr>
                            ) : features.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="fa-state">
                                        No features yet. Click "New feature" to add the first one.
                                    </td>
                                </tr>
                            ) : (
                                features.map((ele) => (
                                    <tr key={ele.id}>
                                        <td>
                                            <img
                                                className="fa-thumb"
                                                src={`${imageUrl}/${ele.img}`}
                                                alt={ele.title || "Feature"}
                                            />
                                        </td>
                                        <td className="fa-cell-title">{ele.title || "Untitled"}</td>
                                        <td>
                                            <div className="fa-cell-desc">{ele.description || "No description"}</div>
                                        </td>
                                        <td className="fa-col-actions">
                                            <div className="fa-actions">
                                                <button
                                                    type="button"
                                                    className="fa-btn fa-btn-sm fa-btn-soft"
                                                    onClick={() => openEdit(ele)}
                                                >
                                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="fa-btn fa-btn-sm fa-btn-danger"
                                                    onClick={() => setToDelete(ele)}
                                                >
                                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="fa-pager">
                    <button
                        type="button"
                        className="fa-btn fa-btn-sm fa-btn-ghost"
                        disabled={!meta.prev_page_url}
                        onClick={() => goToPage(meta.current_page - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button
                        type="button"
                        className="fa-btn fa-btn-sm fa-btn-ghost"
                        disabled={!meta.next_page_url}
                        onClick={() => goToPage(meta.current_page + 1)}
                    >
                        Next
                    </button>
                </footer>
            </div>

            {modal.open && (
                <FeatureModal feature={modal.feature} onClose={closeModal} onSaved={handleSaved} />
            )}

            {toDelete && (
                <div className="fa-overlay" onMouseDown={() => !deleting && setToDelete(null)}>
                    <div
                        className="fa-confirm"
                        role="alertdialog"
                        aria-modal="true"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <h3>Delete this feature?</h3>
                        <p>
                            "{toDelete.title || "Untitled"}" will be removed from the user page. This
                            can't be undone.
                        </p>
                        <div className="fa-modal-actions">
                            <button
                                type="button"
                                className="fa-btn fa-btn-ghost"
                                onClick={() => setToDelete(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="fa-btn fa-btn-danger-solid"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete feature"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default FeaturesAdmin;
