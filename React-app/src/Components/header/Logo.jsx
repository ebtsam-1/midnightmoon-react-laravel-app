
export default function Logo({ size = 40, showText = true }) {
    return (
        <span className="mm-logo">
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                role="img"
                aria-label="MidnightMoon logo"
            >
                <defs>
                    <linearGradient id="mm-bg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#6db4f0" />
                        <stop offset="1" stopColor="#1f6fc2" />
                    </linearGradient>
                    <mask id="mm-cut">
                        <rect width="40" height="40" fill="#fff" />
                        <circle cx="25" cy="15" r="9" fill="#000" />
                    </mask>
                </defs>

                {/* rounded badge */}
                <rect width="40" height="40" rx="12" fill="url(#mm-bg)" />
                {/* crescent moon */}
                <circle cx="19" cy="21" r="11" fill="#fff" mask="url(#mm-cut)" />
                {/* gold star */}
                <path
                    d="M27 8.5l1.2 3.3 3.3 1.2-3.3 1.2L27 17.5l-1.2-3.3-3.3-1.2 3.3-1.2z"
                    fill="#f6d78f"
                />
                <circle cx="31.5" cy="21" r="1.2" fill="#f6d78f" opacity=".8" />
            </svg>

            {showText && (
                <span className="mm-logo-text">
                    Midnight<span>Moon</span>
                </span>
            )}
        </span>
    );
}
