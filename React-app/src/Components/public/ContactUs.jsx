import { useState } from 'react';
import toast from 'react-hot-toast';
import AxiosClient from '../../AxiosClient';

/* ---------- Edit these to your real contact details ---------- */
const INFO = [
    {
        label: 'Email us',
        value: 'hello@midnightmoon.com',
        tone: 'blue',
        icon: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <polyline points="3 7 12 13 21 7" />
            </>
        ),
    },
    {
        label: 'Call us',
        value: '+20 000 000 0000',
        tone: 'green',
        icon: (
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
        ),
    },
    {
        label: 'Visit us',
        value: 'Cairo, Egypt',
        tone: 'coral',
        icon: (
            <>
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </>
        ),
    },
    {
        label: 'Working hours',
        value: 'Sun to Thu, 9am to 5pm',
        tone: 'amber',
        icon: (
            <>
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
            </>
        ),
    },
];

const EMPTY = { name: '', email: '', subject: '', message: '' };

/* Illustration: an envelope, a paper plane and chat bubbles */
function ContactArt() {
    return (
        <svg viewBox="0 0 440 300" className="pg-hero-art" aria-hidden="true">
            <path
                d="M50 160C36 98 84 44 154 36C232 26 326 54 346 120C366 192 312 260 232 270C148 280 66 232 50 160Z"
                fill="#d6e9fb"
            />
            <circle cx="392" cy="212" r="9" fill="#bcdcf8" />
            <circle cx="48" cy="250" r="7" fill="#ffd36b" />
            <path d="M360 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#ffd36b" />

            {/* envelope */}
            <rect x="110" y="110" width="210" height="136" rx="16" fill="#fff" />
            <path d="M126 122h178l-89 66z" fill="#d6e9fb" />
            <path d="M118 238l72-62M312 238l-72-62" stroke="#eaf4fe" strokeWidth="4" strokeLinecap="round" />

            {/* paper plane + trail */}
            <path d="M318 96L396 58L360 134L346 108Z" fill="#f26b5b" />
            <path d="M346 108L396 58L330 100Z" fill="#d9604f" />
            <path d="M300 130C310 150 280 160 270 140" stroke="#bcdcf8" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" fill="none" />

            {/* chat bubbles */}
            <rect x="52" y="82" width="86" height="46" rx="16" fill="#4a9ee8" />
            <path d="M72 128l-6 16 20-16z" fill="#4a9ee8" />
            <circle cx="78" cy="105" r="4" fill="#fff" />
            <circle cx="95" cy="105" r="4" fill="#fff" />
            <circle cx="112" cy="105" r="4" fill="#fff" />

            <rect x="300" y="196" width="80" height="42" rx="15" fill="#ffb84d" />
            <path d="M352 238l8 14-22-14z" fill="#ffb84d" />
            <rect x="316" y="210" width="48" height="6" rx="3" fill="#fff" />
            <rect x="316" y="222" width="30" height="6" rx="3" fill="#fff" opacity=".8" />
        </svg>
    );
}

function ContactUs() {
    const [form, setForm] = useState(EMPTY);
    const [sending, setSending] = useState(false);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        setSending(true);

        // Needs a POST /contact route in your Laravel API (change the URL if yours is different)
        AxiosClient.post('/contact', form)
            .then(() => {
                toast.success('Message sent. We will get back to you soon.');
                setForm(EMPTY);
            })
            .catch((error) => {
                const errs = error.response?.data?.errors;
                toast.error(
                    errs
                        ? Object.values(errs).flat()[0]
                        : error.response?.data?.message || "Couldn't send your message. Please try again.",
                );
            })
            .finally(() => setSending(false));
    };

    return (
        <main className="pg-wrap">
            {/* Hero */}
            <section className="pg-hero">
                <div className="pg-hero-text">
                    <span className="pg-eyebrow"><i></i> Contact us</span>
                    <h1>Let's <em>talk</em>. We are happy to help.</h1>
                    <p>
                        Questions, feedback or ideas? Send us a message and we will reply as
                        soon as we can.
                    </p>
                </div>
                <ContactArt />
            </section>

            <section className="pg-contact-grid">
                {/* Info cards */}
                <div className="pg-info-list">
                    {INFO.map((i) => (
                        <div key={i.label} className="pg-card pg-info">
                            <span className={`pg-icon pg-icon--${i.tone}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {i.icon}
                                </svg>
                            </span>
                            <div>
                                <small>{i.label}</small>
                                <strong>{i.value}</strong>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form className="pg-card pg-contact-form" onSubmit={submit}>
                    <h2 className="pg-title">Send us a message</h2>

                    <div className="pg-form-row">
                        <label className="pg-field">
                            <span>Your name</span>
                            <input
                                className="pg-input"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                            />
                        </label>
                        <label className="pg-field">
                            <span>Email</span>
                            <input
                                className="pg-input"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </label>
                    </div>

                    <label className="pg-field">
                        <span>Subject</span>
                        <input
                            className="pg-input"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="How can we help?"
                            required
                        />
                    </label>

                    <label className="pg-field">
                        <span>Message</span>
                        <textarea
                            className="pg-input"
                            name="message"
                            rows={5}
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Write your message here..."
                            required
                        />
                    </label>

                    <button className="pg-submit" disabled={sending}>
                        {sending ? 'Sending...' : 'Send message'}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default ContactUs;
