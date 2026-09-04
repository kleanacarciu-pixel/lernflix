// =============================================================================
// Service Worker – nur für Kleanas Termin-Erinnerungen (Web Push).
//
// Bewusst OHNE Offline-Cache: Die App soll immer live vom Server kommen
// (Versions-Erkennung im Kalender). Hier passiert nur zweierlei:
//   push              → Benachrichtigung anzeigen
//   notificationclick → Kalender öffnen bzw. in den Vordergrund holen
// =============================================================================
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let daten = { titel: "Lerne mit Anna", text: "" };
  try { daten = { ...daten, ...event.data.json() }; } catch { /* Textnachricht */ }
  event.waitUntil(self.registration.showNotification(daten.titel, {
    body: daten.text,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: daten.tag || undefined, // gleiche Erinnerung nicht doppelt stapeln
    data: { url: daten.url || "/kalender" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const ziel = (event.notification.data && event.notification.data.url) || "/kalender";
  event.waitUntil((async () => {
    const fenster = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const f of fenster) {
      if (f.url.includes("/kalender") && "focus" in f) return f.focus();
    }
    return self.clients.openWindow(ziel);
  })());
});
