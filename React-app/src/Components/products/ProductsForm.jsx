import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosClient from "../../AxiosClient";

const imageUrl = import.meta.env.VITE_STORAGE_BASE_URL;
const MAX_SIZE = 2 * 1024 * 1024; // 2MB per image
const MAX_EXTRA = 10; // max additional images

/* field names sent to the API, change here if your backend uses other names */
const PRIMARY_FIELD = "primary_image";
const EXTRA_FIELD = "images[]";
const REMOVED_FIELD = "removed_images[]";

/*
  One form for both:
    /admin-panel/products/create      -> creates a product
    /admin-panel/products/edit/:id    -> updates a product
*/
export default function ProductsForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({ title: "", description: "", price: "", category_id: "" });
    const [specs, setSpecs] = useState([{ uid: 0, key: "", value: "" }]);

    // primary image
    const [primaryFile, setPrimaryFile] = useState(null);
    const [primaryPreview, setPrimaryPreview] = useState(null);

    // additional images
    const [existingImages, setExistingImages] = useState([]); // { ref, url } already saved on the server
    const [removedImages, setRemovedImages] = useState([]); // refs of saved images to delete
    const [newImages, setNewImages] = useState([]); // { uid, file, url } picked in this session

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [dragging, setDragging] = useState(false);

    const uidRef = useRef(1);
    const extraInputRef = useRef(null);

    const [categories, setCategories] = useState([]);

    useEffect(()=>{
        AxiosClient.get('/categories')
        .then(({data})=>{
            setCategories(data.records);
        })
    }, [])

    /* edit mode: load the product and fill the form */
    useEffect(() => {
        if (!isEdit) return;
        AxiosClient.get(`/products/${id}`)
            .then(({ data }) => {
                // handles { record }, { product }, { data }, { records } or the object itself
                const p = data.record ?? data.product ?? data.data ?? data.records ?? data;

                setForm({
                    title: p.title ?? "",
                    description: p.description ?? "",
                    price: p.price ?? "",
                    category_id: p.category_id ?? "",
                });

                // specifications can be an object or a JSON string
                let s = p.specifications ?? {};
                if (typeof s === "string") {
                    try {
                        s = JSON.parse(s);
                    } catch {
                        s = {};
                    }
                }
                const rows = Object.entries(s).map(([key, value]) => ({
                    uid: uidRef.current++,
                    key,
                    value: String(value),
                }));
                setSpecs(rows.length ? rows : [{ uid: uidRef.current++, key: "", value: "" }]);

                const primary = p.primaryImage ?? p.primary_image ?? p.image;
                if (primary) setPrimaryPreview(`${imageUrl}/${primary}`);

                // extra images can be strings or objects like { id, image }
                setExistingImages(
                    (p.images ?? []).map((im) => {
                        if (typeof im === "string") return { ref: im, url: `${imageUrl}/${im}` };
                        const path = im.image ?? im.path ?? im.url ?? "";
                        return { ref: im.id ?? path, url: `${imageUrl}/${path}` };
                    }),
                );
            })
            .catch(() => navigate("/admin-panel/products"))
            .finally(() => setLoading(false));

    }, [id]);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    /* ---------- image helpers ---------- */
    const validateImage = (picked) => {
        if (!picked.type.startsWith("image/")) {
            toast.error(`"${picked.name}" is not an image.`);
            return false;
        }
        if (picked.size > MAX_SIZE) {
            toast.error(`"${picked.name}" is larger than 2MB.`);
            return false;
        }
        return true;
    };

    const pickPrimary = (picked) => {
        if (!picked || !validateImage(picked)) return;
        if (primaryPreview?.startsWith("blob:")) URL.revokeObjectURL(primaryPreview);
        setPrimaryFile(picked);
        setPrimaryPreview(URL.createObjectURL(picked));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        pickPrimary(e.dataTransfer.files[0]);
    };

    const addExtra = (fileList) => {
        const room = MAX_EXTRA - existingImages.length - newImages.length;
        const picked = Array.from(fileList ?? []).filter(validateImage);
        if (picked.length > room) toast.error(`You can add up to ${MAX_EXTRA} extra images.`);
        const accepted = picked.slice(0, Math.max(room, 0)).map((file) => ({
            uid: uidRef.current++,
            file,
            url: URL.createObjectURL(file),
        }));
        if (accepted.length) setNewImages((list) => [...list, ...accepted]);
        if (extraInputRef.current) extraInputRef.current.value = ""; // allow picking the same file again
    };

    const removeNew = (uid) =>
        setNewImages((list) => {
            const item = list.find((i) => i.uid === uid);
            if (item) URL.revokeObjectURL(item.url);
            return list.filter((i) => i.uid !== uid);
        });

    const removeExisting = (img) => {
        setExistingImages((list) => list.filter((i) => i.ref !== img.ref));
        setRemovedImages((list) => [...list, img.ref]);
    };

    /* ---------- specifications helpers ---------- */
    const updateSpec = (uid, field, value) =>
        setSpecs((rows) => rows.map((r) => (r.uid === uid ? { ...r, [field]: value } : r)));

    const addSpec = () =>
        setSpecs((rows) => [...rows, { uid: uidRef.current++, key: "", value: "" }]);

    const removeSpec = (uid) =>
        setSpecs((rows) => {
            const left = rows.filter((r) => r.uid !== uid);
            return left.length ? left : [{ uid: uidRef.current++, key: "", value: "" }];
        });

    /* ---------- submit ---------- */
    const submit = (e) => {
        e.preventDefault();

        // primary image is required: a new file, or an existing one while editing
        if (!primaryFile && !primaryPreview) {
            setErrors({ [PRIMARY_FIELD]: ["The primary image is required."] });
            toast.error("Please add a primary image.");
            return;
        }

        setSaving(true);
        setErrors({});

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category_id", form.category_id);

        // specifications[Color]=Red, Laravel reads this as an array
        specs
            .filter((r) => r.key.trim())
            .forEach((r) => {
                const key = r.key.trim().replace(/[[\]]/g, "");
                formData.append(`specifications[${key}]`, r.value);
            });

        if (primaryFile) formData.append(PRIMARY_FIELD, primaryFile); // only when a new one was chosen
        newImages.forEach((i) => formData.append(EXTRA_FIELD, i.file));
        removedImages.forEach((ref) => formData.append(REMOVED_FIELD, ref));
        if (isEdit) formData.append("_method", "PUT"); // Laravel can't read files on a real PUT

        AxiosClient.post(isEdit ? `/products/${id}` : "/products", formData)
            .then(() => navigate("/admin-panel/products"))
            .catch((err) => {
                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors);
                }
            })
            .finally(() => setSaving(false));
    };

    const err = (name) => errors[name]?.[0];
    const extraError = Object.keys(errors).find((k) => k === "images" || k.startsWith("images."));
    const extraCount = existingImages.length + newImages.length;

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
            <Link to="/admin-panel/products" className="ap-back">
                ← Back to products
            </Link>

            <div className="ap-head">
                <div>
                    <h2>{isEdit ? "Edit product" : "Create new product"}</h2>
                    <p>
                        {isEdit
                            ? "Update the details below and save your changes."
                            : "Fill in the product details and add its images."}
                    </p>
                </div>
            </div>

            <form className="ap-form-card" onSubmit={submit}>
                {/* Section 1: images */}
                <div className="ap-upload-col">
                    <span className="ap-label">
                        Primary image <span className="pf-required">*</span>
                    </span>
                    <label
                        className={`ap-drop${dragging ? " is-dragging" : ""}${primaryPreview ? " has-image" : ""}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        {primaryPreview ? (
                            <>
                                <img src={primaryPreview} alt="primary product preview" />
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
                        <input type="file" accept="image/*" hidden onChange={(e) => pickPrimary(e.target.files[0])} />
                    </label>
                    {err(PRIMARY_FIELD) && <small className="ap-error">{err(PRIMARY_FIELD)}</small>}

                    <span className="ap-label pf-extra-label">
                        More images <small>({extraCount}/{MAX_EXTRA})</small>
                    </span>
                    <div className="pf-thumbs">
                        {existingImages.map((img) => (
                            <div key={img.ref} className="pf-thumb">
                                <img src={img.url} alt="" />
                                <button type="button" onClick={() => removeExisting(img)} aria-label="Remove image">
                                    ×
                                </button>
                            </div>
                        ))}

                        {newImages.map((img) => (
                            <div key={img.uid} className="pf-thumb">
                                <img src={img.url} alt="" />
                                <button type="button" onClick={() => removeNew(img.uid)} aria-label="Remove image">
                                    ×
                                </button>
                            </div>
                        ))}

                        {extraCount < MAX_EXTRA && (
                            <button
                                type="button"
                                className="pf-add"
                                onClick={() => extraInputRef.current?.click()}
                                aria-label="Add more images"
                            >
                                +
                            </button>
                        )}
                    </div>
                    <input
                        ref={extraInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => addExtra(e.target.files)}
                    />
                    {extraError && <small className="ap-error">{errors[extraError][0]}</small>}
                </div>

                {/* Section 2: fields */}
                <div className="ap-fields-col">
                    <label className="ap-field">
                        <span className="ap-label">Title</span>
                        <input
                            className={`ap-input${err("title") ? " has-error" : ""}`}
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Wireless Headphones"
                        />
                        {err("title") && <small className="ap-error">{err("title")}</small>}
                    </label>

                    <div className="pf-row">
                        <label className="ap-field">
                            <span className="ap-label">Price</span>
                            <input
                                className={`ap-input${err("price") ? " has-error" : ""}`}
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                            {err("price") && <small className="ap-error">{err("price")}</small>}
                        </label>

                        <label className="ap-field">
                            <span className="ap-label">Category</span>
                            <select 
                                name="category_id" 
                                value={form.category_id}
                                onChange={handleChange}
                                className={`ap-input${err("category_id") ? " has-error" : ""}`}>
                                 <option value="">Select a category</option>   
                                {categories.map((cat)=>(
                                    <option value={cat.id} key={cat.id}>{cat.name}</option>
                                ))}
                            </select>  
                            {err("category") && <small className="ap-error">{err("category")}</small>}
                        </label>
                    </div>

                    <label className="ap-field">
                        <span className="ap-label">Description</span>
                        <textarea
                            className={`ap-input${err("description") ? " has-error" : ""}`}
                            name="description"
                            rows={5}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="What is this product about?"
                        />
                        {err("description") && <small className="ap-error">{err("description")}</small>}
                    </label>

                    {/* Specifications */}
                    <div className="ap-field">
                        <span className="ap-label">Specifications</span>
                        <div className="pf-specs">
                            {specs.map((row) => (
                                <div key={row.uid} className="pf-spec-row">
                                    <input
                                        className="ap-input"
                                        value={row.key}
                                        onChange={(e) => updateSpec(row.uid, "key", e.target.value)}
                                        placeholder="Name (e.g. Color)"
                                    />
                                    <input
                                        className="ap-input"
                                        value={row.value}
                                        onChange={(e) => updateSpec(row.uid, "value", e.target.value)}
                                        placeholder="Value (e.g. Black)"
                                    />
                                    <button
                                        type="button"
                                        className="pf-spec-remove"
                                        onClick={() => removeSpec(row.uid)}
                                        aria-label="Remove specification"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="pf-link" onClick={addSpec}>
                            + Add specification
                        </button>
                        {err("specifications") && <small className="ap-error">{err("specifications")}</small>}
                    </div>

                    <div className="ap-form-actions">
                        <Link to="/admin-panel/products" className="ap-btn ap-btn--ghost">
                            Cancel
                        </Link>
                        <button className="ap-btn" disabled={saving}>
                            {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}


