import React, { useEffect, useState } from "react";
import AxiosClient from "../../AxiosClient";

function UserModal({ user, onClose, onSaved }) {
    const imageBase = import.meta.env.VITE_STORAGE_BASE_URL;
    const isEdit = Boolean(user);

    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
        user?.avatar ? `${imageBase}/${user.avatar}` : null
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
        body.append("name", form.name);
        body.append("email", form.email);
        if(!isEdit) body.append("password", form.password);
        if (file) body.append("avatar", file);

        let request;
        if (isEdit) {
            body.append("_method", "PUT");
            request = AxiosClient.post(`/users/${user.id}`, body);
        } else {
            request = AxiosClient.post("/users", body);
        }

        request
            .then(() => onSaved(isEdit ? "User updated" : "User created"))
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
                    <h3 id="fa-modal-title">{isEdit ? "Edit user" : "New user"}</h3>
                    <p className="fa-modal-hint">
                        {isEdit
                            ? "Update the details below and save your changes."
                            : ""}
                    </p>

                    {errors.general && <p className="fa-error">{errors.general[0]}</p>}

                    <label className="fa-field">
                        <span>user name</span>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Layla"
                            autoFocus
                        />
                        {errors.name && <small className="fa-error">{errors.name[0]}</small>}
                    </label>

                    <label className="fa-field">
                        <span>Email</span>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        {errors.email && (
                            <small className="fa-error">{errors.email[0]}</small>
                        )}
                    </label>

                   { !isEdit && <label className="fa-field">
                        <span>Password</span>
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        {errors.password && (
                            <small className="fa-error">{errors.password[0]}</small>
                        )}
                    </label>}

                    <label className="fa-field">
                        <span>Avatar</span>
                        <input type="file" accept="image/*" onChange={handleFile} />
                        {errors.img && <small className="fa-error">{errors.img[0]}</small>}
                    </label>

                    <div className="fa-modal-actions">
                        <button type="button" className="fa-btn fa-btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="fa-btn fa-btn-primary" disabled={saving}>
                            {saving ? "Saving..." : isEdit ? "Save changes" : "Create user"}
                        </button>
                    </div>
                </form>

                {/* RIGHT: soft image panel */}
                <aside className="fa-modal-visual">
                    {preview ? (
                        <img src={preview} alt="Avatar" />
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

export default UserModal;
