import { Link } from 'react-router-dom';

/* ---------- Edit this content to match your real company ---------- */
const STATS = [
    { num: '500+', label: 'Reports created', tone: 'blue' },
    { num: '120+', label: 'Projects tracked', tone: 'green' },
    { num: '50+', label: 'Happy teams', tone: 'amber' },
    { num: '24/7', label: 'Always available', tone: 'coral' },
];

const VALUES = [
    {
        title: 'Clarity',
        text: 'Every project, report and update is easy to find and easy to understand.',
        tone: 'blue',
        icon: (
            <>
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </>
        ),
    },
    {
        title: 'Calm',
        text: 'A peaceful workspace with no clutter, so your team can focus on what matters.',
        tone: 'green',
        icon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
    },
    {
        title: 'Care',
        text: 'We build for real people, listen to feedback and keep improving every day.',
        tone: 'coral',
        icon: (
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
        ),
    },
];

/* Illustration: a moonlit hill with a flag */
function AboutArt() {
    return (
        <svg viewBox="0 0 440 340" className="pg-hero-art" aria-hidden="true">
            <defs>
                <clipPath id="pg-about-clip">
                    <circle cx="220" cy="170" r="150" />
                </clipPath>
            </defs>
            <circle cx="220" cy="170" r="160" fill="#d6e9fb" />
            <circle cx="220" cy="170" r="150" fill="#12406e" />

            <g clipPath="url(#pg-about-clip)">
                {/* moon */}
                <circle cx="196" cy="128" r="64" fill="#ffe9b0" />
                <circle cx="226" cy="108" r="56" fill="#12406e" />
                {/* stars */}
                <path d="M290 90l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff" />
                <path d="M120 80l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#fff" />
                <circle cx="330" cy="150" r="3" fill="#fff" />
                <circle cx="100" cy="150" r="2.5" fill="#bcdcf8" />
                <circle cx="260" cy="60" r="2.5" fill="#bcdcf8" />
                {/* hills */}
                <path d="M60 300C120 230 200 220 280 250C340 272 380 260 400 270V340H60Z" fill="#1f6fc2" />
                <path d="M60 330C140 270 240 280 320 300C360 310 390 306 400 310V340H60Z" fill="#4a9ee8" />
                {/* flag */}
                <line x1="250" y1="250" x2="250" y2="206" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                <path d="M250 206l26 8-26 8z" fill="#f26b5b" />
            </g>

            <circle cx="372" cy="70" r="9" fill="#ffd36b" />
            <circle cx="62" cy="262" r="7" fill="#bcdcf8" />
        </svg>
    );
}

function AboutUs() {
    return (
        <main className="pg-wrap">
            {/* Hero */}
            <section className="pg-hero">
                <div className="pg-hero-text">
                    <span className="pg-eyebrow"><i></i> About MidnightMoon</span>
                    <h1>We help teams work <em>calmer</em> and smarter.</h1>
                    <p>
                        MidnightMoon brings your projects, reports and activities into one
                        peaceful place, so nothing gets lost and everyone stays in sync.
                    </p>
                    <div className="pg-btn-row">
                        <Link to="/contact-us" className="pg-btn pg-btn--primary">Get in touch</Link>
                        <Link to="/projects" className="pg-btn pg-btn--ghost">See projects</Link>
                    </div>
                </div>
                <AboutArt />
            </section>

            {/* Story + stats */}
            <section className="pg-story">
                <article className="pg-card">
                    <h2 className="pg-title">Our story</h2>
                    <p>
                        We started MidnightMoon because keeping track of work shouldn't feel
                        stressful. Too many tools, too many messages and too many late nights
                        spent hunting for one report.
                    </p>
                    <p>
                        So we built a simple space where projects, reports and activities
                        live together. It is quiet, clear and easy to use, like a calm night
                        sky for your work.
                    </p>
                </article>

                <div className="pg-stats">
                    {STATS.map((s) => (
                        <div key={s.label} className={`pg-stat pg-stat--${s.tone}`}>
                            <strong>{s.num}</strong>
                            <span>{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section>
                <h2 className="pg-title pg-title--center">What we believe in</h2>
                <div className="pg-values">
                    {VALUES.map((v) => (
                        <article key={v.title} className="pg-card pg-value">
                            <span className={`pg-icon pg-icon--${v.tone}`}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {v.icon}
                                </svg>
                            </span>
                            <h3>{v.title}</h3>
                            <p>{v.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Call to action */}
            <section className="pg-cta">
                <div>
                    <h2>Have a question or an idea?</h2>
                    <p>We would love to hear from you.</p>
                </div>
                <Link to="/contact-us" className="pg-btn pg-btn--light">Contact us</Link>
            </section>
        </main>
    );
}

export default AboutUs;
