import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/1.jpg"; // <-- change to your current background image

const FEATURES = [
    {
        to: "/projects",
        title: "Projects",
        text: "Follow every project from kickoff to delivery in one view.",
        icon: (
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        ),
    },
    {
        to: "/reports",
        title: "Reports",
        text: "Create, review and approve reports without the back and forth.",
        icon: (
            <>
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <polyline points="14 3 14 8 19 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
            </>
        ),
    },
    {
        to: "/activities",
        title: "Activities",
        text: "See what changed and who changed it, as it happens.",
        icon: <polyline points="3 12 7 12 10 4 14 20 17 12 21 12" />,
    },
];

function Home() {
    return (
        <>
            <section
                className="hm-hero"
                style={{ backgroundImage: `url(${heroImg})` }}
            >
                <div className="hm-hero-inner">
                    <span className="hm-eyebrow">
                        <i></i> Welcome to MidnightMoon
                    </span>

                    <h1>
                        A calmer way to run your <em>projects</em> and reports.
                    </h1>

                    <p>
                        Keep your work organized, your team in sync and every
                        report easy to find. Everything you need, in one
                        peaceful place.
                    </p>

                    <Link to="/about-us" className="hm-btn">
                        <span>Learn More</span>
                        <span className="hm-btn-arrow" aria-hidden="true">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </section>

            <section className="hm-cards">
                {FEATURES.map((f) => (
                    <Link to={f.to} key={f.to} className="hm-card">
                        <span className="hm-card-icon">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {f.icon}
                            </svg>
                        </span>
                        <h3>{f.title}</h3>
                        <p>{f.text}</p>
                    </Link>
                ))}
            </section>
        </>
    );
}

export default Home;
