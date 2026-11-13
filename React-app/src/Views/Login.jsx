import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AxiosClient from '../AxiosClient';
import toast from 'react-hot-toast';
import ErrorBox from '../Components/public/ErrorBox';
import { useStateContext } from '../Contexts/ContextProvider';

/* Illustration: a person logging in, in shades of blue */
function LoginArt() {
    return (
        <svg viewBox="0 0 440 400" className="lg-art" aria-hidden="true">
            {/* background blob + decoration */}
            <path
                d="M60 210C40 130 100 60 190 50C290 40 390 90 410 190C430 290 350 360 250 372C150 384 80 320 60 210Z"
                fill="#d6e9fb"
            />
            <circle cx="52" cy="82" r="10" fill="#bcdcf8" />
            <circle cx="412" cy="330" r="8" fill="#bcdcf8" />
            <circle cx="96" cy="300" r="5" fill="#a9d1f5" />
            <path d="M330 56l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff" />

            {/* ground shadow */}
            <ellipse cx="190" cy="368" rx="105" ry="9" fill="#bcdcf8" opacity=".7" />

            {/* plant */}
            <ellipse cx="62" cy="300" rx="11" ry="32" fill="#a9d1f5" transform="rotate(-24 62 300)" />
            <ellipse cx="84" cy="296" rx="11" ry="34" fill="#4a9ee8" transform="rotate(18 84 296)" />
            <ellipse cx="73" cy="290" rx="9" ry="36" fill="#1f6fc2" />
            <rect x="54" y="326" width="40" height="40" rx="8" fill="#4a9ee8" />
            <rect x="54" y="326" width="40" height="10" rx="5" fill="#1f6fc2" />

            {/* login card */}
            <rect x="286" y="116" width="132" height="178" rx="18" fill="#a9d1f5" />
            <rect x="276" y="104" width="132" height="178" rx="18" fill="#fff" />
            <circle cx="342" cy="142" r="15" fill="#bcdcf8" />
            <circle cx="342" cy="138" r="5" fill="#fff" />
            <path d="M332 152c2-6 18-6 20 0" fill="#fff" />
            <rect x="292" y="172" width="100" height="16" rx="8" fill="#eaf4fe" />
            <rect x="292" y="198" width="100" height="16" rx="8" fill="#eaf4fe" />
            <circle cx="304" cy="206" r="2.5" fill="#4a9ee8" />
            <circle cx="313" cy="206" r="2.5" fill="#4a9ee8" />
            <circle cx="322" cy="206" r="2.5" fill="#4a9ee8" />
            <circle cx="331" cy="206" r="2.5" fill="#4a9ee8" />
            <rect x="292" y="232" width="100" height="26" rx="13" fill="#1f6fc2" />
            <rect x="326" y="242" width="32" height="6" rx="3" fill="#fff" />

            {/* lock badge */}
            <circle cx="404" cy="98" r="24" fill="#1f6fc2" />
            <rect x="393" y="97" width="22" height="16" rx="4" fill="#fff" />
            <path d="M397 97v-5a7 7 0 0 1 14 0v5" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="404" cy="105" r="2.4" fill="#1f6fc2" />

            {/* ---------- person ---------- */}
            {/* back hair */}
            <path
                d="M150 142C146 108 168 96 182 98C204 100 210 124 204 150C204 168 208 180 212 192L150 192C154 176 152 160 150 142Z"
                fill="#12406e"
            />
            {/* legs */}
            <polygon points="150,262 176,262 170,358 148,358" fill="#12406e" />
            <polygon points="178,262 204,262 208,358 186,358" fill="#0d3358" />
            {/* shoes */}
            <rect x="140" y="355" width="36" height="12" rx="6" fill="#1f6fc2" />
            <rect x="184" y="355" width="36" height="12" rx="6" fill="#1f6fc2" />
            {/* left arm (down) */}
            <path d="M152 190L142 234" stroke="#4a9ee8" strokeWidth="18" strokeLinecap="round" />
            <path d="M142 234L147 262" stroke="#f2c4a2" strokeWidth="12" strokeLinecap="round" />
            <circle cx="148" cy="267" r="7" fill="#f2c4a2" />
            {/* torso */}
            <path
                d="M146 188C146 177 158 171 177 171C196 171 208 177 208 188L214 272L140 272Z"
                fill="#4a9ee8"
            />
            <path d="M160 172C168 186 186 186 194 172" stroke="#bcdcf8" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* neck + head */}
            <rect x="170" y="158" width="14" height="18" rx="6" fill="#f2c4a2" />
            <circle cx="177" cy="140" r="24" fill="#f2c4a2" />
            {/* fringe */}
            <path
                d="M153 138C155 116 170 108 182 110C196 112 203 124 201 138C190 128 172 126 153 138Z"
                fill="#12406e"
            />
            {/* right arm (raised toward the card) */}
            <path d="M204 190L236 214" stroke="#4a9ee8" strokeWidth="18" strokeLinecap="round" />
            <path d="M236 214L258 178" stroke="#f2c4a2" strokeWidth="12" strokeLinecap="round" />
            <circle cx="260" cy="173" r="8" fill="#f2c4a2" />
        </svg>
    );
}

function Login() {
    const {user, setUser,token,setToken} = useStateContext();
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e)=>{
        e.preventDefault();
        setLoading(true);
        setErrors({});
        const payload = {
            email:emailRef.current.value,
            password:passwordRef.current.value,
        }

        AxiosClient.post('/login', payload)
        .then(({data})=>{
            setLoading(false);
            setToken(data.token);
            setUser(data.user);
            setTimeout(()=>{navigate(data.user.role == 'admin' ? '/admin-panel' : '/')}, 1000);
        }).catch((error)=>{
            console.log(error.response);
            setLoading(false);
            const status = error.response?.status;
            if(status == 401 || status == 403){
                toast.error(error.response.data.message);
                setToken(null);
            }
            if(status == 422){
                setErrors(error.response.data.errors);
            }
            if(!error.response){
                toast.error("Can't reach the server. Please try again.");
            }
        });
    }

    return (
        <div className="lg-page">
            <div className="lg-card">
                {/* Section 1: illustration */}
                <aside className="lg-side">
                    <LoginArt />
                    <h3>Welcome back</h3>
                    <p>Pick up right where you left off. Your projects and reports are waiting.</p>
                </aside>

                {/* Section 2: form */}
                <div className="lg-form-wrap">
                    <h2>Login To Your Account</h2>
                    <p className="lg-sub">Enter your email and password to continue.</p>

                    <ErrorBox errors={errors}/>

                    <form onSubmit={submit} className="lg-form">
                        <label className="lg-field">
                            <span>Email</span>
                            <input
                                ref={emailRef}
                                type="text"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </label>

                        <label className="lg-field">
                            <span>Password</span>
                            <div className="lg-password">
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </label>

                        <button className="lg-submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className="lg-switch">
                            Don't have an account? <Link to="/register">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
