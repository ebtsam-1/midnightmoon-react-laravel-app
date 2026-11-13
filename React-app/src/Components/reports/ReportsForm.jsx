import { useEffect, useRef, useState } from "react";
import AxiosClient from "../../AxiosClient";

// Edit these to match your backend's report types
const REPORT_TYPES = [
    { value: "report", label: "Report" },
    { value: "sheet", label: "Sheet" },
];

const EMPTY_FORM = { title: "", description: "", type: "", project_id: "" };

function Illustration() {
    return (
        <svg viewBox="0 0 320 300" className="crm-art" aria-hidden="true">
            <path
                d="M52 150c-10-52 28-98 86-108 62-11 128 12 142 70 13 52-22 104-84 118-62 14-134-26-144-80z"
                fill="#d6e9fb"
            />
            <circle cx="268" cy="62" r="14" fill="#bcdcf8" />
            <circle cx="42" cy="236" r="9" fill="#bcdcf8" />
            <rect x="92" y="62" width="150" height="190" rx="14" fill="#a9d1f5" transform="rotate(-6 167 157)" />
            <rect x="104" y="52" width="150" height="190" rx="14" fill="#fff" />
            <rect x="122" y="72" width="64" height="10" rx="5" fill="#4a9ee8" />
            <rect x="122" y="92" width="100" height="6" rx="3" fill="#d6e9fb" />
            <rect x="122" y="106" width="82" height="6" rx="3" fill="#d6e9fb" />
            <rect x="126" y="178" width="22" height="42" rx="5" fill="#a9d1f5" />
            <rect x="156" y="152" width="22" height="68" rx="5" fill="#4a9ee8" />
            <rect x="186" y="132" width="22" height="88" rx="5" fill="#1f6fc2" />
            <path d="M124 150l32-22 30 12 36-30" stroke="#1f6fc2" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="222" cy="110" r="5" fill="#fff" stroke="#1f6fc2" strokeWidth="3" />
            <circle cx="248" cy="226" r="26" fill="#1f6fc2" />
            <path d="M248 214v24M236 226h24" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        </svg>
    );
}

/*
  Works with BOTH ways of closing:
    <ReportsForm isOpen={open} setIsOpen={setOpen} />
    <ReportsForm isOpen={open} onClose={() => setOpen(false)} onCreated={fetchData} />
*/
export default function ReportsForm({ isOpen, setIsOpen, onClose, onCreated }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const titleRef = useRef(null);

    const handleClose = () => {
        setForm(EMPTY_FORM);
        setError("");
        if (onClose) onClose();
        else if (setIsOpen) setIsOpen(false);
    };

    // Load projects when the modal opens
    useEffect(() => {
        if (!isOpen) return;
        let cancelled = false;
        setLoadingProjects(true);
        AxiosClient.get("/projects")
            .then(({ data }) => {
                // handles { records: { data: [...] } }, { records: [...] }, { data: [...] } or [...]
                const list = data?.records?.data ?? data?.records ?? data?.data ?? data;
                if (!cancelled) setProjects(Array.isArray(list) ? list : []);
            })
            .catch(() => !cancelled && setError("Couldn't load projects. Try again."))
            .finally(() => !cancelled && setLoadingProjects(false));
        titleRef.current?.focus();
        return () => {
            cancelled = true;
        };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && handleClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    if (!isOpen) return null;

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        AxiosClient.post("/reports", {
            ...form,
            project_id: Number(form.project_id),
        })
            .then(({ data }) => {
                onCreated?.(data);
                handleClose();
            })
            .catch((err) => {
                const errs = err.response?.data?.errors;
                setError(
                    errs
                        ? Object.values(errs).flat()[0]
                        : err.response?.data?.message || "Couldn't create the report.",
                );
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="crm-overlay" onClick={handleClose}>
            <div
                className="crm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="crm-title"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Section 1: illustration */}
                <aside className="crm-side">
                    <Illustration />
                    <h3>Turn updates into insight</h3>
                    <p>Create a report to keep your project's progress clear and easy to share.</p>
                </aside>

                {/* Section 2: form */}
                <form className="crm-form" onSubmit={handleSubmit}>
                    <button type="button" className="crm-close" onClick={handleClose} aria-label="Close">
                        ×
                    </button>
                    <h2 id="crm-title">New report</h2>

                    <label className="crm-field">
                        <span>Title</span>
                        <input
                            ref={titleRef}
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Sprint 12 summary"
                            required
                        />
                    </label>

                    <label className="crm-field">
                        <span>Description</span>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="What does this report cover?"
                            rows={3}
                        />
                    </label>

                    <div className="crm-row">
                        <label className="crm-field">
                            <span>Type</span>
                            <select name="type" value={form.type} onChange={handleChange} required>
                                <option value="" disabled>Select type</option>
                                {REPORT_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="crm-field">
                            <span>Project</span>
                            <select
                                name="project_id"
                                value={form.project_id}
                                onChange={handleChange}
                                required
                                disabled={loadingProjects}
                            >
                                <option value="" disabled>
                                    {loadingProjects ? "Loading…" : "Select project"}
                                </option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.title ?? p.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {error && <p className="crm-error" role="alert">{error}</p>}

                    <div className="crm-actions">
                        <button type="button" className="crm-btn crm-btn-ghost" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="crm-btn crm-btn-primary" disabled={submitting}>
                            {submitting ? "Creating…" : "Create report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
