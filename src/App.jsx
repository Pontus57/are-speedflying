import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pmcaffqqkvqnvpvbaknn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtY2FmZnFxa3ZxbnZwdmJha25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzA3NTIsImV4cCI6MjA4OTUwNjc1Mn0.KtSRzQ589Sy2Zk27REhrc2v9MX_5JTfhRX6QkvjUqkg";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fallback data used only if Supabase is unreachable
const LAUNCHES_FALLBACK = [
  { id: 1, name: "1000meter", description: "Klassisk PG-start. Bra utrymme att lägga ut och springa på. Branten ökar mot slutet – se till att ha bra tryck i skärmen mot sista biten.", wind: ["Östlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Lätt", high: "Medel" }, summer: { low: "Medel", mid: "Lätt", high: "Medel" } }, coords: { lat: 63.3950, lng: 13.0820 } },
  { id: 2, name: "Rappet Väst", description: "Rimligt lång sträcka att springa på, gräs i ökande lutning som övergår till en brantare klippa. Se till att ha tryck i skärmen i god tid, eller avbryt i god tid innan klippan. Vid för mycket nordliga inslag kan man uppleva sjunk efter start – risk att slå i marken ca 20 meter under start. Ha god koll på din skärm och lokala vindar vid nordvästlig vind.", wind: ["Västlig", "Nord-Västlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Lätt", high: "Medel" }, summer: { low: "Medel", mid: "Lätt", high: "Medel" } }, coords: { lat: 63.3980, lng: 13.0780 } },
  { id: 3, name: "Rappet Syd", description: "Teknisk start om sommaren vid lite vind – saknas bra ställe att lägga ut skärm och du behöver springa utför ett stenrös. Vid tillräcklig vind för balansering kan du lägga ut skärmen i gräset precis väster om stenröset, balansera där och sedan ställa dig i position med skärm över huvudet innan du springer ut för stenröset.", wind: ["Sydlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Medel", high: "Medel" }, summer: { low: "Avancerad", mid: "Medel", high: "Medel" } }, coords: { lat: 63.3990, lng: 13.0760 } },
  { id: 4, name: "1420", description: "", wind: [], season: "both", difficultyMatrix: null, coords: { lat: 63.4010, lng: 13.0710 } },
  { id: 5, name: "Hummeln Ost", description: "Klassiska Hummeln-starten med bra utrymme att lägga ut skärm och springa. Vid lite vind behöver du parera för ojämnheter i backen. Branten avbryts av en stig, sedan flackar det ut innan det brantar på igen och träd börjar komma. Vid nollvind behöver du springa rejält.", wind: ["Östlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Lätt", high: "Medel" }, summer: { low: "Avancerad", mid: "Lätt", high: "Medel" } }, coords: { lat: 63.4030, lng: 13.0850 } },
  { id: 6, name: "Hummeln Väst", description: "Brant och fin start. Finns möjligheter att lägga ut skärm på platta partier innan branten.", wind: ["Västlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Lätt", high: "Medel" }, summer: { low: "Medel", mid: "Lätt", high: "Medel" } }, coords: { lat: 63.4030, lng: 13.0680 } },
  { id: 7, name: "Hummeln Syd", description: "Förhållandevis kort start – du behöver passera ett downhillspår. Vid lägre vind kan det vara en god idé att lägga ut skärmen högre upp mot Åre-skylten. Spring upp tryck i skärmen och ha klara kontroller innan branten kommer.", wind: ["Sydlig"], season: "both", difficultyMatrix: { winter: { low: "Avancerad", mid: "Medel", high: "Medel" }, summer: { low: "Avancerad", mid: "Medel", high: "Medel" } }, coords: { lat: 63.4010, lng: 13.0770 } },
  { id: 8, name: "Pelikan", description: "Nordöstra delen av Hummeln. Lång och brant start – vid lägre vind kan man med fördel börja springa längre upp i närheten av Åre-skylten.", wind: ["Nord-Östlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Lätt", high: "Medel" }, summer: { low: "Medel", mid: "Lätt", high: "Medel" } }, coords: { lat: 63.4060, lng: 13.0730 } },
  { id: 9, name: "Lundsrappet", description: "Ingen kanonstart, men funkar. Praktisk om gondolen är stängd och man vill ta några snabba varv i VM8:an. Lättare på skidor. Funkar när det är folktomt. Se upp för stora stenpartier om sommaren.", wind: ["Sydlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Medel", high: "Medel" }, summer: { low: "Avancerad", mid: "Medel", high: "Medel" } }, coords: { lat: 63.3930, lng: 13.0800 } },
  { id: 10, name: "Övre Rappet", description: "Lämpar sig bättre för vintern då du får en lång sträcka att åka skidor innan du lämnar marken. Man kan gå ned en bit för bättre startriktning vid nordliga inslag – gå nedåt lite sydväst från huvudstarten där lutningen är mer nordväst. Om sommaren finns ingen anledning att välja denna start över någon av de andra.", wind: ["Västlig", "Nord-Västlig"], season: "both", difficultyMatrix: { winter: { low: "Medel", mid: "Lätt", high: "Medel" }, summer: { low: "Avancerad", mid: "Avancerad", high: "Medel" } }, coords: { lat: 63.3970, lng: 13.0770 } },
];

// Map Supabase row -> app shape
function mapLaunch(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    wind: row.wind || [],
    season: row.season || "both",
    difficultyMatrix: row.difficulty_matrix || null,
    coords: row.coords || { lat: 63.4, lng: 13.08 },
  };
}

function mapIncident(row) {
  return {
    id: row.id,
    date: row.date || "",
    time: row.time || "",
    launchId: row.launch_id || "",
    pilotExperience: row.pilot_experience || "",
    incidentType: row.incident_type || "",
    perceivedWind: row.perceived_wind || "",
    perceivedWindDir: row.perceived_wind_dir || "",
    description: row.description || "",
    injuries: row.injuries || "Inga",
    lessonLearned: row.lesson_learned || "",
    weather: row.weather || null,
    imagePreviews: row.image_urls || [],
    equipment: row.equipment || "",
    launchType: row.launch_type || "",
  };
}


const WIND_COLORS = { "Östlig": "#3B8BD4", "Västlig": "#1D9E75", "Sydlig": "#EF9F27", "Nordlig": "#D85A30", "Nord-Östlig": "#7F77DD", "Syd-Östlig": "#D4537E", "Nord-Västlig": "#0F6E56" };
const DIFF_STYLE = { "Lätt": { bg: "#eaf3de", color: "#3B6D11" }, "Medel": { bg: "#faeeda", color: "#854F0B" }, "Avancerad": { bg: "#fcebeb", color: "#A32D2D" } };

const HAZARDS = [
  {
    title: "Elledningarna",
    body: "Vi har elledningar som löper en bit ovanför foten av Skutan. Dessa är som mest närvarande när du flyger in mot Draklanda. Se till att hålla god marginal till elledningarna efter att du passerar VM-platån. Ledningarna löper en bit ovanför E14 och sträcker sig ca 30 meter upp från backen.",
    coords: null, images: []
  },
  {
    title: "Kabinbanan",
    body: "Från topp till botten löper kabinbanans vajern. Den kan vara svår att se ibland – se till att du har koll på hur den löper. Speciellt vid flygning där du passerar öster om Hummeln och flyger mot Draklanda.",
    coords: null, images: []
  },
  {
    title: "Snökanoner",
    body: "För erfarna piloter som flyger nära terräng. Snökanoner finns överallt på berget, speciellt i kanten av pist eller strax utanför pister.",
    coords: null, images: []
  },
  {
    title: "Vajer La Gondola",
    body: "I höjd med träden precis öster om La Gondola löper en vajern. Detta är inget bekymmer om du inte flyger nära terräng. Flyger du så nära terräng att denna vajern är ett bekymmer flyger du förhoppningsvis redan med en erfaren lokal pilot som redan briefat dig.",
    coords: { lat: 63.41407997220485, lng: 13.065387018472242 }, images: []
  },
  {
    title: "Gondolvajern",
    body: "Gondolens vajern löper från VM-platån upp till Skutan. Den är ofta tydlig då den i regel har gondoler ute. Den kan bli ett bekymmer om du inte har den i åtanke och flyger österut strax ovanför VM-platån.",
    coords: null, images: []
  },
  {
    title: "Vindstrut & betongrör vid Skysport",
    body: "Om du kommer in lågt och landar i västlig riktning i höjd med gula Skysport-huset behöver du förhålla dig till en mindre vindstrut. Bredvid Skysport vid vattenutloppet finns ett stort betongrör, följt av sten och uppförsbacke innan landningsfältet börjar. Inget som ska vara ett bekymmer om du planerat din landning – välj vattenlandning i annat fall.",
    coords: null, images: []
  },
];

const GUIDELINES = [
  { n: "01", title: "Pister om vintern", body: "Håll god höjd ovanför aktiva pister med skidgäster i." },
  { n: "02", title: "Offpist", body: "Offpisten är helt fri att leka i som du vill." },
  { n: "03", title: "Stör inte övriga besökare", body: "Undvik swoops eller flygning nära icke-flygare på berget. Om någon vinkar och bjuder in till fly-by, håll ändå god marginal." },
  { n: "04", title: "Ansvara för ditt eget flyg", body: "Följ inte blint personen framför dig om ni inte har gjort upp en plan. Personen framför dig kan vara en mer erfaren pilot som gör något över din nivå, eller göra en felbedömning och skapa en utsatt situation. Flyg ditt eget flyg." },
];

const LANDING_SITES = [
  {
    name: "Draklanda",
    description: "Standardlandningsfält för paraglide och speed. Används frekvent av alla flygare.",
    wind: "Alla riktningar", size: "Stor", difficulty: "Lätt", season: "both",
    coords: { lat: 63.402596780135624, lng: 13.054742892672547 }, images: [] 
  },
  {
    name: "Kyrkan",
    description: "Mellanstort gräsfält – störst yta när man landar söderut eller norrut. Se upp för folk. Omringat av byggnader och träd.",
    wind: "Alla riktningar", size: "Mellan", difficulty: "Teknisk", season: "both",
    coords: { lat: 63.397563857988985, lng: 13.082708784404597 }, images: []
  },
  {
    name: "Playa de la Swoop",
    description: "Tekniskt sett en del av Draklanda, men med låg inflygning över sjön och upp på stranden. Här ligger folk och solar på fina dagar, se upp. I vattnet och på stranden lurar även stora och små stenar.",
    wind: "Alla riktningar", size: "Mellan", difficulty: "Teknisk", season: "summer",
    coords: { lat: 63.40214438378909, lng: 13.05558122176314 }, images: []
  },
  {
    name: "Holiday-stranden",
    description: "Precis öster om Holiday finns en större strip av stranden att landa på. Rimligast på östlig vind. På fina dagar kan det vara mycket folk på stranden.",
    wind: "Östlig", size: "Mellan", difficulty: "Teknisk", season: "summer",
    coords: { lat: 63.39676420159445, lng: 13.075332777603768 }, images: []
  },
  {
    name: "VM-platån",
    description: "VM-platån kan vara en bra landningsyta främst under vintern om man inte vill flyga hela vägen ned. Se upp för skidåkare och ojämn terräng. Fungerar på sommaren, men mer teknisk och mindre rimligt val.",
    wind: "Alla riktningar", size: "Stor", difficulty: "Lite teknisk", season: "winter",
    coords: { lat: 63.422061892779894, lng: 13.051491704371472 }, images: []
  },
];

// ─── WEATHER ──────────────────────────────────────────────────────────────────

async function fetchHistoricalWeather(datetime) {
  const date = datetime.split("T")[0];
  const hour = parseInt(datetime.split("T")[1].split(":")[0]);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=63.3988&longitude=13.0784&start_date=${date}&end_date=${date}&hourly=temperature_2m,windspeed_10m,winddirection_10m,windgusts_10m,precipitation,weathercode&timezone=Europe%2FStockholm&wind_speed_unit=ms`;
  const res = await fetch(url);
  const data = await res.json();
  const h = data.hourly;
  return {
    temperature: h.temperature_2m[hour],
    windspeed: Math.round(h.windspeed_10m[hour] * 10) / 10,
    windgusts: Math.round(h.windgusts_10m[hour] * 10) / 10,
    winddirection: h.winddirection_10m[hour],
    precipitation: h.precipitation[hour],
    weathercode: h.weathercode[hour],
    _meta: { date, hour, datetime },
  };
}

function windDegToText(deg) {
  const dirs = ["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSV","SV","VSV","V","VNV","NV","NNV"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function weatherCodeToText(c) {
  if (c === 0) return "Klart"; if (c <= 3) return "Delvis molnigt";
  if (c <= 49) return "Dimma"; if (c <= 67) return "Regn";
  if (c <= 77) return "Snö"; if (c <= 82) return "Regnskurar";
  if (c <= 99) return "Åska"; return "Okänt";
}

function formatMetaTime(meta) {
  if (!meta) return "";
  const pad = n => String(n).padStart(2, "0");
  return `${meta.date} ${pad(meta.hour)}:00`;
}

// ─── WEATHER BLOCK ────────────────────────────────────────────────────────────

function WeatherSourceInfo({ meta }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Datakälla"
        style={{
          background: "none", border: "0.5px solid #b8d8a0", borderRadius: "50%",
          width: 18, height: 18, fontSize: 10, color: "#3B6D11", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontWeight: 600, lineHeight: 1, padding: 0, flexShrink: 0,
        }}
      >i</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 199 }} />
          <div style={{
            position: "absolute", top: 24, left: 0, zIndex: 200,
            background: "#fff", border: "0.5px solid #d5d2c9", borderRadius: 8,
            padding: "10px 14px", minWidth: 220, boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#444", marginBottom: 6 }}>Datakälla</div>
            <table style={{ fontSize: 12, color: "#666", borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                <tr><td style={{ color: "#aaa", paddingRight: 10, paddingBottom: 3 }}>Källa</td><td style={{ color: "#333" }}>Open-Meteo arkiv</td></tr>
                <tr><td style={{ color: "#aaa", paddingRight: 10, paddingBottom: 3 }}>Station</td><td style={{ color: "#333" }}>Åreskutan (63.40° N, 13.08° E)</td></tr>
                <tr><td style={{ color: "#aaa", paddingRight: 10, paddingBottom: 3 }}>Datum</td><td style={{ color: "#333" }}>{meta?.date || "–"}</td></tr>
                <tr><td style={{ color: "#aaa", paddingRight: 10 }}>Tid</td><td style={{ color: "#333" }}>{meta ? formatMetaTime(meta) : "–"}</td></tr>
              </tbody>
            </table>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid #f0ede6", fontSize: 11, color: "#bbb", lineHeight: 1.5 }}>
              Data hämtas från ERA5-reanalys via Open-Meteo och representerar timmedelvärden på 10m höjd.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WeatherBlock({ weather, date, time }) {
  if (!weather) return null;
  const dirText = windDegToText(weather.winddirection);
  const dirDeg = weather.winddirection;

  const cells = [
    ["Temp", `${weather.temperature}°C`],
    ["Vind", `${weather.windspeed} m/s`],
    ["Byar", `${weather.windgusts} m/s`],
    ["Riktning", null, dirText, dirDeg],
    ["Nbd", `${weather.precipitation} mm`],
    ["Väder", weatherCodeToText(weather.weathercode)],
  ];

  return (
    <div style={{ background: "#f0f8ee", border: "0.5px solid #c0dd97", borderRadius: 8, padding: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#3B6D11", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Dokumenterad väderdata ✓
        </div>
        <WeatherSourceInfo meta={weather._meta} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {cells.map(([k, v, dirLabel, dirDeg]) => (
          <div key={k} style={{ background: "#fff", borderRadius: 6, padding: "8px 10px" }}>
            <div style={{ fontSize: 11, color: "#999" }}>{k}</div>
            {dirLabel !== undefined ? (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
                <span style={{
                  display: "inline-block", width: 14, height: 14, flexShrink: 0,
                  transform: `rotate(${dirDeg}deg)`,
                  fontSize: 14, lineHeight: 1, userSelect: "none",
                }}>↑</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>{dirLabel}</span>
                <span style={{ fontSize: 11, color: "#bbb" }}>{Math.round(dirDeg)}°</span>
              </div>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a", marginTop: 1 }}>{v}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────

function WindBadge({ dir }) {
  const c = WIND_COLORS[dir] || "#888";
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, marginRight: 4, background: c + "22", color: c, border: `1px solid ${c}44` }}>{dir}</span>;
}

function SeasonBadge({ season }) {
  const map = { winter: ["❄️ Vinter"], summer: ["☀️ Sommar"], both: ["❄️ Vinter", "☀️ Sommar"] };
  return <div style={{ display: "flex", gap: 4 }}>{(map[season] || []).map(s => <span key={s} style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "#f0f0e8", color: "#666" }}>{s}</span>)}</div>;
}

function SectionHeader({ title, subtitle }) {
  return <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: "#1a1a1a" }}>{title}</h2>{subtitle && <p style={{ fontSize: 14, color: "#888", margin: "4px 0 0" }}>{subtitle}</p>}</div>;
}

function FilterBtn({ active, onClick, children }) {
  return <button onClick={onClick} style={{ padding: "5px 12px", borderRadius: 20, border: "0.5px solid", borderColor: active ? "#1a1a1a" : "#e5e2d9", background: active ? "#1a1a1a" : "#fff", color: active ? "#fff" : "#555", fontSize: 13, cursor: "pointer" }}>{children}</button>;
}

function DifficultyMatrix({ matrix }) {
  if (!matrix) return null;
  const cols = [{ key: "low", label: "0–3 m/s" }, { key: "mid", label: "4–7 m/s" }, { key: "high", label: "8+ m/s" }];
  const rows = [{ key: "winter", label: "❄️ Vinter (skidor)" }, { key: "summer", label: "☀️ Sommar (skor)" }].filter(r => matrix[r.key]);
  if (!rows.length) return null;
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Svårighetsgrad per förhållande</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr><td style={{ padding: "4px 0", width: 140 }} />{cols.map(c => <td key={c.key} style={{ padding: "4px 6px", textAlign: "center", color: "#aaa", fontSize: 11, fontWeight: 500 }}>{c.label}</td>)}</tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r.key}><td style={{ padding: "5px 0", fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>{r.label}</td>
            {cols.map(c => { const val = matrix[r.key]?.[c.key]; const s = DIFF_STYLE[val] || { bg: "#f0f0e8", color: "#999" }; return <td key={c.key} style={{ padding: "4px 6px", textAlign: "center" }}><span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500, background: s.bg, color: s.color }}>{val || "–"}</span></td>; })}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ─── LAUNCHES ─────────────────────────────────────────────────────────────────

function LaunchModal({ launch, onClose }) {
  if (!launch) return null;
  const gUrl = `https://www.google.com/maps?q=${launch.coords.lat},${launch.coords.lng}`;
  const aUrl = `https://maps.apple.com/?ll=${launch.coords.lat},${launch.coords.lng}&q=${encodeURIComponent(launch.name)}`;
  const mapBtn = { padding: "8px 14px", borderRadius: 8, border: "0.5px solid #d5d2c9", fontSize: 13, color: "#1a1a1a", textDecoration: "none", background: "#fff", display: "inline-flex", alignItems: "center", gap: 6 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: "#111" }}>{launch.name}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
        </div>
        <div style={{ marginBottom: 14 }}><SeasonBadge season={launch.season} /></div>
        {launch.description ? <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>{launch.description}</p> : <p style={{ fontSize: 13, color: "#bbb", fontStyle: "italic", marginBottom: 16 }}>Ingen beskrivning tillagd ännu.</p>}
        {launch.wind.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Rekommenderad vind</div>{launch.wind.map(w => <WindBadge key={w} dir={w} />)}</div>}
        <div style={{ marginBottom: 20 }}><DifficultyMatrix matrix={launch.difficultyMatrix} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <div style={{ background: "#f8f7f4", borderRadius: 8, padding: 12, textAlign: "center", color: "#bbb", fontSize: 13 }}>📷 Bilder kommer snart</div>
          <div style={{ background: "#f8f7f4", borderRadius: 8, padding: 12, textAlign: "center", color: "#bbb", fontSize: 13 }}>🎬 Video kommer snart</div>
        </div>
        <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Öppna i kartor</div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={gUrl} target="_blank" rel="noopener noreferrer" style={mapBtn}>🗺 Google Maps</a>
            <a href={aUrl} target="_blank" rel="noopener noreferrer" style={mapBtn}>🍎 Apple Maps</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaunchesTab() {
  const [selected, setSelected] = useState(null);
  const [windFilter, setWindFilter] = useState("Alla");
  const [seasonFilter, setSeasonFilter] = useState("Alla");
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("launches").select("*").order("id").then(({ data, error }) => {
      if (data && !error) setLaunches(data.map(mapLaunch));
      setLoading(false);
    });
  }, []);

  const windOpts = ["Alla", ...Object.keys(WIND_COLORS)];
  const seasonOpts = [{ v: "Alla", l: "Alla säsonger" }, { v: "winter", l: "❄️ Vinter" }, { v: "summer", l: "☀️ Sommar" }];
  const filtered = launches.filter(l => (windFilter === "Alla" || l.wind.includes(windFilter)) && (seasonFilter === "Alla" || l.season === seasonFilter || l.season === "both"));
  return (
    <div>
      <SectionHeader title="Starter" subtitle="De mest etablerade starterna för speed på Åreskutan." />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{seasonOpts.map(o => <FilterBtn key={o.v} active={seasonFilter === o.v} onClick={() => setSeasonFilter(o.v)}>{o.l}</FilterBtn>)}</div>
        <div style={{ width: "0.5px", height: 20, background: "#e5e2d9" }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{windOpts.map(w => <FilterBtn key={w} active={windFilter === w} onClick={() => setWindFilter(w)}>{w}</FilterBtn>)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
        {filtered.map(l => (
          <div key={l.id} onClick={() => setSelected(l)} style={{ background: "#fff", border: "0.5px solid #e5e2d9", borderRadius: 12, padding: "16px 20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a" }}>{l.name}</span>
              <SeasonBadge season={l.season} />
            </div>
            {l.description && <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.5 }}>{l.description.slice(0, 80)}{l.description.length > 80 ? "…" : ""}</p>}
            <div>{l.wind.length > 0 ? l.wind.map(w => <WindBadge key={w} dir={w} />) : <span style={{ fontSize: 12, color: "#ddd" }}>Vind ej specificerad</span>}</div>
          </div>
        ))}
      </div>
      {loading && <p style={{ color: "#bbb", textAlign: "center", padding: 40 }}>Laddar starter...</p>}
      {!loading && filtered.length === 0 && <p style={{ color: "#bbb", textAlign: "center", padding: 40 }}>Inga starter matchar filtret.</p>}
      <LaunchModal launch={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ─── GUIDELINES ───────────────────────────────────────────────────────────────

function HazardModal({ hazard, onClose }) {
  if (!hazard) return null;
  const mapBtn = { padding: "8px 14px", borderRadius: 8, border: "0.5px solid #d5d2c9", fontSize: 13, color: "#1a1a1a", textDecoration: "none", background: "#fff", display: "inline-flex", alignItems: "center", gap: 6 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "#111" }}>{hazard.title}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
        </div>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>{hazard.body}</p>
        {hazard.images && hazard.images.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 8, marginBottom: 16 }}>
            {hazard.images.map((src, i) => <img key={i} src={src} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 8, border: "0.5px solid #e5e2d9" }} />)}
          </div>
        )}
        {hazard.coords && (
          <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Öppna i kartor</div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={`https://www.google.com/maps?q=${hazard.coords.lat},${hazard.coords.lng}`} target="_blank" rel="noopener noreferrer" style={mapBtn}>🗺 Google Maps</a>
              <a href={`https://maps.apple.com/?ll=${hazard.coords.lat},${hazard.coords.lng}&q=${encodeURIComponent(hazard.title)}`} target="_blank" rel="noopener noreferrer" style={mapBtn}>🍎 Apple Maps</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GuidelinesTab() {
  const [selectedHazard, setSelectedHazard] = useState(null);
  return (
    <div>
      <div style={{ background: "#f8f7f4", border: "0.5px solid #e5e2d9", borderRadius: 12, padding: "18px 20px", marginBottom: 32 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a", marginBottom: 6 }}>Ny på berget? Börja här!</div>
        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>Här hittar du allmänna riktlinjer för flygning samt kända faror och hinder på Åreskutan.</div>
      </div>

      <SectionHeader title="Faror & hinder" subtitle="Notera att det kan finnas hinder som inte finns listade här, eller temporära faror." />
      <div style={{ display: "grid", gap: 10, marginBottom: 40 }}>
        {HAZARDS.map((h, i) => (
          <div key={i} onClick={() => setSelectedHazard(h)} style={{ background: "#fff", border: "0.5px solid #e5e2d9", borderRadius: 12, padding: "14px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a" }}>{h.title}</span>
                {h.coords && <span style={{ fontSize: 11, background: "#e8f3fb", color: "#3B8BD4", padding: "1px 6px", borderRadius: 4 }}>📍 Karta</span>}
                {h.images && h.images.length > 0 && <span style={{ fontSize: 11, background: "#f0f0e8", color: "#666", padding: "1px 6px", borderRadius: 4 }}>📷 {h.images.length} bild{h.images.length > 1 ? "er" : ""}</span>}
              </div>
              <p style={{ fontSize: 13, color: "#888", margin: 0, lineHeight: 1.5 }}>{h.body.slice(0, 90)}{h.body.length > 90 ? "…" : ""}</p>
            </div>
            <span style={{ color: "#ccc", fontSize: 18, flexShrink: 0 }}>›</span>
          </div>
        ))}
      </div>

      <SectionHeader title="Generella riktlinjer" subtitle="Hur vi flyger på Åreskutan" />
      <div style={{ marginBottom: 8 }}>
        {GUIDELINES.map((g, i) => (
          <div key={i} style={{ padding: "14px 0", borderBottom: i < GUIDELINES.length - 1 ? "0.5px solid #f0ede6" : "none", textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a", marginBottom: 4 }}>{g.title}</div>
            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{g.body}</div>
          </div>
        ))}
      </div>

      <HazardModal hazard={selectedHazard} onClose={() => setSelectedHazard(null)} />
    </div>
  );
}

// ─── LANDINGS ─────────────────────────────────────────────────────────────────

function LandingModal({ site, onClose }) {
  if (!site) return null;
  const gUrl = `https://www.google.com/maps?q=${site.coords.lat},${site.coords.lng}`;
  const aUrl = `https://maps.apple.com/?ll=${site.coords.lat},${site.coords.lng}&q=${encodeURIComponent(site.name)}`;
  const mapBtn = { padding: "8px 14px", borderRadius: 8, border: "0.5px solid #d5d2c9", fontSize: 13, color: "#1a1a1a", textDecoration: "none", background: "#fff", display: "inline-flex", alignItems: "center", gap: 6 };
  const ds = DIFF_STYLE[site.difficulty] || { bg: "#f0f0e8", color: "#666" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: "#111" }}>{site.name}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          <SeasonBadge season={site.season} />
        </div>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>{site.description}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          <span style={{ fontSize: 12, background: "#f0f0e8", padding: "2px 8px", borderRadius: 4, color: "#666" }}>{site.size}</span>
          {site.difficulty && <span style={{ fontSize: 12, background: ds.bg, padding: "2px 8px", borderRadius: 4, color: ds.color }}>{site.difficulty}</span>}
          <span style={{ fontSize: 12, background: "#e8f3fb", padding: "2px 8px", borderRadius: 4, color: "#3B8BD4" }}>Vind: {site.wind}</span>
        </div>
        {site.images && site.images.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 8, marginBottom: 20 }}>
            {site.images.map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 8, border: "0.5px solid #e5e2d9" }} />
            ))}
          </div>
        )}
        {(!site.images || site.images.length === 0) && (
          <div style={{ background: "#f8f7f4", borderRadius: 8, padding: 12, textAlign: "center", color: "#bbb", fontSize: 13, marginBottom: 20 }}>📷 Bilder kommer snart</div>
        )}
        <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Öppna i kartor</div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={gUrl} target="_blank" rel="noopener noreferrer" style={mapBtn}>🗺 Google Maps</a>
            <a href={aUrl} target="_blank" rel="noopener noreferrer" style={mapBtn}>🍎 Apple Maps</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingsTab() {
  const [sf, setSf] = useState("Alla");
  const [selected, setSelected] = useState(null);
  const opts = [{ v: "Alla", l: "Alla säsonger" }, { v: "winter", l: "❄️ Vinter" }, { v: "summer", l: "☀️ Sommar" }];
  const filtered = LANDING_SITES.filter(s => sf === "Alla" || s.season === sf || s.season === "both");
  return (
    <div>
      <SectionHeader title="Landningar" subtitle="Om du inte är en erfaren pilot är Draklanda den enda landningen du ska överväga." />
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>{opts.map(o => <FilterBtn key={o.v} active={sf === o.v} onClick={() => setSf(o.v)}>{o.l}</FilterBtn>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
        {filtered.map((s, i) => (
          <div key={i} onClick={() => setSelected(s)} style={{ background: "#fff", border: "0.5px solid #e5e2d9", borderRadius: 12, padding: "16px 20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a" }}>{s.name}</span>
              <SeasonBadge season={s.season} />
            </div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, margin: 0 }}>{s.description.slice(0, 80)}{s.description.length > 80 ? "…" : ""}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, background: "#f0f0e8", padding: "2px 8px", borderRadius: 4, color: "#666" }}>{s.size}</span>
              {s.difficulty && (() => { const ds = DIFF_STYLE[s.difficulty] || { bg: "#f0f0e8", color: "#666" }; return <span style={{ fontSize: 12, background: ds.bg, padding: "2px 8px", borderRadius: 4, color: ds.color }}>{s.difficulty}</span>; })()}
              <span style={{ fontSize: 12, background: "#e8f3fb", padding: "2px 8px", borderRadius: 4, color: "#3B8BD4" }}>Vind: {s.wind}</span>
            </div>
          </div>
        ))}
      </div>
      <LandingModal site={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ─── INCIDENTS ────────────────────────────────────────────────────────────────

function IncidentForm({ onSubmit }) {
  const [form, setForm] = useState({ date: "", time: "", launchId: "", pilotExperience: "", incidentType: "", perceivedWind: "", perceivedWindDir: "", description: "", injuries: "Inga", lessonLearned: "", equipment: "", launchType: "" });
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleDateTimeBlur = async () => {
    if (!form.date || !form.time) return;
    const dt = `${form.date}T${form.time}:00`;
    if (new Date(dt) > new Date()) { setWeatherError("Datumet är i framtiden."); return; }
    setLoadingWeather(true); setWeatherError(""); setWeather(null);
    try { setWeather(await fetchHistoricalWeather(dt)); }
    catch { setWeatherError("Kunde inte hämta väderdata."); }
    finally { setLoadingWeather(false); }
  };

  const handleImages = (e) => {
    const files = [...imageFiles, ...Array.from(e.target.files)].slice(0, 5);
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    const nf = imageFiles.filter((_, idx) => idx !== i);
    setImageFiles(nf);
    setImagePreviews(nf.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!form.description || !form.date || !form.incidentType) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    onSubmit({ ...form, weather, imagePreviews, id: Date.now() });
    setSubmitting(false);
    setForm({ date: "", time: "", launchId: "", pilotExperience: "", incidentType: "", perceivedWind: "", perceivedWindDir: "", description: "", injuries: "Inga", lessonLearned: "", equipment: "", launchType: "" });
    setWeather(null); setImageFiles([]); setImagePreviews([]);
  };

  const inp = { width: "100%", padding: "9px 12px", border: "0.5px solid #d5d2c9", borderRadius: 8, fontSize: 14, background: "#fff", color: "#1a1a1a", outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 12, fontWeight: 500, color: "#888", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" };
  const canSubmit = !submitting && form.description && form.date && form.incidentType;

  return (
    <div style={{ maxWidth: 560 }}>
      <SectionHeader title="Rapportera incident" subtitle="Anonyma rapporter hjälper hela communityt att lära sig och bli säkrare." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div><label style={lbl}>Datum *</label><input type="date" value={form.date} onChange={e => set("date", e.target.value)} onBlur={handleDateTimeBlur} style={inp} /></div>
        <div><label style={lbl}>Tid</label><input type="time" value={form.time} onChange={e => set("time", e.target.value)} onBlur={handleDateTimeBlur} style={inp} /></div>
      </div>

      {loadingWeather && <div style={{ background: "#f8f7f4", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: "#888" }}>Hämtar dokumenterad väderdata...</div>}
      {weatherError && <div style={{ background: "#fdf0ee", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: "#c04828" }}>{weatherError}</div>}
      {weather && <WeatherBlock weather={weather} />}

      <div style={{ background: "#f8f7f4", border: "0.5px solid #e5e2d9", borderRadius: 8, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Upplevd vind vid start</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={{ ...lbl, textTransform: "none", letterSpacing: 0, color: "#aaa" }}>Styrka (m/s)</label><input type="number" min="0" max="40" step="0.5" value={form.perceivedWind} onChange={e => set("perceivedWind", e.target.value)} placeholder="t.ex. 5.5" style={inp} /></div>
          <div><label style={{ ...lbl, textTransform: "none", letterSpacing: 0, color: "#aaa" }}>Riktning</label>
            <select value={form.perceivedWindDir} onChange={e => set("perceivedWindDir", e.target.value)} style={inp}>
              <option value="">Välj riktning</option>
              {["Östlig", "Västlig", "Nordlig", "Sydlig", "Nord-Östlig", "Nord-Västlig", "Syd-Östlig", "Syd-Västlig"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Start</label>
        <select value={form.launchId} onChange={e => set("launchId", e.target.value)} style={inp}>
          <option value="">Välj start (valfritt)</option>
          {LAUNCHES_FALLBACK.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          <option value="annan">Annan / okänd</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Typ av incident *</label>
        <select value={form.incidentType} onChange={e => set("incidentType", e.target.value)} style={inp}>
          <option value="">Välj typ</option>
          {[["kollision", "Kollision (mark/hinder)"], ["kollaps", "Vingekollaps"], ["landning", "Hård landning"], ["startproblem", "Startproblem"], ["navigering", "Navigeringsproblem"], ["utrustning", "Utrustningsfel"], ["nara_ogat", "Nära ögat – annan pilot"], ["annat", "Annat"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Pilotens erfarenhet</label>
        <select value={form.pilotExperience} onChange={e => set("pilotExperience", e.target.value)} style={inp}>
          <option value="">Välj (valfritt)</option>
          {[["1-50", "1–50 speedflyg"], ["50-100", "50–100 speedflyg"], ["100-300", "100–300 speedflyg"], ["300-500", "300–500 speedflyg"], ["500+", "500+ speedflyg"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Skador</label>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["Inga", "Lindriga", "Allvarliga"].map(opt => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer", color: "#444" }}>
              <input type="radio" name="injuries" value={opt} checked={form.injuries === opt} onChange={e => set("injuries", e.target.value)} />{opt}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Utrustning</label>
        <input type="text" value={form.equipment} onChange={e => set("equipment", e.target.value)} placeholder="t.ex. Gin Fluid 10m², hjälm XYZ" style={inp} />
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Start med</label>
        <div style={{ display: "flex", gap: 16 }}>
          {["foot", "ski"].map(opt => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer", color: "#444" }}>
              <input type="radio" name="launchType" value={opt} checked={form.launchType === opt} onChange={e => set("launchType", e.target.value)} />
              {opt === "foot" ? "🥾 Foot" : "🎿 Ski"}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Beskrivning *</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Beskriv vad som hände, i kronologisk ordning." style={{ ...inp, minHeight: 120, resize: "vertical", lineHeight: 1.5 }} />
      </div>

      <div style={{ marginBottom: 16 }}><label style={lbl}>Lärdomar</label>
        <textarea value={form.lessonLearned} onChange={e => set("lessonLearned", e.target.value)} placeholder="Vad tar du med dig? Vad hade kunnat göras annorlunda?" style={{ ...inp, minHeight: 80, resize: "vertical", lineHeight: 1.5 }} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={lbl}>Bifoga bilder (max 5)</label>
        <div onClick={() => fileRef.current?.click()} style={{ border: "0.5px dashed #d5d2c9", borderRadius: 8, padding: "14px 20px", textAlign: "center", cursor: "pointer", color: "#aaa", fontSize: 13, marginBottom: 10, background: "#faf9f6" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#999"} onMouseLeave={e => e.currentTarget.style.borderColor = "#d5d2c9"}>
          📎 Klicka för att bifoga bilder
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImages} />
        {imagePreviews.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {imagePreviews.map((src, i) => (
              <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                <img src={src} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "0.5px solid #e5e2d9" }} />
                <button onClick={() => removeImage(i)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, lineHeight: "18px", textAlign: "center", padding: 0 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} style={{ padding: "11px 28px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: canSubmit ? "pointer" : "default", opacity: canSubmit ? 1 : 0.4 }}>
        {submitting ? "Skickar..." : "Skicka rapport"}
      </button>
    </div>
  );
}

function IncidentCard({ incident }) {
  const launchName = incident.launchId ? (LAUNCHES_FALLBACK.find(l => l.id == incident.launchId)?.name || "Annan") : null;
  const typeLabels = { kollision: "Kollision", kollaps: "Vingekollaps", landning: "Hård landning", startproblem: "Startproblem", navigering: "Navigeringsproblem", utrustning: "Utrustningsfel", nara_ogat: "Nära ögat", annat: "Annat" };
  const injuryColor = { Inga: "#3B6D11", Lindriga: "#854F0B", Allvarliga: "#A32D2D" };
  return (
    <div style={{ background: "#fff", border: "1px solid #c8c5bc", borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#f0f0e8", color: "#555" }}>{typeLabels[incident.incidentType] || incident.incidentType}</span>
          {launchName && <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#e8f3fb", color: "#3B8BD4" }}>{launchName}</span>}
          <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#f9f9f4", color: injuryColor[incident.injuries] || "#555" }}>Skador: {incident.injuries}</span>
        </div>
        <span style={{ fontSize: 12, color: "#bbb" }}>{incident.date} {incident.time}</span>
      </div>
      <p style={{ fontSize: 14, color: "#444", lineHeight: 1.6, margin: "0 0 8px" }}>{incident.description}</p>
      {incident.lessonLearned && <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 10, marginTop: 10 }}><div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Lärdom</div><p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, margin: 0 }}>{incident.lessonLearned}</p></div>}
      {(incident.equipment || incident.launchType) && <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 10, marginTop: 10, display: "flex", gap: 16 }}>
        {incident.equipment && <div><div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>Utrustning</div><div style={{ fontSize: 13, color: "#555" }}>{incident.equipment}</div></div>}
        {incident.launchType && <div><div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>Start</div><div style={{ fontSize: 13, color: "#555" }}>{incident.launchType === "foot" ? "🥾 Foot" : "🎿 Ski"}</div></div>}
      </div>}
      {(incident.perceivedWind || incident.perceivedWindDir) && <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 10, marginTop: 10 }}><div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Upplevd vind vid start</div><div style={{ fontSize: 13, color: "#555" }}>{incident.perceivedWind && `${incident.perceivedWind} m/s `}{incident.perceivedWindDir}</div></div>}
      {incident.weather && (
        <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 10, marginTop: 10 }}>
          <WeatherBlock weather={incident.weather} />
        </div>
      )}
      {incident.imagePreviews?.length > 0 && <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 10, marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>{incident.imagePreviews.map((src, i) => <img key={i} src={src} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "0.5px solid #e5e2d9" }} />)}</div>}
    </div>
  );
}

function IncidentsTab() {
  const [view, setView] = useState("list");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("incidents").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (data && !error) setIncidents(data.map(mapIncident));
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (inc) => {
    const row = {
      date: inc.date, time: inc.time, launch_id: inc.launchId,
      pilot_experience: inc.pilotExperience, incident_type: inc.incidentType,
      perceived_wind: inc.perceivedWind, perceived_wind_dir: inc.perceivedWindDir,
      description: inc.description, injuries: inc.injuries,
      lesson_learned: inc.lessonLearned, weather: inc.weather,
      equipment: inc.equipment, launch_type: inc.launchType,
      image_urls: [],
    };
    const { data, error } = await supabase.from("incidents").insert([row]).select().single();
    if (data && !error) {
      setIncidents(p => [mapIncident(data), ...p]);
    } else {
      setIncidents(p => [inc, ...p]);
    }
    setView("list");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px", color: "#1a1a1a" }}>Incidentrapporter</h2><p style={{ fontSize: 14, color: "#888", margin: 0 }}>{loading ? "Laddar..." : `${incidents.length} rapport${incidents.length !== 1 ? "er" : ""}`}</p></div>
        <button onClick={() => setView(v => v === "form" ? "list" : "form")} style={{ padding: "9px 18px", border: "0.5px solid #d5d2c9", borderRadius: 8, background: view === "form" ? "#f0ede6" : "#fff", color: "#1a1a1a", fontSize: 14, cursor: "pointer" }}>
          {view === "form" ? "← Tillbaka" : "+ Ny rapport"}
        </button>
      </div>
      {view === "form"
        ? <IncidentForm onSubmit={handleSubmit} />
        : <div style={{ display: "grid", gap: 12 }}>{loading ? <p style={{ color: "#bbb", textAlign: "center", padding: 40 }}>Laddar rapporter...</p> : incidents.length === 0 ? <p style={{ color: "#bbb", textAlign: "center", padding: 40 }}>Inga rapporter ännu.</p> : incidents.map(inc => <IncidentCard key={inc.id} incident={inc} />)}</div>
      }
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

const TABS = [{ id: "launches", label: "Starter" }, { id: "guidelines", label: "Briefing" }, { id: "landings", label: "Landningar" }, { id: "incidents", label: "Incidentrapporter" }];

export default function App() {
  const [tab, setTab] = useState("launches");
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#faf9f6", minHeight: "100vh" }}>
      <div style={{ background: "#1a1a1a", color: "#fff", padding: "20px 24px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: "-0.02em" }}>Åre Speedflying</h1>
            <span style={{ fontSize: 12, color: "#888", background: "#2a2a2a", padding: "2px 8px", borderRadius: 4 }}>Community Hub</span>
          </div>
          <p style={{ fontSize: 13, color: "#666", margin: "0 0 16px" }}>Starter · Riktlinjer · Landningar · Incidentrapportering</p>
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 14, color: tab === t.id ? "#fff" : "#888", whiteSpace: "nowrap", borderBottom: tab === t.id ? "2px solid #fff" : "2px solid transparent", marginBottom: -1 }}>{t.label}</button>)}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px" }}>
        {tab === "launches" && <LaunchesTab />}
        {tab === "guidelines" && <GuidelinesTab />}
        {tab === "landings" && <LandingsTab />}
        {tab === "incidents" && <IncidentsTab />}
      </div>
    </div>
  );
}
