import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "./AdminIcons";

const ITEMS = [
    { key: "dashboard", label: "Dashboard", path: "/admin-panel" },
    { key: "features", label: "Features", path: "/admin-panel/features" },
    { key: "projects", label: "Projects", path: "/admin-panel/projects" },
    { key: "reports", label: "Reports", path: "/admin-panel/reports" },
    { key: "activities", label: "Activities", path: "/admin-panel/activities" },
    { key: "products", label: "Products", path: "/admin-panel/products" },
    { key: "users", label: "Users", path: "/admin-panel/users" },
];

function AdminSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <aside className="sb" aria-label="Admin navigation">
            <div className={`sb-panel${open ? " is-open" : ""}`}>
                <button
                    type="button"
                    className="sb-item sb-toggle"
                    onClick={() => setOpen(!open)}
                    aria-label={open ? "Collapse menu" : "Expand menu"}
                >
                    <span className="sb-ico">
                        <Icon name={open ? "close" : "menu"} />
                    </span>
                    <span className="sb-label">Admin panel</span>
                </button>

                <div className="sb-sep" />

                <nav className="sb-nav">
                    {ITEMS.map((item) => (
                        <NavLink
                            key={item.key}
                            to={item.path}
                            end={item.path === "/admin-panel"}
                            className={({ isActive }) => `sb-item${isActive ? " is-active" : ""}`}
                            title={open ? undefined : item.label}
                        >
                            <span className="sb-ico">
                                <Icon name={item.key} />
                            </span>
                            <span className="sb-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

export default AdminSidebar;