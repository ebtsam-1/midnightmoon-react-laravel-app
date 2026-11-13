import React, { useEffect, useState } from "react";
import AxiosClient from "../../AxiosClient";

/**
 * Split-screen modal: form on the left, soft image panel on the right.
 * - feature = null  -> create mode
 * - feature = {...} -> edit mode
 */
function FeatureModal({ feature, onClose, onSaved }) {
    const imageBase = import.meta.env.VITE_STORAGE_BASE_URL;
    const isEdit = Boolean(feature);

    const [form, setForm] = useState({
        title: feature?.title ?? "",
        description: feature?.description ?? "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
        feature?.img ? `${imageBase}/${feature.img}` : null
    );
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Free the temporary preview URL
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFile = (e) => {
        const picked = e.target.files?.[0];
        if (!picked) return;
        setFile(picked);
        setPreview(URL.createObjectURL(picked));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const body = new FormData();
        body.append("title", form.title);
        body.append("desc", form.description);
        if (file) body.append("img", file);

        // Laravel can't read multipart PUT, so spoof it with POST + _method
        let request;
        if (isEdit) {
            body.append("_method", "PUT");
            request = AxiosClient.post(`/features/${feature.id}`, body);
        } else {
            request = AxiosClient.post("/features", body);
        }

        request
            .then(() => onSaved(isEdit ? "Feature updated" : "Feature created"))
            .catch((err) => {
                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors || {});
                } else {
                    setErrors({ general: ["Something went wrong. Please try again."] });
                }
            })
            .finally(() => setSaving(false));
    };

    return (
        <div className="fa-overlay" onMouseDown={onClose}>
            <div
                className="fa-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="fa-modal-title"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* LEFT: form */}
                <form className="fa-modal-form" onSubmit={handleSubmit} noValidate>
                    <h3 id="fa-modal-title">{isEdit ? "Edit feature" : "New feature"}</h3>
                    <p className="fa-modal-hint">
                        {isEdit
                            ? "Update the details below and save your changes."
                            : "Add a title, a short description and an image."}
                    </p>

                    {errors.general && <p className="fa-error">{errors.general[0]}</p>}

                    <label className="fa-field">
                        <span>Title</span>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Night repair serum"
                            autoFocus
                        />
                        {errors.title && <small className="fa-error">{errors.title[0]}</small>}
                    </label>

                    <label className="fa-field">
                        <span>Description</span>
                        <textarea
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="A short line about this feature"
                        />
                        {errors.description && (
                            <small className="fa-error">{errors.description[0]}</small>
                        )}
                    </label>

                    <label className="fa-field">
                        <span>Image</span>
                        <input type="file" accept="image/*" onChange={handleFile} />
                        {errors.img && <small className="fa-error">{errors.img[0]}</small>}
                    </label>

                    <div className="fa-modal-actions">
                        <button type="button" className="fa-btn fa-btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="fa-btn fa-btn-primary" disabled={saving}>
                            {saving ? "Saving..." : isEdit ? "Save changes" : "Create feature"}
                        </button>
                    </div>
                </form>

                {/* RIGHT: soft image panel */}
                <aside className="fa-modal-visual">
                    {preview ? (
                        <img src={preview} alt="Feature preview" />
                    ) : (
                        <div className="fa-modal-placeholder">
                            <span className="fa-moon" aria-hidden="true" />
                            <p>Your image preview will appear here</p>
                        </div>
                    )}
                    <div className="fa-modal-veil" />
                </aside>

                <button type="button" className="fa-modal-close" onClick={onClose} aria-label="Close">
                    &times;
                </button>
            </div>
        </div>
    );
}

export default FeatureModal;
