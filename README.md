# 🌌 Solar System Explorer

### An Interactive 3D Solar System built with Three.js & Modern Web Technologies

Explore the planets, experience realistic orbital physics and lighting, run simulations, compare celestial bodies, take narrated tours, and test your knowledge through an immersive web experience.

---

## ✨ Features & Capabilities

### 🪐 3D Visual Realism & Rendering
- **Full Solar System**: Sun, 8 major planets, Pluto, Earth's Moon, and major planetary moons.
- **Saturn 3D Rings**: Custom geometry with realistic transparency and rotational tilt.
- **Earth Atmosphere & Cloud Layer**: Rotating cloud mesh with additive atmospheric blending.
- **Solar Atmosphere & Corona**: Glowing Sun lens flare and atmospheric corona effect.
- **3D Particle Starfield**: Thousands of dynamic twinkling star particles in deep space.
- **Procedural Asteroid Belt**: Over 350 asteroids orbiting between Mars and Jupiter.
- **Cinematic Camera Lerp (`flyToPlanet`)**: Smooth GSAP camera transitions when selecting or searching for any planet.

### 🎮 Simulation & Control Dock
- **Time Controls**: Play, Pause, Reverse, and Speed Slider (0.1x to 5.0x simulation speed).
- **Camera Presets**: System Overview, Top-Down Grid View, and "Camera Follow" mode.
- **Interactive Search**: Search bar with real-time auto-complete dropdown to jump directly to any planet or moon.
- **Orbital Toggles**: Toggle orbital path rings and 3D labels on/off.

### 📊 Educational & Guided Tour Tools
- **Glassmorphic Slide-Out Sidebar**: Detailed tabs for *Overview*, *Specifications*, and *Exploration History*.
- **Side-by-Side Planet Comparator Tool**: Compare size, gravity, mass, and temperature of any two planets side-by-side.
- **Guided Story Tour**: Interactive step-by-step camera walkthrough from the Sun out to Neptune with text narration.
- **Web Audio SFX**: Synthesized futuristic audio effects without needing external sound files.

### 🏆 Gamified Quiz System
- **Multiple Choice Questions**: 8 randomized questions per round.
- **Real-Time Timer & Combo Streaks**: 15-second timer per question with combo streak score multipliers.
- **High Scores**: Saved automatically in `localStorage`.
- **Celebratory Confetti**: HTML5 Canvas particle explosion on quiz completion.

---

## 📂 Project Structure

```
Solar-System-Project/
│
├── css/
│   └── styles.css        # Glassmorphism design system & responsive UI styles
│
├── js/
│   ├── data.js           # Astronomical dataset, tour steps & quiz question pool
│   ├── solarSystem.js    # Three.js 3D rendering engine, lighting, & camera controls
│   ├── ui.js             # HUD, search, sidebar, comparison modal, & tour runner
│   └── quiz.js           # Gamified quiz engine, timer, streak counters, & confetti
│
├── textures/             # Planetary surface image maps
│   ├── sun.jpg
│   ├── mercury.jpg
│   ├── venus.jpg
│   ├── earth.jpg
│   ├── mars.jpg
│   ├── jupiter.jpg
│   ├── saturn.jpg
│   ├── uranus.jpg
│   ├── neptune.jpg
│   └── moon.jpg
│
├── index.html            # Main 3D Solar System Explorer application
├── quiz.html             # Standalone Astronomy Quiz application
└── README.md             # Documentation
```

---

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/S-SamarthBhatt-B/Solar-System-Project.git
```

2. Navigate into the directory:
```bash
cd Solar-System-Project
```

3. Open `index.html` in your browser (or use VS Code **Live Server**).

---

## 🛠️ Technologies Used

- **HTML5 & CSS3** (Vanilla CSS Custom Properties & Glassmorphism)
- **JavaScript (ES6)**
- **Three.js (r128)** (3D WebGL Rendering & OrbitControls)
- **GSAP (GreenSock)** (Smooth camera position & target interpolation)
- **Web Audio API** (Native audio synthesizer for UI sound effects)

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and share!