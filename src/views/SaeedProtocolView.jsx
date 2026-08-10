import { useState, useEffect, useCallback } from "react";

const TODAY_KEY = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const ANYTIME = [
  { id: "pushups", label: "Push-ups", unit: "reps", target: 500, step: 25, color: "#FF4B3E" },
  { id: "vacuums", label: "Stomach Vacuums", unit: "sets", target: 15, step: 1, color: "#C0FF72", note: "30–60s hold, exhale fully" },
  { id: "hollow", label: "Hollow Body Holds", unit: "sets", target: 7, step: 1, color: "#01A0A1", note: "30–60s hold" },
  { id: "rows", label: "Doorframe Rows", unit: "reps", target: 125, step: 10, color: "#FFC93C" },
];

const GROWTH = [
  { id: "pike", label: "Pike Push-ups", scheme: "4 x 10–12" },
  { id: "split", label: "Bulgarian Split Squats", scheme: "4 x 12" },
  { id: "vups", label: "Weighted V-Ups", scheme: "4 x 15" },
  { id: "curls", label: "Bicep Curls (jugs)", scheme: "4 x 20" },
  { id: "plank", label: "Plank → Down Dog", scheme: "3 x 15" },
];

const BLANK_DAY = () => ({
  bend: false,
  morningVacuums: false,
  anytime: { pushups: 0, vacuums: 0, hollow: 0, rows: 0 },
  growth: { pike: 0, split: 0, vups: 0, curls: 0, plank: 0 },
});

function useDay(dateKey) {
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    try {
      const res = localStorage.getItem(`bufflog:${dateKey}`);
      if (!cancelled) setDay(res ? JSON.parse(res) : BLANK_DAY());
    } catch {
      if (!cancelled) setDay(BLANK_DAY());
    }
    if (!cancelled) setLoading(false);
    return () => { cancelled = true; };
  }, [dateKey]);

  const save = useCallback((next) => {
    setDay(next);
    try {
      localStorage.setItem(`bufflog:${dateKey}`, JSON.stringify(next));
    } catch (e) {
      console.error("save failed", e);
    }
  }, [dateKey]);

  return { day, save, loading };
}

function Bar({ pct, color }) {
  return (
    <div style={{ height: 14, background: "#fff", border: "3px solid #111", position: "relative", overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, transition: "width 200ms" }} />
    </div>
  );
}

function AnytimeCard({ cfg, value, onChange }) {
  const pct = (value / cfg.target) * 100;
  const done = value >= cfg.target;
  return (
    <div style={{
      border: "4px solid #111",
      background: done ? cfg.color : "#fff",
      boxShadow: "6px 6px 0 #111",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16, textTransform: "uppercase" }}>{cfg.label}</span>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22 }}>{value}<span style={{ fontSize: 12, opacity: 0.6 }}>/{cfg.target}</span></span>
      </div>
      {cfg.note && <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>{cfg.note}</div>}
      <Bar pct={pct} color="#111" />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onChange(Math.max(0, value - cfg.step))}
          style={btnStyle("#fff")}
        >−{cfg.step}</button>
        <button
          onClick={() => onChange(value + cfg.step)}
          style={btnStyle(cfg.color)}
        >+{cfg.step} {cfg.unit}</button>
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    flex: 1,
    border: "3px solid #111",
    background: bg,
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 13,
    padding: "10px 6px",
    cursor: "pointer",
    boxShadow: "3px 3px 0 #111",
    textTransform: "uppercase",
  };
}

function GrowthRow({ cfg, count, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "3px solid #111",
        background: count >= 4 ? "#111" : "#fff",
        color: count >= 4 ? "#F5F0E6" : "#111",
        padding: "10px 14px",
        marginBottom: 8,
        cursor: "pointer",
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 13,
      }}
    >
      <div>
        <div style={{ textTransform: "uppercase" }}>{cfg.label}</div>
        <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 400 }}>{cfg.scheme}</div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: 16, height: 16,
            border: "2px solid " + (count >= 4 ? "#F5F0E6" : "#111"),
            background: i < count ? "#C0FF72" : "transparent",
          }} />
        ))}
      </div>
    </div>
  );
}

export default function SaeedProtocolView() {
  const dateKey = TODAY_KEY();
  const { day, save, loading } = useDay(dateKey);
  const [tab, setTab] = useState("today");
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);

  useEffect(() => {
    if (tab !== "history") return;
    setHistLoading(true);
    try {
      const rows = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith("bufflog:")) {
          const r = localStorage.getItem(k);
          if (r) rows.push({ date: k.replace("bufflog:", ""), data: JSON.parse(r) });
        }
      }
      rows.sort((a, b) => (a.date < b.date ? 1 : -1));
      setHistory(rows.slice(0, 30));
    } catch (e) {
      console.error(e);
    }
    setHistLoading(false);
  }, [tab]);

  if (loading || !day) {
    return (
      <div style={{ fontFamily: "monospace", padding: 40, textAlign: "center" }}>Loading…</div>
    );
  }

  const setAnytime = (id, val) => save({ ...day, anytime: { ...day.anytime, [id]: val } });
  const bumpGrowth = (id) => {
    const cur = day.growth[id] || 0;
    const next = cur >= 4 ? 0 : cur + 1;
    save({ ...day, growth: { ...day.growth, [id]: next } });
  };

  const anytimeDoneCount = ANYTIME.filter((c) => day.anytime[c.id] >= c.target).length;
  const growthDoneCount = GROWTH.filter((c) => (day.growth[c.id] || 0) >= 4).length;
  const allDone = anytimeDoneCount === ANYTIME.length && growthDoneCount === GROWTH.length && day.bend;

  return (
    <div style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: "#F5F0E6",
      minHeight: "100vh",
      color: "#111",
      paddingBottom: 40,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        * { box-sizing: border-box; }
        button:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #111 !important; }
      `}</style>

      <div style={{ background: "#111", color: "#F5F0E6", padding: "20px 16px 16px" }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, letterSpacing: -0.5, textTransform: "uppercase" }}>
          Buff Protocol
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{dateKey} {allDone && "· ALL DONE 🔥"}</div>
      </div>

      <div style={{ display: "flex", borderBottom: "4px solid #111" }}>
        {["today", "history"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: 12,
              border: "none",
              borderRight: t === "today" ? "4px solid #111" : "none",
              background: tab === t ? "#C0FF72" : "#F5F0E6",
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 13,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Bend / Yoga check */}
          <div
            onClick={() => save({ ...day, bend: !day.bend })}
            style={{
              border: "4px solid #111",
              background: day.bend ? "#01A0A1" : "#fff",
              color: day.bend ? "#F5F0E6" : "#111",
              boxShadow: "6px 6px 0 #111",
              padding: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 18, textTransform: "uppercase" }}>Bend (Yoga)</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Morning session, empty stomach</div>
            </div>
            <div style={{
              width: 32, height: 32, border: "3px solid " + (day.bend ? "#F5F0E6" : "#111"),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Archivo Black', sans-serif",
            }}>{day.bend ? "✓" : ""}</div>
          </div>

          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, textTransform: "uppercase", marginBottom: 10, borderBottom: "3px solid #111", paddingBottom: 4 }}>
              Anytime List — {anytimeDoneCount}/{ANYTIME.length} hit
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              {ANYTIME.map((cfg) => (
                <AnytimeCard key={cfg.id} cfg={cfg} value={day.anytime[cfg.id] || 0} onChange={(v) => setAnytime(cfg.id, v)} />
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, textTransform: "uppercase", marginBottom: 10, borderBottom: "3px solid #111", paddingBottom: 4 }}>
              Growth Session — tap to log a set
            </div>
            {GROWTH.map((cfg) => (
              <GrowthRow key={cfg.id} cfg={cfg} count={day.growth[cfg.id] || 0} onToggle={() => bumpGrowth(cfg.id)} />
            ))}
          </div>

          <div style={{ border: "3px dashed #111", padding: 12, fontSize: 11, lineHeight: 1.5 }}>
            <b>Sharp pain in lower back on Hollow Holds/V-ups = stop.</b> Rest 5 min, breathe, then continue. Missed an hour? Double up next set — total daily volume is what counts.
          </div>
        </div>
      )}

      {tab === "history" && (
        <div style={{ padding: 16 }}>
          {histLoading && <div>Loading…</div>}
          {!histLoading && history.length === 0 && (
            <div style={{ border: "3px dashed #111", padding: 20, textAlign: "center", fontSize: 13 }}>
              No days logged yet. Get to work.
            </div>
          )}
          {history.map((h) => {
            const doneCount = ANYTIME.filter((c) => (h.data.anytime?.[c.id] || 0) >= c.target).length;
            const gDone = GROWTH.filter((c) => (h.data.growth?.[c.id] || 0) >= 4).length;
            return (
              <div key={h.date} style={{
                border: "3px solid #111", marginBottom: 10, padding: 12,
                background: h.data.bend && doneCount === ANYTIME.length ? "#C0FF72" : "#fff",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Archivo Black', sans-serif", fontSize: 13 }}>
                  <span>{h.date}</span>
                  <span>{h.data.bend ? "Bend ✓" : "Bend ✗"}</span>
                </div>
                <div style={{ fontSize: 11, marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {ANYTIME.map((c) => (
                    <span key={c.id}>{c.label}: {h.data.anytime?.[c.id] || 0}/{c.target}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>Growth exercises maxed: {gDone}/{GROWTH.length}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
