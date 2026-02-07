# KlarText

**Politik verstehen. Alltag reflektieren. Demokratie stärken.**

KlarText ist eine App bzw Website, die Menschen hilft, ihren eigenen politischen Standpunkt zu reflektieren – ohne Belehrung, ohne Parteipolitik, sondern durch Verständnis.

## Vision

Politik ist nicht abstrakt. Sie betrifft jeden Alltag – von der Busverbindung bis zum Arzttermin. KlarText macht diese Zusammenhänge sichtbar und hilft dabei, populistische Muster zu erkennen, ohne zu bewerten.

→ **Mehr zur Vision:** [konzept.md](konzept.md)

## Features

- **Dein Alltag ist politisch**: Alltagssituationen mit politischen Themen verbinden
- **Werteprofil**: Welche Werte sind dir wichtig?
- **Populismus verstehen**: Muster erkennen durch Reflexion
- **Szenarien**: "Was wäre wenn...?" – Zusammenhänge verstehen
- **Wissenshäppchen**: Kurze Fakten, die Alltag und Politik verbinden

## Live Demo

[Zur App](https://kristjan.github.io/klartext) _(noch in Entwicklung)_

## Technologie

- **PWA** – funktioniert auf allen Geräten, installierbar, offline-fähig
- **Vanilla JavaScript** – keine schweren Frameworks
- **GitHub Pages** – kostenlos und einfach zu deployen
- **Responsive Design** – von Smartphone bis Desktop

## Lokal entwickeln

```bash
# Repository klonen
git clone https://github.com/yourusername/klartext.git
cd klartext

# Einfach index.html im Browser öffnen
# Oder mit einem lokalen Server:
python -m http.server 8000
# → http://localhost:8000
```

## Projektstruktur

```
klartext/
├── index.html          # Hauptseite
├── about.html          # Über KlarText
├── css/
│   └── style.css       # Styling
├── js/
│   ├── app.js          # Hauptlogik
│   └── modules/        # Module (Alltag, Werte, etc.)
├── manifest.json       # PWA Manifest
├── sw.js               # Service Worker
└── konzept.md          # Ausführliches Konzept
```

## Beitragen

KlarText lebt von Vielfalt und Perspektiven. Beiträge sind willkommen!

**Wie kannst du helfen?**
- **Inhalt**: Fragen, Szenarien, Wissenshäppchen formulieren
- **Code**: Features entwickeln, Bugs fixen
- **Design**: UX/UI verbessern
- **Feedback**: Die App testen und Rückmeldung geben

**Wichtig:** Alle Inhalte müssen neutral, faktenbasiert und nicht-parteipolitisch sein.

## Lizenz

MIT License – siehe [LICENSE](LICENSE.md)

## Kontakt & Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/klartext/issues)
- **Diskussionen**: [GitHub Discussions](https://github.com/yourusername/klartext/discussions)

---

**KlarText** – Weil Politik uns alle betrifft.
