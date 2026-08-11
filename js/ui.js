/* ==========================================================================
   SOLAR SYSTEM EXPLORER - USER INTERFACE CONTROLLER
   ========================================================================== */

class UIController {
    constructor(engine) {
        this.engine = engine;
        this.audioEnabled = true;
        this.musicPlaying = false;
        this.currentTourIndex = 0;
        this.audioCtx = null;
        this.musicOsc1 = null;
        this.musicOsc2 = null;
        this.currentSelectedCraft = null;

        this.initDOM();
        this.initEvents();
        this.initAudio();
    }

    initDOM() {
        // Top HUD Elements
        this.searchInput = document.getElementById('search-input');
        this.searchDropdown = document.getElementById('search-dropdown');
        this.audioToggleBtn = document.getElementById('audio-toggle-btn');
        this.musicToggleBtn = document.getElementById('music-toggle-btn');
        this.viewResetBtn = document.getElementById('view-reset-btn');
        this.viewTopBtn = document.getElementById('view-top-btn');

        // Sidebar Elements
        this.sidebar = document.getElementById('info-sidebar');
        this.sidebarCloseBtn = document.getElementById('sidebar-close-btn');
        this.planetAvatar = document.getElementById('sidebar-planet-avatar');
        this.planetName = document.getElementById('sidebar-planet-name');
        this.planetType = document.getElementById('sidebar-planet-type');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');
        this.btnNarratePlanet = document.getElementById('btn-narrate-planet');

        // Simulation Dock Elements
        this.btnPlayPause = document.getElementById('btn-play-pause');
        this.btnReverse = document.getElementById('btn-reverse');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValueText = document.getElementById('speed-value-text');
        this.btnFollow = document.getElementById('btn-follow-planet');
        this.btnOrbits = document.getElementById('btn-toggle-orbits');
        this.btnSpacecraft = document.getElementById('btn-toggle-spacecraft');

        // Spacecraft Modal Elements
        this.spacecraftModal = document.getElementById('spacecraft-modal');
        this.spacecraftModalClose = document.getElementById('spacecraft-modal-close');
        this.btnFlyToMission = document.getElementById('btn-fly-to-mission');

        // Comparison Modal Elements
        this.compareModal = document.getElementById('compare-modal');
        this.btnCompareOpen = document.getElementById('btn-compare-open');
        this.compareCloseBtn = document.getElementById('compare-close-btn');
        this.selectPlanet1 = document.getElementById('select-planet-1');
        this.selectPlanet2 = document.getElementById('select-planet-2');

        // Tour Elements
        this.tourOverlay = document.getElementById('tour-overlay');
        this.btnTourStart = document.getElementById('btn-tour-start');
        this.tourCloseBtn = document.getElementById('tour-close-btn');
        this.tourNextBtn = document.getElementById('tour-next-btn');
        this.tourPrevBtn = document.getElementById('tour-prev-btn');

        // Bind engine callbacks
        this.engine.onPlanetSelectedCallback = (planetData) => this.showPlanetInfo(planetData);
        this.engine.onSpacecraftSelectedCallback = (sData) => this.showSpacecraftInfo(sData);
    }

    initAudio() {
        // Synthesize UI SFX via Web Audio API (Zero external MP3 download required)
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        } catch (e) {
            console.warn("Web Audio API not supported.");
        }
    }

    playSfx(freq = 440, duration = 0.08, type = 'sine') {
        if (!this.audioEnabled || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {}
    }

    /* Cosmic Ambient Soundscape Synth Generator */
    toggleCosmicMusic() {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        if (this.musicPlaying) {
            if (this.musicGain) {
                this.musicGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.0);
            }
            this.musicPlaying = false;
            if (this.musicToggleBtn) this.musicToggleBtn.classList.remove('active');
        } else {
            this.musicOsc1 = this.audioCtx.createOscillator();
            this.musicOsc2 = this.audioCtx.createOscillator();
            this.musicFilter = this.audioCtx.createBiquadFilter();
            this.musicGain = this.audioCtx.createGain();

            this.musicOsc1.type = 'sawtooth';
            this.musicOsc1.frequency.setValueAtTime(55, this.audioCtx.currentTime);

            this.musicOsc2.type = 'sine';
            this.musicOsc2.frequency.setValueAtTime(110.5, this.audioCtx.currentTime);

            this.musicFilter.type = 'lowpass';
            this.musicFilter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

            this.musicGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
            this.musicGain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 2.0);

            this.musicOsc1.connect(this.musicFilter);
            this.musicOsc2.connect(this.musicFilter);
            this.musicFilter.connect(this.musicGain);
            this.musicGain.connect(this.audioCtx.destination);

            this.musicOsc1.start();
            this.musicOsc2.start();

            this.musicPlaying = true;
            if (this.musicToggleBtn) this.musicToggleBtn.classList.add('active');
        }
    }

    /* AI Voice Narrator via Web SpeechSynthesis API */
    narratePlanet(planetName) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const p = SOLAR_DATA[planetName];
            if (!p) return;

            const text = `${p.name}, a ${p.type}. ${p.description} Fun fact: ${p.funFact}`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
            this.playSfx(880);
        }
    }

    showSpacecraftInfo(sData) {
        this.currentSelectedCraft = sData;

        const badge = document.getElementById('mission-agency-badge');
        if (badge) {
            badge.textContent = sData.agency || 'ISRO (India)';
            if (sData.agency && sData.agency.includes('ISRO')) {
                badge.style.background = 'rgba(255, 153, 51, 0.25)';
                badge.style.borderColor = '#ff9933';
                badge.style.color = '#ffaa44';
            } else {
                badge.style.background = 'rgba(6, 182, 212, 0.25)';
                badge.style.borderColor = '#00f0ff';
                badge.style.color = '#00f0ff';
            }
        }

        document.getElementById('mission-modal-title').textContent = sData.name;
        document.getElementById('mission-modal-type').textContent = sData.type;
        document.getElementById('mission-rocket').textContent = sData.rocket || 'N/A';
        document.getElementById('mission-launch').textContent = sData.launched;
        document.getElementById('mission-site').textContent = sData.site;
        document.getElementById('mission-desc').textContent = sData.description;
        document.getElementById('mission-achievements').textContent = sData.achievements;

        if (this.spacecraftModal) this.spacecraftModal.classList.add('active');
        this.playSfx(700);
    }

    initEvents() {
        // Search Input Filtering
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            this.searchInput.addEventListener('focus', () => {
                if (this.searchInput.value) this.searchDropdown.classList.add('active');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.searchDropdown.classList.remove('active');
            }
        });

        // Top HUD Buttons
        if (this.audioToggleBtn) {
            this.audioToggleBtn.addEventListener('click', () => {
                this.audioEnabled = !this.audioEnabled;
                this.audioToggleBtn.classList.toggle('active', this.audioEnabled);
                this.audioToggleBtn.innerHTML = this.audioEnabled ? '🔊' : '🔇';
                this.playSfx(600);
            });
        }

        if (this.musicToggleBtn) {
            this.musicToggleBtn.addEventListener('click', () => this.toggleCosmicMusic());
        }

        if (this.viewResetBtn) {
            this.viewResetBtn.addEventListener('click', () => {
                this.engine.resetView();
                this.playSfx(520);
            });
        }

        if (this.viewTopBtn) {
            this.viewTopBtn.addEventListener('click', () => {
                this.engine.setTopView();
                this.playSfx(580);
            });
        }

        // Sidebar
        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener('click', () => {
                this.sidebar.classList.remove('active');
                this.playSfx(350);
            });
        }

        if (this.btnNarratePlanet) {
            this.btnNarratePlanet.addEventListener('click', () => {
                if (this.currentSelectedPlanet) {
                    this.narratePlanet(this.currentSelectedPlanet.name);
                }
            });
        }

        // Spacecraft Modal Events
        if (this.spacecraftModalClose) {
            this.spacecraftModalClose.addEventListener('click', () => {
                if (this.spacecraftModal) this.spacecraftModal.classList.remove('active');
                this.playSfx(350);
            });
        }

        if (this.btnFlyToMission) {
            this.btnFlyToMission.addEventListener('click', () => {
                if (this.currentSelectedCraft) {
                    this.engine.flyToSpacecraft(this.currentSelectedCraft.id);
                    if (this.spacecraftModal) this.spacecraftModal.classList.remove('active');
                    this.playSfx(800);
                }
            });
        }

        // Sidebar Tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                this.tabBtns.forEach(b => b.classList.remove('active'));
                this.tabPanes.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${targetTab}`).classList.add('active');
                this.playSfx(480);
            });
        });

        // Simulation Dock
        if (this.btnPlayPause) {
            this.btnPlayPause.addEventListener('click', () => {
                this.engine.isPaused = !this.engine.isPaused;
                this.btnPlayPause.innerHTML = this.engine.isPaused ? '▶ Play' : '⏸ Pause';
                this.btnPlayPause.classList.toggle('active', this.engine.isPaused);
                this.playSfx(500);
            });
        }

        if (this.btnReverse) {
            this.btnReverse.addEventListener('click', () => {
                this.engine.isReversed = !this.engine.isReversed;
                this.btnReverse.classList.toggle('active', this.engine.isReversed);
                this.playSfx(450);
            });
        }

        if (this.speedSlider) {
            this.speedSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.engine.simulationSpeed = val;
                this.speedValueText.textContent = `${val.toFixed(2)}x`;
            });
        }

        if (this.btnOrbits) {
            this.btnOrbits.addEventListener('click', () => {
                this.engine.toggleOrbits(!this.engine.showOrbits);
                this.btnOrbits.classList.toggle('active', this.engine.showOrbits);
                this.playSfx(540);
            });
        }

        if (this.btnSpacecraft) {
            this.btnSpacecraft.addEventListener('click', () => {
                this.engine.toggleSpacecraft(!this.engine.showSpacecraft);
                this.btnSpacecraft.classList.toggle('active', this.engine.showSpacecraft);
                this.playSfx(560);
            });
        }

        // Comparison Modal
        if (this.btnCompareOpen) {
            this.btnCompareOpen.addEventListener('click', () => {
                this.populateComparisonSelects();
                this.compareModal.classList.add('active');
                this.renderComparison();
                this.playSfx(620);
            });
        }

        if (this.compareCloseBtn) {
            this.compareCloseBtn.addEventListener('click', () => {
                this.compareModal.classList.remove('active');
                this.playSfx(350);
            });
        }

        if (this.selectPlanet1) {
            this.selectPlanet1.addEventListener('change', () => this.renderComparison());
        }
        if (this.selectPlanet2) {
            this.selectPlanet2.addEventListener('change', () => this.renderComparison());
        }

        // Guided Tour
        if (this.btnTourStart) {
            this.btnTourStart.addEventListener('click', () => {
                this.startGuidedTour();
                this.playSfx(800);
            });
        }

        if (this.tourCloseBtn) {
            this.tourCloseBtn.addEventListener('click', () => {
                this.tourOverlay.classList.remove('active');
                this.engine.followingPlanet = null;
                this.engine.resetView();
                this.playSfx(350);
            });
        }

        if (this.tourNextBtn) {
            this.tourNextBtn.addEventListener('click', () => {
                if (this.currentTourIndex < TOUR_STEPS.length - 1) {
                    this.currentTourIndex++;
                    this.showTourStep(this.currentTourIndex);
                    this.playSfx(600);
                }
            });
        }

        if (this.tourPrevBtn) {
            this.tourPrevBtn.addEventListener('click', () => {
                if (this.currentTourIndex > 0) {
                    this.currentTourIndex--;
                    this.showTourStep(this.currentTourIndex);
                    this.playSfx(500);
                }
            });
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.searchDropdown.classList.remove('active');
            return;
        }

        const matches = Object.values(SOLAR_DATA).filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.type.toLowerCase().includes(query.toLowerCase())
        );

        this.searchDropdown.innerHTML = '';
        if (matches.length === 0) {
            this.searchDropdown.innerHTML = '<div class="search-item">No celestial objects found</div>';
        } else {
            matches.forEach(p => {
                const item = document.createElement('div');
                item.className = 'search-item';
                item.innerHTML = `
                    <span class="search-item-dot" style="background: #${p.color ? p.color.toString(16) : 'fff'}"></span>
                    <div>
                        <strong>${p.name}</strong>
                        <span style="font-size: 11px; opacity: 0.7; margin-left: 8px;">${p.type}</span>
                    </div>
                `;
                item.addEventListener('click', () => {
                    this.engine.selectPlanet(p.name);
                    this.searchDropdown.classList.remove('active');
                    this.searchInput.value = '';
                    this.playSfx(700);
                });
                this.searchDropdown.appendChild(item);
            });
        }
        this.searchDropdown.classList.add('active');
    }

    showPlanetInfo(data) {
        this.currentSelectedPlanet = data;
        this.sidebarPlanetName = data.name;

        this.planetName.textContent = data.name;
        this.planetType.textContent = data.type;
        this.planetAvatar.src = `textures/${data.textureKey.toLowerCase()}.jpg`;

        document.getElementById('planet-desc').textContent = data.description;
        document.getElementById('planet-fun-fact').textContent = data.funFact;

        // Populate Specs
        const specsContainer = document.getElementById('tab-specs');
        if (specsContainer && data.info) {
            specsContainer.innerHTML = Object.entries(data.info).map(([key, val]) => `
                <div class="spec-row">
                    <span class="spec-label">${this.formatKey(key)}</span>
                    <span class="spec-val">${val}</span>
                </div>
            `).join('');
        }

        // Populate History
        const historyContainer = document.getElementById('tab-history');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="history-box">
                    <h4>📜 Exploration History</h4>
                    <p>${data.history || 'Monitored by terrestrial and space observatories.'}</p>
                </div>
            `;
        }

        this.sidebar.classList.add('active');
        this.playSfx(650);
    }

    formatKey(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    populateComparisonSelects() {
        const planets = Object.keys(SOLAR_DATA);
        if (this.selectPlanet1 && this.selectPlanet2) {
            this.selectPlanet1.innerHTML = planets.map(p => `<option value="${p}">${p}</option>`).join('');
            this.selectPlanet2.innerHTML = planets.map(p => `<option value="${p}">${p}</option>`).join('');
            this.selectPlanet2.selectedIndex = 1;
        }
    }

    renderComparison() {
        const p1 = SOLAR_DATA[this.selectPlanet1.value];
        const p2 = SOLAR_DATA[this.selectPlanet2.value];
        const body = document.getElementById('compare-body');

        if (!p1 || !p2 || !body) return;

        body.innerHTML = `
            <div class="compare-card glass">
                <h3>${p1.name}</h3>
                <p><strong>Diameter:</strong> ${p1.info.diameter}</p>
                <p><strong>Mass:</strong> ${p1.info.mass}</p>
                <p><strong>Gravity:</strong> ${p1.info.gravity}</p>
                <p><strong>Temp:</strong> ${p1.info.temperature}</p>
            </div>
            <div class="compare-card glass">
                <h3>${p2.name}</h3>
                <p><strong>Diameter:</strong> ${p2.info.diameter}</p>
                <p><strong>Mass:</strong> ${p2.info.mass}</p>
                <p><strong>Gravity:</strong> ${p2.info.gravity}</p>
                <p><strong>Temp:</strong> ${p2.info.temperature}</p>
            </div>
        `;
    }

    startGuidedTour() {
        this.currentTourIndex = 0;
        this.tourOverlay.classList.add('active');
        this.showTourStep(0);
    }

    showTourStep(index) {
        const step = TOUR_STEPS[index];
        if (!step) return;

        document.getElementById('tour-title').textContent = step.title;
        document.getElementById('tour-badge').textContent = `Step ${index + 1} of ${TOUR_STEPS.length}`;
        document.getElementById('tour-text').textContent = step.text;

        this.engine.followingPlanet = step.planet;
        this.engine.flyToPlanet(step.planet, step.distance);
    }
}
