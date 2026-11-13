import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Header from "../Components/header/Header";
import AdminSidebar from "../Components/admin/AdminSidebar";

const BASE = "/admin-panel";

const TABS = [
    { to: BASE, label: "Dashboard", end: true },
    { to: `${BASE}/features`, label: "Features" },
    { to: `${BASE}/projects`, label: "Projects" },
    { to: `${BASE}/reports`, label: "Reports" },
    { to: `${BASE}/activities`, label: "Activities" },
    { to: `${BASE}/products`, label: "Products" },
    { to: `${BASE}/users`, label: "Users" },
];

// TODO: replace with real data from your API
const STATS = [
    { label: "Activities count", value: 207 },
    { label: "Location", value: "Africa, Egypt" },
];

function AdminLayout() {
    const { pathname } = useLocation();

    // Banner title follows the current tab instead of always saying "Dashboard"
    const current =
        TABS.find((t) => (t.end ? pathname === t.to : pathname.startsWith(t.to))) ??
        TABS[0];

    return (
        <div id="adminLayout">
            <div id="content">
                <Header />
                <main>
                    <div className="home-container">
                        <AdminSidebar />

                        <div id="home">
                            <section className="am-cover">
                                <div className="am-cover__text">
                                    <span className="am-chip">{current.label}</span>
                                    <h1 className="am-cover__greeting">Hey, wie geht's dir!</h1>
                                </div>

                                <aside className="am-glass">
                                    <h4>Our activities amongst the world</h4>
                                    <p className="am-glass__sub">Global analysis</p>
                                    <ul className="am-glass__stats">
                                        {STATS.map(({ label, value }) => (
                                            <li key={label}>
                                                <span>{label}</span>
                                                <strong>{value}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </aside>
                            </section>

                            <div className="am-panel">
                                <nav className="am-tabs" aria-label="Admin sections">
                                    <ul>
                                        {TABS.map(({ to, label, end }) => (
                                            <li key={to}>
                                                <NavLink
                                                    to={to}
                                                    end={end}
                                                    className="am-tab"
                                                >
                                                    {label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                <div className="am-content">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
