import React, { useState, useEffect } from "react";
import AxiosClient from "../../AxiosClient";

function FeaturesIndex() {
    const imageUrl = import.meta.env.VITE_STORAGE_BASE_URL;
    const [features, setFeatures] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });
    const [loading, setLoading] = useState(false);

    const fetchFeatures = (page = 1) => {
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
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const goToPage = (page) => {
        if (page < 1 || page > meta.last_page) return;
        fetchFeatures(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section id="features" className="fx">
            <header className="fx-head">
                <h2 className="fx-title">Check out our features</h2>
                <p className="fx-sub">Everything MidnightMoon has to offer, in one place.</p>
            </header>

            {loading ? (
                <div className="fx-grid" aria-busy="true">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="fx-card fx-skeleton" />
                    ))}
                </div>
            ) : features.length === 0 ? (
                <p className="fx-empty">No features to show yet. Check back soon.</p>
            ) : (
                <div className="fx-grid">
                    {features.map((ele) => (
                        <article key={ele.id} className="fx-card">
                            <div className="fx-media">
                                <img
                                    className="fx-img"
                                    src={`${imageUrl}/${ele.img}`}
                                    alt={ele.title || "Feature"}
                                    loading="lazy"
                                />
                                {(ele.title || ele.description) && (
                                    <div className="fx-caption">
                                        {ele.title && <h3>{ele.title}</h3>}
                                        {ele.description && <p>{ele.description}</p>}
                                    </div>
                                )}
                            </div>
                            <button type="button" className="fx-btn">
                                View more
                            </button>
                        </article>
                    ))}
                </div>
            )}

            <nav className="fx-pager" aria-label="Features pagination">
                <button
                    type="button"
                    className="fx-pager-btn"
                    disabled={!meta.prev_page_url}
                    onClick={() => goToPage(meta.current_page - 1)}
                >
                    Previous
                </button>

                <span className="fx-pager-info">
                    Page {meta.current_page} of {meta.last_page}
                </span>

                <button
                    type="button"
                    className="fx-pager-btn"
                    disabled={!meta.next_page_url}
                    onClick={() => goToPage(meta.current_page + 1)}
                >
                    Next
                </button>
            </nav>
        </section>
    );
}

export default FeaturesIndex;
