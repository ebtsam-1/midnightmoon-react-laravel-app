
const EXPLORE = [
  { label: "Projects", href: "/projects" },
  { label: "Reports", href: "/reports" },
  { label: "Activities", href: "/activities" },
  { label: "Products", href: "/products" },
];

const COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="ft">
      {/* wave edge on top */}
      <svg className="ft-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40C180 0 340 80 560 50s360-60 560-30 220 30 320 10V80H0z" fill="#12406e" />
      </svg>

      <div className="ft-body">
        <div className="ft-inner">
          <div className="ft-brand">
            <div className="ft-logo">
              Midnight<span>Moon</span>
            </div>
            <p>Keep every project, report and update in one calm, organized place.</p>
          </div>

          <nav className="ft-col" aria-label="Explore">
            <h4>Explore</h4>
            {EXPLORE.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>

          <nav className="ft-col" aria-label="Company">
            <h4>Company</h4>
            {COMPANY.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>

          <div className="ft-col">
            <h4>Get in touch</h4>
            <a href="mailto:hello@midnightmoon.com">hello@midnightmoon.com</a>
            <a href="/contact" className="ft-cta">Contact us</a>
          </div>
        </div>

        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} MidnightMoon. All rights reserved.</span>
          <span className="ft-bottom-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
