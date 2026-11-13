import React, { useEffect } from "react";

function ConfirmDialog({
    title,
    message,
    confirmLabel = "Delete",
    loading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && !loading && onCancel();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [loading, onCancel]);

    return (
        <div className="ad-overlay" onMouseDown={() => !loading && onCancel()}>
            <div
                className="ad-confirm"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="ad-confirm-title"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h3 id="ad-confirm-title">{title}</h3>
                <p>{message}</p>
                <div className="ad-confirm-actions">
                    <button type="button" className="ad-btn ad-btn-ghost" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button type="button" className="ad-btn ad-btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading ? "Working..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
