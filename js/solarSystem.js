/* ==========================================================================
   SOLAR SYSTEM EXPLORER - 3D GRAPHICS ENGINE (THREE.JS)
   ========================================================================== */

class SolarSystemEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.planetObjects = {};
        this.moonObjects = [];
        this.asteroidBelt = [];
        this.orbitLines = [];
        this.labelElements = {};
        this.galaxyLabelElements = {};
        this.galaxyObjects = {};
        this.spacecraftObjects = {};
        this.spacecraftLabelElements = {};
        this.onSpacecraftSelectedCallback = null;
        
        // Simulation State
        this.simulationSpeed = 0.1;
        this.isPaused = false;
        this.isReversed = false;
        this.followingPlanet = null;
        this.showOrbits = true;
        this.showLabels = true;
        this.showSpacecraft = true;
        this.onPlanetSelectedCallback = null;

        this.initScene();
        this.initLights();
        this.initBackground();
        this.initDeepSpaceGalaxies();
        this.loadTextures();
        this.buildSolarSystem();
        this.buildAsteroidBelt();
        this.initSpacecraft();
        this.initLabels();
        this.initInteractions();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            6000
        );
        this.camera.position.set(0, 45, 80);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // ACES Filmic Tone Mapping for cinematic space contrast
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Orbit Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 4500;
        this.controls.minDistance = 1;
    }

    initLights() {
        // Bright Sunlight - Primary radial light source at Sun center
        this.sunLight = new THREE.PointLight(0xffffff, 5.0, 0, 0);
        this.sunLight.position.set(0, 0, 0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.scene.add(this.sunLight);

        // Dark Ambient Light (0.20) - Keeps night side dark while leaving surface details subtly visible
        this.ambientLight = new THREE.AmbientLight(0x223355, 0.20);
        this.scene.add(this.ambientLight);

        // Soft Rim Fill Light - Outlines planet silhouettes against deep space
        this.rimLight = new THREE.DirectionalLight(0x6688aa, 0.25);
        this.rimLight.position.set(-60, 50, -60);
        this.scene.add(this.rimLight);
    }

    initBackground() {
        // 3D Particle Starfield
        const starCount = 4500;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 2200;
            starPositions[i + 1] = (Math.random() - 0.5) * 2200;
            starPositions[i + 2] = (Math.random() - 0.5) * 2200;

            const tint = Math.random();
            starColors[i] = tint > 0.8 ? 0.8 : 1.0;
            starColors[i + 1] = tint > 0.8 ? 0.9 : 1.0;
            starColors[i + 2] = tint > 0.5 ? 1.0 : 0.8;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 1.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        this.starfield = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starfield);
    }

    /* Helper: Resolves 3D mesh for any planet or moon in the solar system */
    getCelestialMesh(name) {
        if (!name) return null;
        if (this.planetObjects[name]) {
            return this.planetObjects[name].mesh;
        }
        for (const pObj of Object.values(this.planetObjects)) {
            if (pObj.moons) {
                const moon = pObj.moons.find(m => m.data.name === name);
                if (moon) return moon.mesh;
            }
        }
        return null;
    }

    /* 3D Intergalactic Deep Space Engine - Renders Milky Way & Neighboring Galaxies */
    initDeepSpaceGalaxies() {
        this.galaxyGroup = new THREE.Group();
        this.galaxyMaterials = [];

        const galaxiesData = [
            {
                id: "milkyway",
                name: "Milky Way Galaxy (Home)",
                distText: "0 Light Years (Solar System)",
                pos: { x: 0, y: -40, z: 0 },
                radius: 950,
                arms: 4,
                colorCore: 0xffca3a,
                colorArms: 0x3a86ff,
                colorDust: 0x8338ec,
                particleCount: 16000
            },
            {
                id: "andromeda",
                name: "Andromeda Galaxy (M31)",
                distText: "2.5 Million Light Years",
                pos: { x: -1400, y: 350, z: -1200 },
                radius: 750,
                arms: 2,
                colorCore: 0xffaa44,
                colorArms: 0x00f0ff,
                colorDust: 0xaa44ff,
                particleCount: 12000
            },
            {
                id: "triangulum",
                name: "Triangulum Galaxy (M33)",
                distText: "2.7 Million Light Years",
                pos: { x: 1500, y: -250, z: -1100 },
                radius: 500,
                arms: 3,
                colorCore: 0xffeeaa,
                colorArms: 0x3a86ff,
                colorDust: 0x00ffcc,
                particleCount: 8000
            },
            {
                id: "sombrero",
                name: "Sombrero Galaxy (M104)",
                distText: "31 Million Light Years",
                pos: { x: 1800, y: 550, z: 1200 },
                radius: 600,
                arms: 2,
                colorCore: 0xffffff,
                colorArms: 0xff8833,
                colorDust: 0x552266,
                particleCount: 9000
            },
            {
                id: "whirlpool",
                name: "Whirlpool Galaxy (M51)",
                distText: "23 Million Light Years",
                pos: { x: -1600, y: 700, z: 1400 },
                radius: 550,
                arms: 2,
                colorCore: 0xffdd88,
                colorArms: 0x8338ec,
                colorDust: 0x00f0ff,
                particleCount: 9000
            },
            {
                id: "lmc",
                name: "Large Magellanic Cloud",
                distText: "160,000 Light Years",
                pos: { x: -900, y: -500, z: 700 },
                radius: 350,
                arms: 1,
                colorCore: 0xffccaa,
                colorArms: 0xff007f,
                colorDust: 0x3a86ff,
                particleCount: 5000
            }
        ];

        const container = document.getElementById('labels-container');

        galaxiesData.forEach(g => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(g.particleCount * 3);
            const colors = new Float32Array(g.particleCount * 3);

            const spin = 1.1;
            const cCore = new THREE.Color(g.colorCore);
            const cArms = new THREE.Color(g.colorArms);
            const cDust = new THREE.Color(g.colorDust);

            for (let i = 0; i < g.particleCount; i++) {
                const i3 = i * 3;

                const r = Math.pow(Math.random(), 1.8) * g.radius + 10;
                const spinAngle = r * spin * 0.004;
                const branchAngle = ((i % g.arms) / g.arms) * Math.PI * 2;

                const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35) * r;
                const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.2) * (g.radius - r) * 0.25;
                const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35) * r;

                positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

                const mixedColor = cCore.clone();
                const lerpRatio = r / g.radius;

                if (Math.random() > 0.55) {
                    mixedColor.lerp(cDust, lerpRatio);
                } else {
                    mixedColor.lerp(cArms, lerpRatio);
                }

                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const mat = new THREE.PointsMaterial({
                size: 2.6,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                transparent: true,
                opacity: 0.0
            });

            const galaxyMesh = new THREE.Points(geometry, mat);
            galaxyMesh.position.set(g.pos.x, g.pos.y, g.pos.z);
            galaxyMesh.rotation.z = Math.random() * 0.4;
            galaxyMesh.rotation.x = Math.random() * 0.4;

            this.galaxyGroup.add(galaxyMesh);
            this.galaxyMaterials.push(mat);

            this.galaxyObjects[g.id] = {
                mesh: galaxyMesh,
                data: g,
                mat: mat
            };

            // Build 3D HTML Galaxy Label
            if (container) {
                const el = document.createElement('div');
                el.className = 'galaxy-label';
                el.innerHTML = `🌌 <strong>${g.name}</strong><br><span style="opacity: 0.75; font-weight: 400; font-size: 9px;">${g.distText}</span>`;
                el.style.display = 'none';
                el.addEventListener('click', () => this.flyToGalaxy(g));
                container.appendChild(el);
                this.galaxyLabelElements[g.id] = el;
            }
        });

        this.galaxyGroup.visible = false;
        this.scene.add(this.galaxyGroup);
    }

    flyToGalaxy(galaxyData) {
        const targetPos = galaxyData.pos;
        const cameraEndPos = new THREE.Vector3(
            targetPos.x + galaxyData.radius * 1.5,
            targetPos.y + galaxyData.radius * 0.8,
            targetPos.z + galaxyData.radius * 1.5
        );

        if (typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, {
                x: cameraEndPos.x,
                y: cameraEndPos.y,
                z: cameraEndPos.z,
                duration: 2.0,
                ease: 'power2.out'
            });

            gsap.to(this.controls.target, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 2.0,
                ease: 'power2.out'
            });
        } else {
            this.camera.position.copy(cameraEndPos);
            this.controls.target.copy(targetPos);
        }
    }

    /* FEATURE: ISRO & GLOBAL SPACECRAFT MISSIONS ENGINE */
    initSpacecraft() {
        const container = document.getElementById('labels-container');
        if (typeof SPACECRAFT_DATA === 'undefined') return;

        for (const [id, sData] of Object.entries(SPACECRAFT_DATA)) {
            // Build 3D Craft Mesh representation
            const craftGroup = new THREE.Group();
            
            // Core Gold Foil Satellite Body
            const coreGeo = new THREE.BoxGeometry(0.25, 0.25, 0.35);
            const coreMat = new THREE.MeshStandardMaterial({
                color: sData.color || 0xff9933,
                metalness: 0.85,
                roughness: 0.2
            });
            const coreMesh = new THREE.Mesh(coreGeo, coreMat);
            craftGroup.add(coreMesh);

            // Solar Array Wings (ISRO Saffron/Gold Panels)
            const wingGeo = new THREE.BoxGeometry(0.9, 0.02, 0.25);
            const wingMat = new THREE.MeshStandardMaterial({ color: 0x0a192f, roughness: 0.1 });
            const wingMesh = new THREE.Mesh(wingGeo, wingMat);
            craftGroup.add(wingMesh);

            // Parabolic Antenna Dish
            const dishGeo = new THREE.ConeGeometry(0.18, 0.09, 16);
            const dishMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6 });
            const dishMesh = new THREE.Mesh(dishGeo, dishMat);
            dishMesh.rotation.x = Math.PI / 2;
            dishMesh.position.z = 0.22;
            craftGroup.add(dishMesh);

            this.scene.add(craftGroup);

            this.spacecraftObjects[id] = {
                mesh: craftGroup,
                data: sData,
                angle: Math.random() * Math.PI * 2
            };

            // Build Floating 3D Clickable Badge
            if (container) {
                const el = document.createElement('div');
                el.className = 'spacecraft-label';
                const isroPrefix = (sData.agency && sData.agency.includes('ISRO')) ? '🇮🇳 ISRO | ' : '🛰️ ';
                el.innerHTML = `${isroPrefix}<strong>${sData.name}</strong>`;
                el.addEventListener('click', () => {
                    if (this.onSpacecraftSelectedCallback) {
                        this.onSpacecraftSelectedCallback(sData);
                    }
                });
                container.appendChild(el);
                this.spacecraftLabelElements[id] = el;
            }
        }
    }

    flyToSpacecraft(id) {
        const craft = this.spacecraftObjects[id];
        if (!craft) return;

        const targetPos = new THREE.Vector3();
        craft.mesh.getWorldPosition(targetPos);

        if (typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, {
                x: targetPos.x + 3,
                y: targetPos.y + 2,
                z: targetPos.z + 3,
                duration: 1.5
            });
            gsap.to(this.controls.target, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 1.5
            });
        } else {
            this.camera.position.set(targetPos.x + 3, targetPos.y + 2, targetPos.z + 3);
            this.controls.target.copy(targetPos);
        }
    }

    /* Loads textures via Base64 Data URIs to guarantee 100% CORS-free WebGL rendering */
    loadTextures() {
        this.textureLoader = new THREE.TextureLoader();
        this.loadedTextures = {};

        const textureKeys = {
            Sun: 'sun',
            Mercury: 'mercury',
            Venus: 'venus',
            Earth: 'earth',
            Mars: 'mars',
            Jupiter: 'jupiter',
            Saturn: 'saturn',
            Uranus: 'uranus',
            Neptune: 'neptune',
            Moon: 'moon'
        };

        for (const [key, b64Key] of Object.entries(textureKeys)) {
            const dataUri = (typeof TEXTURE_DATA_URIS !== 'undefined' && TEXTURE_DATA_URIS[b64Key])
                ? TEXTURE_DATA_URIS[b64Key]
                : `textures/${b64Key}.jpg`;

            const texture = this.textureLoader.load(dataUri);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            this.loadedTextures[key] = texture;
        }
    }

    buildSolarSystem() {
        for (const [key, data] of Object.entries(SOLAR_DATA)) {
            if (key === 'Sun') {
                this.buildSun(data);
            } else {
                this.buildPlanet(data);
            }
        }
    }

    buildSun(data) {
        const geometry = new THREE.SphereGeometry(data.size, 64, 64);
        const sunTexture = this.loadedTextures['Sun'];

        const material = new THREE.MeshBasicMaterial({
            map: sunTexture
        });

        const sunMesh = new THREE.Mesh(geometry, material);

        // Sun Atmospheric Glow Mesh (Corona Effect)
        const glowGeometry = new THREE.SphereGeometry(data.size * 1.25, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.25,
            side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        sunMesh.add(glowMesh);

        this.scene.add(sunMesh);
        this.planetObjects['Sun'] = {
            mesh: sunMesh,
            data: data,
            angle: 0
        };
    }

    buildPlanet(data) {
        const pivot = new THREE.Group();
        this.scene.add(pivot);

        // Orbit Ring Visualizer
        if (data.distance > 0) {
            const orbitGeo = new THREE.RingGeometry(data.distance - 0.04, data.distance + 0.04, 128);
            const orbitMat = new THREE.MeshBasicMaterial({
                color: 0x4466aa,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.35
            });
            const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
            orbitMesh.rotation.x = Math.PI / 2;
            this.scene.add(orbitMesh);
            this.orbitLines.push(orbitMesh);
        }

        // Planet Mesh
        const geometry = new THREE.SphereGeometry(data.size, 48, 48);
        const planetTexture = this.loadedTextures[data.textureKey];

        const material = new THREE.MeshStandardMaterial({
            map: planetTexture,
            roughness: 0.5,
            metalness: 0.05
        });

        const planetMesh = new THREE.Mesh(geometry, material);
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;

        // Apply Axial Tilt
        if (data.name === 'Uranus') {
            planetMesh.rotation.z = Math.PI / 2;
        }

        // Saturn 3D Ring System
        if (data.hasRings) {
            this.addRingsToPlanet(planetMesh, data);
        }

        // Earth Cloud Layer
        if (data.name === 'Earth') {
            const cloudGeo = new THREE.SphereGeometry(data.size * 1.025, 32, 32);
            const cloudMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });
            const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
            planetMesh.add(cloudMesh);
            this.earthClouds = cloudMesh;
        }

        // Initial Position
        const initialAngle = Math.random() * Math.PI * 2;
        planetMesh.position.x = data.distance * Math.cos(initialAngle);
        planetMesh.position.z = data.distance * Math.sin(initialAngle);

        this.scene.add(planetMesh);

        // Build Moons
        const moonMeshes = [];
        if (data.moons && data.moons.length > 0) {
            data.moons.forEach(m => {
                const moonGeo = new THREE.SphereGeometry(m.size, 16, 16);
                const moonTexture = this.loadedTextures[m.textureKey] || this.loadedTextures['Moon'];
                const moonMat = new THREE.MeshStandardMaterial({
                    map: moonTexture,
                    roughness: 0.7
                });
                const moonMesh = new THREE.Mesh(moonGeo, moonMat);
                moonMesh.castShadow = true;
                moonMesh.receiveShadow = true;
                this.scene.add(moonMesh);

                moonMeshes.push({
                    mesh: moonMesh,
                    data: m,
                    angle: Math.random() * Math.PI * 2
                });
            });
        }

        this.planetObjects[data.name] = {
            mesh: planetMesh,
            pivot: pivot,
            data: data,
            angle: initialAngle,
            moons: moonMeshes
        };
    }

    addRingsToPlanet(planetMesh, data) {
        const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 64);
        
        const ringMat = new THREE.MeshStandardMaterial({
            color: data.name === 'Saturn' ? 0xe2bf7d : 0x7799bb,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            roughness: 0.5
        });

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + 0.2;
        planetMesh.add(ringMesh);
    }

    buildAsteroidBelt() {
        const count = 350;
        const geometry = new THREE.DodecahedronGeometry(0.06, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x888877, roughness: 0.9 });

        for (let i = 0; i < count; i++) {
            const asteroid = new THREE.Mesh(geometry, material);
            const distance = 20.5 + (Math.random() - 0.5) * 3.5;
            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * 1.2;

            asteroid.position.x = distance * Math.cos(angle);
            asteroid.position.y = elevation;
            asteroid.position.z = distance * Math.sin(angle);

            this.scene.add(asteroid);
            this.asteroidBelt.push({
                mesh: asteroid,
                distance: distance,
                angle: angle,
                speed: 0.001 + Math.random() * 0.001
            });
        }
    }

    /* Floating 3D HTML Labels projected into screen space */
    initLabels() {
        const container = document.getElementById('labels-container');
        if (!container) return;

        for (const [name, obj] of Object.entries(this.planetObjects)) {
            const el = document.createElement('div');
            el.className = 'planet-label';
            el.textContent = name.toUpperCase();
            el.addEventListener('click', () => this.selectPlanet(name));
            container.appendChild(el);
            this.labelElements[name] = el;
        }
    }

    updateLabels() {
        const camDist = this.camera.position.length();

        // 1. Planet Labels handling: Visible ONLY when zoomed in (camDist <= 180)
        if (!this.showLabels || camDist > 180) {
            Object.values(this.labelElements).forEach(el => el.style.display = 'none');
        } else {
            const tempVec = new THREE.Vector3();

            for (const [name, obj] of Object.entries(this.planetObjects)) {
                const el = this.labelElements[name];
                if (!el) continue;

                obj.mesh.getWorldPosition(tempVec);
                tempVec.y += obj.data.size + 0.6;
                tempVec.project(this.camera);

                if (tempVec.z > 1.0) {
                    el.style.display = 'none';
                    continue;
                }

                const x = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(tempVec.y * 0.5) + 0.5) * window.innerHeight;

                el.style.display = 'block';
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
            }
        }

        // 2. Spacecraft Labels handling
        if (!this.showSpacecraft || camDist > 180) {
            Object.values(this.spacecraftLabelElements).forEach(el => el.style.display = 'none');
        } else {
            const sVec = new THREE.Vector3();

            for (const [id, obj] of Object.entries(this.spacecraftObjects)) {
                const el = this.spacecraftLabelElements[id];
                if (!el) continue;

                obj.mesh.getWorldPosition(sVec);
                sVec.y += 0.4;
                sVec.project(this.camera);

                if (sVec.z > 1.0) {
                    el.style.display = 'none';
                    continue;
                }

                const x = (sVec.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(sVec.y * 0.5) + 0.5) * window.innerHeight;

                el.style.display = 'block';
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
            }
        }

        // 3. Deep Space Galaxy Labels handling: Visible ONLY when zoomed out far (camDist > 450)
        if (camDist <= 450) {
            Object.values(this.galaxyLabelElements).forEach(el => el.style.display = 'none');
        } else {
            const galVec = new THREE.Vector3();

            for (const [id, obj] of Object.entries(this.galaxyObjects)) {
                const el = this.galaxyLabelElements[id];
                if (!el) continue;

                galVec.copy(obj.data.pos);
                galVec.project(this.camera);

                if (galVec.z > 1.0) {
                    el.style.display = 'none';
                    continue;
                }

                const x = (galVec.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(galVec.y * 0.5) + 0.5) * window.innerHeight;

                el.style.display = 'block';
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
            }
        }
    }

    initInteractions() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener('resize', () => this.onWindowResize());

        this.canvas.addEventListener('click', (e) => this.onPointerClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.onPointerMove(e));
    }

    onPointerMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshes = Object.values(this.planetObjects).map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    onPointerClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshes = Object.values(this.planetObjects).map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            for (const [name, obj] of Object.entries(this.planetObjects)) {
                if (obj.mesh === clickedObject) {
                    this.selectPlanet(name);
                    break;
                }
            }
        }
    }

    selectPlanet(name) {
        const obj = this.planetObjects[name];
        if (!obj) return;

        this.followingPlanet = name;
        this.flyToPlanet(name);

        if (this.onPlanetSelectedCallback) {
            this.onPlanetSelectedCallback(obj.data);
        }
    }

    flyToPlanet(name, customDist = null) {
        const obj = this.planetObjects[name];
        if (!obj) return;

        this.followingPlanet = name;
        const targetPos = obj.mesh.position;
        const targetDist = customDist || Math.max(obj.data.size * 5, 4);

        const cameraEndPos = new THREE.Vector3(
            targetPos.x + targetDist * 1.2,
            targetPos.y + targetDist * 0.8,
            targetPos.z + targetDist * 1.2
        );

        if (typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, {
                x: cameraEndPos.x,
                y: cameraEndPos.y,
                z: cameraEndPos.z,
                duration: 1.5,
                ease: 'power2.out'
            });

            gsap.to(this.controls.target, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 1.5,
                ease: 'power2.out'
            });
        } else {
            this.camera.position.copy(cameraEndPos);
            this.controls.target.copy(targetPos);
        }
    }

    resetView() {
        this.followingPlanet = null;
        if (typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, { x: 0, y: 45, z: 80, duration: 1.5 });
            gsap.to(this.controls.target, { x: 0, y: 0, z: 0, duration: 1.5 });
        } else {
            this.camera.position.set(0, 45, 80);
            this.controls.target.set(0, 0, 0);
        }
    }

    setTopView() {
        this.followingPlanet = null;
        if (typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, { x: 0, y: 120, z: 0.1, duration: 1.5 });
            gsap.to(this.controls.target, { x: 0, y: 0, z: 0, duration: 1.5 });
        } else {
            this.camera.position.set(0, 120, 0.1);
            this.controls.target.set(0, 0, 0);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isPaused) {
            const deltaSpeed = this.simulationSpeed * (this.isReversed ? -1 : 1);

            // Rotate Starfield slowly
            if (this.starfield) {
                this.starfield.rotation.y += 0.0001;
            }

            // Animate Deep Space Galaxies & controlling visibility threshold
            if (this.galaxyGroup) {
                this.galaxyGroup.rotation.y += 0.00006;

                const camDist = this.camera.position.length();

                if (camDist < 220) {
                    this.galaxyGroup.visible = false;
                    this.galaxyMaterials.forEach(m => m.opacity = 0);
                } else {
                    this.galaxyGroup.visible = true;
                    const targetOpacity = THREE.MathUtils.clamp((camDist - 220) / 500, 0, 0.95);
                    this.galaxyMaterials.forEach(m => {
                        m.opacity = THREE.MathUtils.lerp(m.opacity, targetOpacity, 0.08);
                    });
                }
            }

            // Animate Earth Clouds
            if (this.earthClouds) {
                this.earthClouds.rotation.y += 0.001;
            }

            // Update Planets
            for (const [name, obj] of Object.entries(this.planetObjects)) {
                // Self Spin
                obj.mesh.rotation.y += (obj.data.rotationSpeed || 0.002) * deltaSpeed;

                // Orbit around Sun
                if (obj.data.distance > 0) {
                    obj.angle += (obj.data.speed || 0.001) * deltaSpeed;
                    obj.mesh.position.x = obj.data.distance * Math.cos(obj.angle);
                    obj.mesh.position.z = obj.data.distance * Math.sin(obj.angle);
                }

                // Update Moons
                if (obj.moons) {
                    obj.moons.forEach(m => {
                        m.angle += (m.data.speed || 0.01) * deltaSpeed;
                        m.mesh.position.x = obj.mesh.position.x + m.data.distance * Math.cos(m.angle);
                        m.mesh.position.z = obj.mesh.position.z + m.data.distance * Math.sin(m.angle);
                    });
                }
            }

            // Update Spacecraft Positions around their parent Planet or Moon
            if (this.showSpacecraft) {
                for (const [id, craft] of Object.entries(this.spacecraftObjects)) {
                    const parentMesh = craft.data.parent ? this.getCelestialMesh(craft.data.parent) : null;
                    if (parentMesh) {
                        craft.angle += craft.data.speed * deltaSpeed;
                        craft.mesh.position.x = parentMesh.position.x + craft.data.offset.x * Math.cos(craft.angle);
                        craft.mesh.position.y = parentMesh.position.y + craft.data.offset.y;
                        craft.mesh.position.z = parentMesh.position.z + craft.data.offset.z * Math.sin(craft.angle);
                    } else {
                        craft.mesh.position.set(craft.data.offset.x, craft.data.offset.y, craft.data.offset.z);
                    }
                    craft.mesh.visible = true;
                }
            } else {
                Object.values(this.spacecraftObjects).forEach(c => c.mesh.visible = false);
            }

            // Update Asteroid Belt
            this.asteroidBelt.forEach(ast => {
                ast.angle += ast.speed * deltaSpeed;
                ast.mesh.position.x = ast.distance * Math.cos(ast.angle);
                ast.mesh.position.z = ast.distance * Math.sin(ast.angle);
            });

            // Camera Following Selected Planet
            if (this.followingPlanet && this.planetObjects[this.followingPlanet]) {
                const targetMesh = this.planetObjects[this.followingPlanet].mesh;
                this.controls.target.copy(targetMesh.position);
            }
        }

        this.updateLabels();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    toggleOrbits(visible) {
        this.showOrbits = visible;
        this.orbitLines.forEach(l => l.visible = visible);
    }

    toggleSpacecraft(visible) {
        this.showSpacecraft = visible;
    }
}
