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

export default function ProductsIndex() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [openId, setOpenId] = useState(null);

    const fetchData = (page = 1) => {
        setIsLoading(true);
        AxiosClient.get(`/products?page=${page}`)
            .then(({ data }) => {
                const rec = data.records;
                setProducts(rec.data);
                setTotal(rec.total);
                setMeta({ current_page: rec.current_page, last_page: rec.last_page });
                setOpenId(null);
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
        AxiosClient.delete(`/products/${toDelete.id}`)
            .then(() => {
                const page =
                    products.length === 1 && meta.current_page > 1
                        ? meta.current_page - 1
                        : meta.current_page;
                setToDelete(null);
                fetchData(page);
            })
            .catch((err) => console.log(err))
            .finally(() => setDeleting(false));
    };

    return (
        <div className="pc-page">

            <header className="pc-head">
                <div>
                    <h2>Products</h2>
                    <p>
                        {total} {total === 1 ? "product" : "products"} in total
                    </p>
                </div>
                <Link to="/admin-panel/products/create" className="pc-btn">
                    + New product
                </Link>
            </header>

            {isLoading && (
                <div className="pc-list">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="pc-card pc-skeleton" />
                    ))}
                </div>
            )}

            {!isLoading && products.length === 0 && (
                <div className="pc-empty">
                    <h3>No products yet</h3>
                    <p>Create your first product to get started.</p>
                </div>
            )}

            {!isLoading && (
                <div className="pc-list">
                    {products.map((p) => {
                        const specs = Object.entries(p.specifications ?? {});
                        const open = openId === p.id;
                        return (
                            <article key={p.id} className="pc-card">
                                <div className="pc-main">
                                    <div className="pc-thumb">
                                        {p.primaryImage ? (
                                            <img src={p.primaryImage.disk == 'external' ? p.primaryImage.path : `${imageUrl}/${p.primaryImage.path}`} alt="" loading="lazy" />
                                        ) : (
                                            <span>{p.title?.charAt(0)}</span>
                                        )}
                                    </div>

                                    <div className="pc-info">
                                        <div className="pc-title-row">
                                            <h3>{p.title}</h3>
                                            <span className="pc-id">#{p.id}</span>
                                        </div>
                                        <p className="pc-desc">{p.description}</p>
                                        <div className="pc-tags">
                                            <span className="pc-price">Price: {p.price}</span>
                                            {p.category && <span className="pc-tag">{p.category}</span>}
                                            <span className="pc-date">Created {formatDate(p.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="pc-actions">
                                        <Link to={`/admin-panel/products/edit/${p.id}`} className="pc-act">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            className="pc-act pc-act--danger"
                                            onClick={() => setToDelete(p)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {specs.length > 0 && (
                                    <>
                                        <button
                                            type="button"
                                            className="pc-toggle"
                                            onClick={() => setOpenId(open ? null : p.id)}
                                        >
                                            {open ? "Hide" : "Show"} {specs.length} specs
                                        </button>
                                        {open && (
                                            <dl className="pc-specs">
                                                {specs.map(([k, v]) => (
                                                    <div key={k}>
                                                        <dt>{k}</dt>
                                                        <dd>{String(v)}</dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        )}
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            {meta.last_page > 1 && (
                <nav className="pc-pager" aria-label="products pagination">
                    <button
                        type="button"
                        className="pc-btn pc-btn--ghost"
                        onClick={() => goToPage(meta.current_page - 1)}
                        disabled={isLoading || meta.current_page <= 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button
                        type="button"
                        className="pc-btn pc-btn--ghost"
                        onClick={() => goToPage(meta.current_page + 1)}
                        disabled={isLoading || meta.current_page >= meta.last_page}
                    >
                        Next
                    </button>
                </nav>
            )}

            {toDelete && (
                <div className="pc-overlay" onClick={() => setToDelete(null)}>
                    <div
                        className="pc-dialog"
                        role="alertdialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Delete product?</h3>
                        <p>
                            <strong>{toDelete.title}</strong> will be removed. This can't be undone.
                        </p>
                        <div className="pc-dialog-actions">
                            <button type="button" className="pc-btn pc-btn--ghost" onClick={() => setToDelete(null)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="pc-btn pc-btn--danger"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


