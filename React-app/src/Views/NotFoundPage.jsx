// Views/NotFoundPage.jsx
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="nf-wrap">
            <style>{`
                .nf-wrap {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #F5EFFF 0%, #FFE9F3 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                }
                .nf-card {
                    display: flex;
                    align-items: center;
                    gap: 48px;
                    max-width: 780px;
                    width: 100%;
                }
                .nf-illustration {
                    flex-shrink: 0;
                    width: 260px;
                    animation: nf-float 3.5s ease-in-out infinite;
                }
                @keyframes nf-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-14px); }
                }
                .nf-text { max-width: 340px; }
                .nf-number {
                    font-size: 17px;
                    font-weight: 700;
                    color: #FF8C6B;
                    margin: 0 0 14px;
                    letter-spacing: 0.02em;
                }
                .nf-title {
                    font-size: 30px;
                    font-weight: 700;
                    color: #3C2A4D;
                    line-height: 1.25;
                    margin: 0 0 14px;
                }
                .nf-body {
                    font-size: 15.5px;
                    line-height: 1.65;
                    color: #6B5A7D;
                    margin: 0 0 30px;
                }
                .nf-actions { display: flex; gap: 12px; flex-wrap: wrap; }
                .nf-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 11px 20px;
                    border-radius: 999px;
                    font-size: 14.5px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }
                .nf-btn-primary {
                    background: #FF8C6B;
                    color: #fff;
                    box-shadow: 0 6px 16px rgba(255, 140, 107, 0.35);
                }
                .nf-btn-primary:hover { transform: translateY(-2px); }
                .nf-btn-secondary {
                    background: #fff;
                    color: #3C2A4D;
                    border: 1px solid #E8DCF2;
                }
                .nf-btn-secondary:hover { transform: translateY(-2px); }
                @media (max-width: 640px) {
                    .nf-card { flex-direction: column; text-align: center; gap: 24px; }
                    .nf-illustration { width: 200px; }
                    .nf-text { max-width: 100%; }
                    .nf-actions { justify-content: center; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .nf-illustration { animation: none; }
                    .nf-btn { transition: none; }
                }
            `}</style>

            <div className="nf-card">
                <svg
                    className="nf-illustration"
                    viewBox="0 0 260 260"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* soft ground shadow */}
                    <ellipse cx="130" cy="230" rx="70" ry="12" fill="#E8DCF2" />

                    {/* stars */}
                    <circle cx="35" cy="50" r="3" fill="#FFC29A" />
                    <circle cx="225" cy="70" r="4" fill="#7FD8BE" />
                    <circle cx="210" cy="180" r="3" fill="#FF8C6B" />
                    <circle cx="45" cy="170" r="2.5" fill="#B8A6D9" />

                    {/* small planet */}
                    <circle cx="215" cy="45" r="16" fill="#7FD8BE" opacity="0.85" />
                    <ellipse cx="215" cy="45" rx="24" ry="6" stroke="#5FC1A6" strokeWidth="2" fill="none" />

                    {/* robot body */}
                    <rect x="90" y="110" width="80" height="70" rx="20" fill="#B8A6D9" />
                    <rect x="90" y="110" width="80" height="70" rx="20" fill="url(#bodyGrad)" />

                    {/* robot head */}
                    <rect x="98" y="60" width="64" height="56" rx="18" fill="#FFFFFF" stroke="#E8DCF2" strokeWidth="2" />

                    {/* antenna */}
                    <line x1="130" y1="60" x2="130" y2="42" stroke="#B8A6D9" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="130" cy="36" r="7" fill="#FF8C6B" />

                    {/* eyes */}
                    <circle cx="117" cy="88" r="7" fill="#3C2A4D" />
                    <circle cx="143" cy="88" r="7" fill="#3C2A4D" />
                    <circle cx="119" cy="86" r="2" fill="#fff" />
                    <circle cx="145" cy="86" r="2" fill="#fff" />

                    {/* confused mouth */}
                    <path d="M118 102 Q130 96 142 102" stroke="#3C2A4D" strokeWidth="3" strokeLinecap="round" fill="none" />

                    {/* arms */}
                    <rect x="66" y="118" width="26" height="14" rx="7" fill="#B8A6D9" transform="rotate(-20 66 118)" />
                    <rect x="168" y="118" width="26" height="14" rx="7" fill="#B8A6D9" transform="rotate(20 194 118)" />

                    {/* legs */}
                    <rect x="102" y="178" width="16" height="22" rx="6" fill="#9B87C4" />
                    <rect x="142" y="178" width="16" height="22" rx="6" fill="#9B87C4" />

                    {/* held map */}
                    <rect x="150" y="128" width="34" height="26" rx="3" fill="#FFF" stroke="#E8DCF2" strokeWidth="2" transform="rotate(12 150 128)" />
                    <path d="M158 138 L172 134 M158 144 L168 141" stroke="#B8A6D9" strokeWidth="2" strokeLinecap="round" transform="rotate(12 150 128)" />

                    {/* question mark bubble */}
                    <circle cx="196" cy="98" r="15" fill="#FFFFFF" stroke="#FFC29A" strokeWidth="2" />
                    <text x="196" y="104" fontSize="16" fontWeight="700" fill="#FF8C6B" textAnchor="middle">?</text>

                    <defs>
                        <linearGradient id="bodyGrad" x1="90" y1="110" x2="170" y2="180" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#C4B3E3" />
                            <stop offset="1" stopColor="#B8A6D9" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="nf-text">
                    <p className="nf-number">404</p>
                    <h1 className="nf-title">Lost in space, little robot?</h1>
                    <p className="nf-body">
                        This page doesn't exist — maybe it moved, maybe it never did.
                        Let's get you back on track.
                    </p>
                    <div className="nf-actions">
                        <Link to="/" className="nf-btn nf-btn-primary">
                            Take me home
                        </Link>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;