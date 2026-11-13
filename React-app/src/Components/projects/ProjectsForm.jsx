import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosClient from "../../AxiosClient";

const imageUrl = import.meta.env.VITE_STORAGE_BASE_URL;
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

/*
  One form for both:
    /admin-panel/projects/create      -> creates a project
    /admin-panel/projects/edit/:id    -> updates a project
*/
export default function ProjectsForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({ title: "", description: "" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // existing image url or a local preview
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [dragging, setDragging] = useState(false);

    /* edit mode: load the project and fill the form */
    useEffect(() => {
        if (!isEdit) return;
        AxiosClient.get(`/projects/${id}`)
            .then(({ data }) => {
                // handles { record }, { project }, { data }, { records } or the object itself
                const p = data.record ?? data.project ?? data.data ?? data.records ?? data;
                setForm({ title: p.title ?? "", description: p.description ?? "" });
                if (p.image) setPreview(`${imageUrl}/${p.image}`);
            })
            .catch(() => navigate("/admin-panel/projects"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const pickFile = (picked) => {
        if (!picked) return;
        if (!picked.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }
        if (picked.size > MAX_SIZE) {
            toast.error("The image must be 2MB or smaller.");
            return;
        }
        if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
        setFile(picked);
        setPreview(URL.createObjectURL(picked));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files[0]);
    };

    const submit = (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        if (file) formData.append("image", file); // only when a new image was chosen
        if (isEdit) formData.append("_method", "PUT"); // Laravel can't read files on a real PUT

        AxiosClient.post(isEdit ? `/projects/${id}` : "/projects", formData)
            .then(() => navigate("/admin-panel/projects"))
            .catch((err) => {
                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors);
                }
            })
            .finally(() => setSaving(false));
    };

    if (loading) {
        return (
            <div className="ap-page">
                <div className="ap-form-card ap-form-card--loading">
                    <div className="ap-sk" style={{ height: 260 }} />
                    <div className="ap-sk" style={{ height: 260 }} />
                </div>
            </div>
        );
    }

    return (
        <div className="ap-page">
            <Link to="/admin-panel/projects" className="ap-back">
                ← Back to projects
            </Link>

            <div className="ap-head">
                <div>
                    <h2>{isEdit ? "Edit project" : "Create new project"}</h2>
                    <p>
                        {isEdit
                            ? "Update the details below and save your changes."
                            : "Add a title, a description and a cover image."}
                    </p>
                </div>
            </div>

            <form className="ap-form-card" onSubmit={submit}>
                {/* Section 1: image */}
                <div className="ap-upload-col">
                    <span className="ap-label">Cover image</span>
                    <label
                        className={`ap-drop${dragging ? " is-dragging" : ""}${preview ? " has-image" : ""}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Project cover preview" />
                                <span className="ap-drop-change">Change image</span>
                            </>
                        ) : (
                            <div className="ap-drop-empty">
                                <span className="ap-drop-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="3" width="18" height="18" rx="3" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="M21 16l-5-5-9 9" />
                                    </svg>
                                </span>
                                <strong>Click to upload</strong>
                                <small>or drag and drop an image here</small>
                                <small>JPG or PNG, up to 2MB</small>
                            </div>
                        )}
                        <input type="file" accept="image/*" hidden onChange={(e) => pickFile(e.target.files[0])} />
                    </label>
                    {errors.image && <small className="ap-error">{errors.image[0]}</small>}
                </div>

                {/* Section 2: fields */}
                <div className="ap-fields-col">
                    <label className="ap-field">
                        <span className="ap-label">Title</span>
                        <input
                            className={`ap-input${errors.title ? " has-error" : ""}`}
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Riverside Mobile App"
                        />
                        {errors.title && <small className="ap-error">{errors.title[0]}</small>}
                    </label>

                    <label className="ap-field">
                        <span className="ap-label">Description</span>
                        <textarea
                            className={`ap-input${errors.description ? " has-error" : ""}`}
                            name="description"
                            rows={7}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="What is this project about?"
                        />
                        {errors.description && <small className="ap-error">{errors.description[0]}</small>}
                    </label>

                    <div className="ap-form-actions">
                        <Link to="/admin-panel/projects" className="ap-btn ap-btn--ghost">
                            Cancel
                        </Link>
                        <button className="ap-btn" disabled={saving}>
                            {saving ? "Saving..." : isEdit ? "Save changes" : "Create project"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
