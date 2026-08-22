"use client";
import React from "react";

// Wandelt Text mit Brüchen ("3/4", "2 1/4") in echte, gestapelte Brüche.
// Alles andere bleibt normaler Text. Dezimalzahlen (0,75) haben kein "/" und
// bleiben deshalb unberührt.

function Frac({ z, n }: { z: string; n: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        margin: "0 0.18em",
        lineHeight: 1,
        transform: "translateY(-0.04em)",
      }}
    >
      <span style={{ padding: "0 0.4em 0.06em", fontSize: "0.7em", lineHeight: 1.12 }}>{z}</span>
      <span style={{ padding: "0.06em 0.4em 0", fontSize: "0.7em", lineHeight: 1.12, borderTop: "1.4px solid currentColor" }}>{n}</span>
    </span>
  );
}

export function MathText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  const re = /(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <span key={key++} style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}>
          <span style={{ marginRight: "0.14em" }}>{m[1]}</span>
          <Frac z={m[2]} n={m[3]} />
        </span>,
      );
    } else {
      nodes.push(<Frac key={key++} z={m[4]} n={m[5]} />);
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
