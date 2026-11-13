import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import AxiosClient from "../../AxiosClient";
import toast from "react-hot-toast";

const LINKS = [
    { to: "/projects", label: "Projects" },
    { to: "/reports", label: "Reports" },
    { to: "/activities", label: "Activities" },
    { to: "/products", label: "Products" },
    { to: "/about-us", label: "About Us" },
    { to: "/contact-us", label: "Contact us" },
];

function UserHeader() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    function logout() {
        AxiosClient.post("/logout")
            .then(({ data }) => {
                localStorage.removeItem("ACCESS_TOKEN");
                setTimeout(() => navigate("/login"));
            })
            .catch((err) => {
                localStorage.removeItem("ACCESS_TOKEN");
                toast.success("Logged out successfully");
                setTimeout(() => navigate("/login"));
            });
    }

    return (
        <header className="uh">
            <div className="uh-inner">
                {/* Logo */}
                <Link to="/" className="uh-logo" aria-label="Home">
                    <Logo />
                </Link>
                {/* Navigation */}
                <nav className={`uh-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main">
                    {LINKS.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `uh-link ${isActive ? "is-active" : ""}`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Search + logout */}
                <div className="uh-actions">
                    <label className="uh-search">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7"></circle>
                            <line x1="21" y1="21" x2="16.5" y2="16.5"></line>
                        </svg>
                        <input type="text" placeholder="Search" />
                    </label>

                    <button
                        type="button"
                        className="uh-logout"
                        onClick={logout}
                        aria-label="Log out"
                        title="Log out"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="uh-burger"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default UserHeader;
