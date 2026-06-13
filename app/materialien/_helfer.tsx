"use client";
import { type ReactNode } from "react";

export const SHARED_STIL = (farbe: string, hellFarbe: string, hellHinter: string) => `
  .mat { font-size:16px; line-height:1.7; color:#1d1d1f; }
  .mat h2 { font-family:Georgia,serif; font-size:26px; font-weight:800; color:${farbe}; margin:38px 0 14px; display:flex; align-items:center; gap:12px; }
  .mat h2 .num { background:${farbe}; color:#fff; min-width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:18px; padding:0 6px; }
  .mat h3 { font-size:19px; font-weight:700; margin:22px 0 10px; }
  .mat h4 { font-size:16px; font-weight:700; margin:14px 0 6px; color:${farbe}; }
  .mat p { margin:8px 0; }
  .mat .hook { background:linear-gradient(135deg, ${hellHinter}, #fff); border-left:4px solid ${farbe}; border-radius:0 12px 12px 0; padding:14px 18px; margin:14px 0; font-size:16px; font-style:italic; color:#3a3a3c; }
  .mat .hook b { font-style:normal; color:${farbe}; }
  .mat .erkl { color:#3a3a3c; }
  .mat .formeln { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin:14px 0; }
  .mat .formel { background:#fff8e6; border:1.5px solid #f5d76e; border-radius:12px; padding:12px 16px; }
  .mat .formel .name { font-size:12px; color:#a37300; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; }
  .mat .formel .ausdruck { font-family:Georgia,serif; font-size:17px; font-weight:700; color:#1d1d1f; }
  .mat .formel .hinweis { font-size:13px; color:#6e6e73; margin-top:4px; }
  .mat .beispiel { background:${hellHinter}; border-left:4px solid ${farbe}; border-radius:10px; padding:14px 18px; margin:14px 0; }
  .mat .beispiel .lbl { font-size:12px; font-weight:700; color:${farbe}; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .beispiel ol { padding-left:22px; margin:8px 0 0; }
  .mat .beispiel li { margin:6px 0; }
  .mat .tipp { background:#e7f7ec; border-left:4px solid #34c759; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .tipp b { color:#1f7f3a; }
  .mat .joke { background:#fffbeb; border:1.5px dashed #f59e0b; border-radius:12px; padding:12px 16px; margin:14px 0; font-size:15px; color:#7c5404; }
  .mat .joke b { color:#a37300; }
  .mat .merke { background:#fdecea; border-left:4px solid #ef4444; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .merke b { color:#b91c1c; }
  .mat .karten { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:14px 0; }
  .mat .karte { background:#fff; border:1px solid #ececec; border-radius:14px; padding:14px 16px; }
  .mat .karte h5 { font-size:15px; font-weight:700; margin:0 0 6px; color:${farbe}; }
  .mat table { width:100%; border-collapse:collapse; margin:14px 0; font-size:14.5px; }
  .mat th { background:${farbe}; color:#fff; padding:9px 12px; text-align:left; font-size:13px; }
  .mat td { padding:8px 12px; border-bottom:1px solid #ececec; }
  .mat tr:nth-child(even) td { background:${hellFarbe}; }
  .mat .fig { background:#f8f8fb; border-radius:14px; padding:18px; margin:14px 0; display:flex; justify-content:center; flex-wrap:wrap; gap:18px; }
  .mat .gross { text-align:center; font-family:Georgia,serif; font-size:28px; font-weight:800; padding:22px 0; background:${hellHinter}; border-radius:14px; margin:12px 0; }
  @media print { .mat .fig, .mat .beispiel, .mat .karte, .mat .joke { break-inside:avoid; } }
`;

export function Sektion({ nr, titel, children }: { nr: number | string; titel: string; children: ReactNode }) {
  return <section><h2><span className="num">{nr}</span>{titel}</h2>{children}</section>;
}

export function Formel({ name, ausdruck, hinweis }: { name: string; ausdruck: ReactNode; hinweis?: string }) {
  return (
    <div className="formel">
      <div className="name">{name}</div>
      <div className="ausdruck">{ausdruck}</div>
      {hinweis && <div className="hinweis">{hinweis}</div>}
    </div>
  );
}

export function Beispiel({ aufgabe, schritte }: { aufgabe: ReactNode; schritte: ReactNode[] }) {
  return (
    <div className="beispiel">
      <div className="lbl">Beispiel</div>
      <p>{aufgabe}</p>
      <ol>{schritte.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </div>
  );
}

export function Joke({ children }: { children: ReactNode }) {
  return <div className="joke"><b>Übrigens:</b> {children}</div>;
}

export function Hook({ children }: { children: ReactNode }) {
  return <div className="hook">{children}</div>;
}
