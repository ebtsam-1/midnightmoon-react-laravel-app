import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AxiosClient from '../AxiosClient';
import ErrorBox from '../Components/public/ErrorBox';
import { useStateContext } from '../Contexts/ContextProvider';

/* Illustration: a person celebrating a new account */
function RegisterArt() {
    return (
        <svg viewBox="0 0 440 400" className="pg-auth-svg" aria-hidden="true">
            {/* blob + confetti */}
            <path
                d="M60 210C40 130 100 60 190 50C290 40 390 90 410 190C430 290 350 360 250 372C150 384 80 320 60 210Z"
                fill="#d6e9fb"
            />
            <rect x="70" y="86" width="10" height="18" rx="3" fill="#f26b5b" transform="rotate(25 75 95)" />
            <rect x="350" y="64" width="10" height="18" rx="3" fill="#ffb84d" transform="rotate(-30 355 73)" />
            <rect x="402" y="236" width="9" height="16" rx="3" fill="#3fbf9a" transform="rotate(20 406 244)" />
            <rect x="46" y="250" width="9" height="16" rx="3" fill="#4a9ee8" transform="rotate(-20 50 258)" />
            <circle cx="140" cy="62" r="6" fill="#ffb84d" />
            <circle cx="300" cy="46" r="5" fill="#f26b5b" />
            <circle cx="410" cy="150" r="6" fill="#3fbf9a" />
            <circle cx="40" cy="170" r="5" fill="#ffb84d" />
            <path d="M118 36l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#ffb84d" />
            <path d="M380 296l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#f26b5b" />

            <ellipse cx="238" cy="368" rx="110" ry="9" fill="#bcdcf8" opacity=".7" />

            {/* plus badge */}
            <circle cx="88" cy="200" r="22" fill="#4a9ee8" />
            <path d="M88 189v22M77 200h22" stroke="#fff" strokeWidth="5" strokeLinecap="round" />

            {/* welcome card */}
            <rect x="330" y="160" width="104" height="132" rx="16" fill="#bcdcf8" />
            <rect x="320" y="148" width="104" height="132" rx="16" fill="#fff" />
            <circle cx="372" cy="184" r="17" fill="#ffb84d" />
            <circle cx="372" cy="179" r="6" fill="#fff" />
            <path
                d="M360 195c2-7 22-7 24 0"
                fill="#fff"
            />
            <rect x="336" y="212" width="72" height="9" rx="4.5" fill="#eaf4fe" />
            <rect x="336" y="228" width="52" height="9" rx="4.5" fill="#eaf4fe" />
            <rect x="336" y="246" width="72" height="20" rx="10" fill="#f26b5b" />
            <circle cx="416" cy="148" r="18" fill="#3fbf9a" />
            <path d="M408 148l6 6 11-12" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* ---------- person ---------- */}
            <g transform="translate(50 0)">
                {/* back hair */}
                <path
                    d="M150 142C146 108 168 96 182 98C204 100 210 124 204 150C204 168 208 180 212 192L150 192C154 176 152 160 150 142Z"
                    fill="#3b2a3f"
                />
                {/* legs */}
                <polygon points="150,262 176,262 170,358 148,358" fill="#1f6fc2" />
                <polygon points="178,262 204,262 208,358 186,358" fill="#1b5fa8" />
                {/* shoes */}
                <rect x="140" y="355" width="36" height="12" rx="6" fill="#f26b5b" />
                <rect x="184" y="355" width="36" height="12" rx="6" fill="#f26b5b" />
                {/* torso */}
                <path
                    d="M146 188C146 177 158 171 177 171C196 171 208 177 208 188L214 272L140 272Z"
                    fill="#ffb84d"
                />
                <path d="M160 172C168 186 186 186 194 172" stroke="#ffd98f" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* neck + head */}
                <rect x="170" y="158" width="14" height="18" rx="6" fill="#f2c4a2" />
                <circle cx="177" cy="140" r="24" fill="#f2c4a2" />
                <path
                    d="M153 138C155 116 170 108 182 110C196 112 203 124 201 138C190 128 172 126 153 138Z"
                    fill="#3b2a3f"
                />
                {/* both arms raised */}
                <path d="M152 190L128 160" stroke="#ffb84d" strokeWidth="18" strokeLinecap="round" />
                <path d="M128 160L116 124" stroke="#f2c4a2" strokeWidth="12" strokeLinecap="round" />
                <circle cx="115" cy="118" r="8" fill="#f2c4a2" />
                <path d="M204 190L228 160" stroke="#ffb84d" strokeWidth="18" strokeLinecap="round" />
                <path d="M228 160L240 124" stroke="#f2c4a2" strokeWidth="12" strokeLinecap="round" />
                <circle cx="241" cy="118" r="8" fill="#f2c4a2" />
            </g>
        </svg>
    );
}

/* 0 to 4 */
function passwordStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return pw ? Math.max(1, score) : 0;
}
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function Register() {
    const { setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please choose an image file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('The image must be 2MB or smaller.');
            return;
        }
        if (preview) URL.revokeObjectURL(preview);
        setAvatar(file);
        setPreview(URL.createObjectURL(file));
    };

    const strength = passwordStrength(form.password);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // FormData is required because the request carries a file
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        if (avatar) formData.append('avatar', avatar);

        AxiosClient.post('/register', formData)
            .then(({ data }) => {
                setLoading(false);
                setToken(data.token);
                setUser(data.user);
                toast.success('Account created successfully');
                setTimeout(() => navigate('/'), 1000);
            })
            .catch((error) => {
                setLoading(false);
                const status = error.response?.status;
                if (status == 422) {
                    setErrors(error.response.data.errors);
                } else if (!error.response) {
                    toast.error("Can't reach the server. Please try again.");
                } else {
                    toast.error(error.response.data?.message || 'Something went wrong.');
                }
            });
    };

    return (
        <div className="pg-auth">
            <div className="pg-auth-card">
                {/* Section 1: form */}
                <div className="pg-auth-form">
                    <h2>Create your account</h2>
                    <p className="pg-auth-sub">It only takes a minute to get started.</p>

                    <ErrorBox errors={errors} />

                    <form onSubmit={submit} className="pg-form">
                        <div className="pg-avatar">
                            <label className="pg-avatar-pick" title="Choose a photo">
                                {preview ? (
                                    <img src={preview} alt="Avatar preview" />
                                ) : (
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                                    </svg>
                                )}
                                <span className="pg-avatar-badge">+</span>
                                <input type="file" accept="image/*" onChange={handleAvatar} hidden />
                            </label>
                            <div>
                                <strong>Profile photo</strong>
                                <small>Optional. JPG or PNG, up to 2MB.</small>
                            </div>
                        </div>

                        <label className="pg-field">
                            <span>Full name</span>
                            <input
                                className="pg-input"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                autoComplete="name"
                            />
                        </label>

                        <label className="pg-field">
                            <span>Email</span>
                            <input
                                className="pg-input"
                                name="email"
                                type="text"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </label>

                        <label className="pg-field">
                            <span>Password</span>
                            <div className="pg-password">
                                <input
                                    className="pg-input"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {strength > 0 && (
                                <div className="pg-strength" aria-live="polite">
                                    <div className={`pg-meter s${strength}`}>
                                        <i></i><i></i><i></i><i></i>
                                    </div>
                                    <small>{STRENGTH_LABELS[strength]}</small>
                                </div>
                            )}
                        </label>

                        <label className="pg-field">
                            <span>Confirm password</span>
                            <input
                                className="pg-input"
                                name="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password_confirmation}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                            />
                        </label>

                        <button className="pg-submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>

                        <p className="pg-switch">
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                    </form>
                </div>

                {/* Section 2: illustration */}
                <aside className="pg-auth-art">
                    <RegisterArt />
                    <h3>Join MidnightMoon</h3>
                    <p>Organize your projects and reports in one calm, bright place.</p>
                </aside>
            </div>
        </div>
    );
}

export default Register;
