// Small helpers shared by the Reports and Activities pages

export const initials = (name = "?") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") || "?";

export const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "-";

export const formatTime = (iso) =>
    iso
        ? new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
        : "";

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// "Today", "Yesterday" or "Sat, 4 Oct 2026"
export const dayLabel = (iso) => {
    if (!iso) return "Unknown date";
    const d = new Date(iso);
    const diff = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// Stable avatar tone from a name, picked from the MidnightMoon palette
const AVATAR_TONES = ["#7b3f7e", "#5a2a5e", "#a05a9f", "#8a5a8f", "#6b4a8e", "#9b6b9e"];
export const avatarColor = (name = "") => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return AVATAR_TONES[h % AVATAR_TONES.length];
};
