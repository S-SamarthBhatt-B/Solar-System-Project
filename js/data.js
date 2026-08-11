/* ==========================================================================
   SOLAR SYSTEM EXPLORER - ASTRONOMICAL DATA & QUIZ DATASET
   ========================================================================== */

const SOLAR_DATA = {
    Sun: {
        name: 'Sun',
        type: 'Yellow Dwarf Star',
        size: 3.2,
        distance: 0,
        speed: 0,
        rotationSpeed: 0.001,
        color: 0xffaa00,
        textureKey: 'Sun',
        info: {
            diameter: '1,392,700 km',
            distanceFromSun: '0 km (Center)',
            position: 'Center of Solar System',
            mass: '1.989 × 10³⁰ kg (99.86% of system)',
            gravity: '274 m/s² (28x Earth)',
            temperature: '5,500°C (Surface) / 15M°C (Core)',
            environment: 'Plasma, Magnetic Fields, Hydrogen & Helium',
            minerals: 'Hydrogen (73%), Helium (25%)',
            orbitalPeriod: 'N/A',
            rotationPeriod: '25-35 Earth Days',
            moonsCount: '8 Planets'
        },
        description: 'The Sun is the yellow dwarf star at the heart of our Solar System. Its massive gravity holds the system together, powering life on Earth through nuclear fusion.',
        funFact: 'Over one million Earths could fit inside the Sun!',
        history: 'Monitored continuously by missions like NASA\'s SOHO, Solar Dynamics Observatory (SDO), and Parker Solar Probe.'
    },

    Mercury: {
        name: 'Mercury',
        type: 'Terrestrial Planet',
        size: 0.38,
        distance: 7,
        speed: 0.024,
        rotationSpeed: 0.002,
        color: 0xa9a9a9,
        textureKey: 'Mercury',
        info: {
            diameter: '4,879 km',
            distanceFromSun: '57.9 million km',
            position: '1st Planet from Sun',
            mass: '3.301 × 10²³ kg',
            gravity: '3.7 m/s²',
            temperature: '-180°C to 430°C',
            environment: 'Extremely thin exosphere (Oxygen, Sodium)',
            minerals: 'Iron, Silicates, Metallic core',
            orbitalPeriod: '88 Earth Days',
            rotationPeriod: '59 Earth Days',
            moonsCount: '0'
        },
        description: 'Mercury is the smallest planet in our solar system and closest to the Sun. Despite being closest, it is not the hottest planet because it lacks an atmosphere to trap heat.',
        funFact: 'Mercury has cratered ice pockets at its poles that never see sunlight!',
        history: 'Explored by Mariner 10, MESSENGER spacecraft, and currently BepiColombo.'
    },

    Venus: {
        name: 'Venus',
        type: 'Terrestrial Planet',
        size: 0.65,
        distance: 10,
        speed: 0.018,
        rotationSpeed: -0.001, // Retrograde spin
        color: 0xe3bb76,
        textureKey: 'Venus',
        info: {
            diameter: '12,104 km',
            distanceFromSun: '108.2 million km',
            position: '2nd Planet from Sun',
            mass: '4.867 × 10²⁴ kg',
            gravity: '8.87 m/s²',
            temperature: '465°C (Hottest Planet)',
            environment: 'Crushing CO₂ atmosphere with Sulfuric Acid clouds',
            minerals: 'Basaltic rocks, Volcanic plains',
            orbitalPeriod: '225 Earth Days',
            rotationPeriod: '243 Earth Days (Retrograde)',
            moonsCount: '0'
        },
        description: 'Often called Earth\'s twin due to size, Venus is a runaway greenhouse inferno with atmospheric pressure 92 times greater than Earth\'s sea level.',
        funFact: 'Venus rotates backwards compared to most planets, and a day on Venus is longer than its year!',
        history: 'Venera missions landed on surface; Magellan mapped its volcano-covered crust with radar.'
    },

    Earth: {
        name: 'Earth',
        type: 'Terrestrial Planet',
        size: 0.72,
        distance: 14,
        speed: 0.012,
        rotationSpeed: 0.005,
        color: 0x2233ff,
        textureKey: 'Earth',
        moons: [
            { name: 'Moon', size: 0.22, distance: 1.5, speed: 0.04, textureKey: 'Moon', color: 0xcccccc }
        ],
        info: {
            diameter: '12,742 km',
            distanceFromSun: '149.6 million km (1 AU)',
            position: '3rd Planet from Sun',
            mass: '5.972 × 10²⁴ kg',
            gravity: '9.81 m/s²',
            temperature: '-89°C to 58°C (Average 15°C)',
            environment: '78% Nitrogen, 21% Oxygen, Liquid Water Oceans',
            minerals: 'Silicates, Iron, Magnesium, Water',
            orbitalPeriod: '365.25 Days',
            rotationPeriod: '24 Hours',
            moonsCount: '1 (The Moon)'
        },
        description: 'Earth is our home planet and the only world known so far to harbor life, featuring liquid water oceans and a protective magnetic field.',
        funFact: '71% of Earth\'s surface is covered by liquid water!',
        history: 'Studied continuously by thousands of satellites, ISS, and human observation.'
    },

    Mars: {
        name: 'Mars',
        type: 'Terrestrial Planet',
        size: 0.52,
        distance: 18,
        speed: 0.009,
        rotationSpeed: 0.0048,
        color: 0xc1440e,
        textureKey: 'Mars',
        moons: [
            { name: 'Phobos', size: 0.08, distance: 0.9, speed: 0.08, color: 0x888888 },
            { name: 'Deimos', size: 0.06, distance: 1.3, speed: 0.05, color: 0x666666 }
        ],
        info: {
            diameter: '6,779 km',
            distanceFromSun: '227.9 million km',
            position: '4th Planet from Sun',
            mass: '6.417 × 10²³ kg',
            gravity: '3.72 m/s²',
            temperature: '-125°C to 20°C (Average -62°C)',
            environment: 'Thin CO₂ atmosphere, Dust storms',
            minerals: 'Iron Oxide (Rust), Basalt, Water Ice',
            orbitalPeriod: '687 Earth Days',
            rotationPeriod: '24.6 Hours',
            moonsCount: '2 (Phobos & Deimos)'
        },
        description: 'The Red Planet is a cold, desert world coated in iron oxide dust. It features the solar system\'s highest mountain, Olympus Mons.',
        funFact: 'Olympus Mons on Mars is 3 times taller than Mount Everest!',
        history: 'Explored by Curiosity, Perseverance rover, Ingenuity helicopter, and orbiters.'
    },

    Jupiter: {
        name: 'Jupiter',
        type: 'Gas Giant',
        size: 1.8,
        distance: 24,
        speed: 0.005,
        rotationSpeed: 0.012,
        color: 0xb07f35,
        textureKey: 'Jupiter',
        moons: [
            { name: 'Io', size: 0.12, distance: 2.6, speed: 0.06, color: 0xffcc00 },
            { name: 'Europa', size: 0.11, distance: 3.2, speed: 0.045, color: 0xddddff },
            { name: 'Ganymede', size: 0.16, distance: 3.9, speed: 0.03, color: 0x999999 },
            { name: 'Callisto', size: 0.14, distance: 4.6, speed: 0.02, color: 0x666677 }
        ],
        info: {
            diameter: '139,820 km',
            distanceFromSun: '778.5 million km',
            position: '5th Planet from Sun',
            mass: '1.898 × 10²⁷ kg (2.5x all other planets combined)',
            gravity: '24.79 m/s²',
            temperature: '-110°C (Cloud tops)',
            environment: 'Hydrogen & Helium Gas Giant',
            minerals: 'Metallic Hydrogen core, Ammonia ice clouds',
            orbitalPeriod: '11.86 Earth Years',
            rotationPeriod: '9.9 Hours (Fastest spin)',
            moonsCount: '95 confirmed moons'
        },
        description: 'Jupiter is the largest planet in our solar system. Its iconic Great Red Spot is a giant anticyclonic storm bigger than Earth that has raged for centuries.',
        funFact: 'Jupiter\'s magnetic field is 20,000 times stronger than Earth\'s!',
        history: 'Explored by Pioneer, Voyager, Galileo, Juno, and Europa Clipper.'
    },

    Saturn: {
        name: 'Saturn',
        type: 'Gas Giant',
        size: 1.45,
        distance: 31,
        speed: 0.0035,
        rotationSpeed: 0.011,
        color: 0xe2bf7d,
        textureKey: 'Saturn',
        hasRings: true,
        ringInner: 1.8,
        ringOuter: 3.2,
        moons: [
            { name: 'Titan', size: 0.18, distance: 3.8, speed: 0.035, color: 0xe3a857 },
            { name: 'Enceladus', size: 0.08, distance: 2.6, speed: 0.05, color: 0xffffff }
        ],
        info: {
            diameter: '116,460 km',
            distanceFromSun: '1.43 billion km',
            position: '6th Planet from Sun',
            mass: '5.683 × 10²⁶ kg',
            gravity: '10.44 m/s²',
            temperature: '-140°C',
            environment: 'Hydrogen & Helium atmosphere, Icy ring system',
            minerals: 'Water ice, Rock particles, Liquid Hydrogen',
            orbitalPeriod: '29.45 Earth Years',
            rotationPeriod: '10.7 Hours',
            moonsCount: '146 confirmed moons'
        },
        description: 'Saturn is famous for its magnificent ring system made of billions of chunks of water ice and rock, ranging from tiny dust grains to mountain-sized blocks.',
        funFact: 'Saturn is less dense than water — if you had a bathtub big enough, it would float!',
        history: 'Cassini-Huygens orbited Saturn for 13 years and deployed the Huygens probe to Titan.'
    },

    Uranus: {
        name: 'Uranus',
        type: 'Ice Giant',
        size: 1.1,
        distance: 38,
        speed: 0.002,
        rotationSpeed: -0.007,
        color: 0x4b70dd,
        textureKey: 'Uranus',
        hasRings: true,
        ringInner: 1.4,
        ringOuter: 1.9,
        moons: [
            { name: 'Titania', size: 0.1, distance: 2.2, speed: 0.04, color: 0xaaaaaa },
            { name: 'Oberon', size: 0.09, distance: 2.8, speed: 0.03, color: 0x888888 }
        ],
        info: {
            diameter: '50,724 km',
            distanceFromSun: '2.87 billion km',
            position: '7th Planet from Sun',
            mass: '8.681 × 10²⁵ kg',
            gravity: '8.69 m/s²',
            temperature: '-224°C (Coldest atmospheric temp)',
            environment: 'Hydrogen, Helium, and Methane Ice Giant',
            minerals: 'Water, Ammonia, and Methane ices',
            orbitalPeriod: '84 Earth Years',
            rotationPeriod: '17.2 Hours (Tilted 98° on its side)',
            moonsCount: '28 confirmed moons'
        },
        description: 'Uranus is an icy world that rotates at a extreme 98-degree tilt, effectively orbiting the Sun on its side, likely caused by an ancient collision.',
        funFact: 'Because of its tilt, a pole on Uranus experiences 42 years of continuous sunlight followed by 42 years of darkness!',
        history: 'Discovered in 1781 by William Herschel; visited by Voyager 2 in 1986.'
    },

    Neptune: {
        name: 'Neptune',
        type: 'Ice Giant',
        size: 1.05,
        distance: 44,
        speed: 0.0012,
        rotationSpeed: 0.008,
        color: 0x274687,
        textureKey: 'Neptune',
        moons: [
            { name: 'Triton', size: 0.13, distance: 2.4, speed: -0.04, color: 0xcccccc } // Retrograde moon
        ],
        info: {
            diameter: '49,244 km',
            distanceFromSun: '4.5 billion km',
            position: '8th Planet from Sun',
            mass: '1.024 × 10²⁶ kg',
            gravity: '11.15 m/s²',
            temperature: '-201°C',
            environment: 'Supersonic winds (up to 2,100 km/h), Methane atmosphere',
            minerals: 'Ices of Water, Ammonia, Methane',
            orbitalPeriod: '164.8 Earth Years',
            rotationPeriod: '16.1 Hours',
            moonsCount: '16 confirmed moons'
        },
        description: 'Neptune is the most distant major planet in our solar system. Dark, cold, and whipped by supersonic winds, it was the first planet located via mathematical prediction.',
        funFact: 'Winds on Neptune reach over 2,000 km/h — the fastest recorded in the Solar System!',
        history: 'Visited by Voyager 2 in 1989; continuously monitored by Hubble Space Telescope.'
    }
};

/* Guided Tour Data Steps */
const TOUR_STEPS = [
    {
        planet: 'Sun',
        distance: 12,
        title: '☀️ 1. The Sun - Core of the System',
        text: 'Our journey begins at the Sun, a yellow dwarf star containing 99.8% of all mass in the Solar System. Nuclear fusion in its core creates light and energy for all planets.'
    },
    {
        planet: 'Mercury',
        distance: 5,
        title: '☿ 2. Mercury - The Cratered Furnace',
        text: 'Mercury is closest to the Sun. With almost no atmosphere to trap heat, temperatures range wildly from 430°C in sunlight down to -180°C at night.'
    },
    {
        planet: 'Venus',
        distance: 6,
        title: '♀ 3. Venus - Earth\'s Toxic Twin',
        text: 'Venus is the hottest planet in the Solar System. Thick carbon dioxide atmosphere creates a runaway greenhouse effect, with pressures 92 times greater than Earth.'
    },
    {
        planet: 'Earth',
        distance: 6,
        title: '🌍 4. Earth - The Oasis of Life',
        text: 'Earth is our sanctuary. Liquid oceans, protective magnetosphere, and nitrogen-oxygen atmosphere make it the only world known to harbor living organisms.'
    },
    {
        planet: 'Mars',
        distance: 6,
        title: '♂ 5. Mars - The Red Frontier',
        text: 'Mars gets its red hue from iron oxide (rust). Home to ancient river valleys and Olympus Mons, the largest volcano in the Solar System.'
    },
    {
        planet: 'Jupiter',
        distance: 10,
        title: '♃ 6. Jupiter - The King of Planets',
        text: 'Jupiter is a massive gas giant over 1,300 times Earth\'s volume. Its iconic Great Red Spot is a mega-storm that has raged for centuries.'
    },
    {
        planet: 'Saturn',
        distance: 11,
        title: '♄ 7. Saturn - Jewel of the Solar System',
        text: 'Saturn is encircled by magnificent rings made of billions of icy particles. It is so low in density that it would float in water!'
    },
    {
        planet: 'Uranus',
        distance: 9,
        title: '♅ 8. Uranus - The Tilted Ice Giant',
        text: 'Uranus rotates sideways at a 98-degree angle! Its pale cyan color comes from atmospheric methane absorbing red light.'
    },
    {
        planet: 'Neptune',
        distance: 9,
        title: '♆ 9. Neptune - Winds of the Deep',
        text: 'Neptune is the most distant major planet. supersonic winds rip through its methane atmosphere at over 2,000 kilometers per hour.'
    }
];

/* Quiz Question Pool */
const QUIZ_QUESTIONS = [
    {
        q: "Which planet is known as the hottest planet in the Solar System?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correct: 1,
        explanation: "Venus is the hottest planet due to its dense carbon dioxide atmosphere trapping extreme heat (465°C)."
    },
    {
        q: "What is the largest planet in our Solar System?",
        options: ["Saturn", "Neptune", "Jupiter", "Uranus"],
        correct: 2,
        explanation: "Jupiter is the largest planet, with a mass more than double all other planets combined."
    },
    {
        q: "Which planet has the tallest volcano (Olympus Mons)?",
        options: ["Venus", "Earth", "Mars", "Mercury"],
        correct: 2,
        explanation: "Olympus Mons on Mars is three times taller than Mount Everest."
    },
    {
        q: "What causes Uranus to orbit on its side at a 98-degree tilt?",
        options: ["Strong solar magnetic forces", "Ancient mega-collision with a protoplanet", "Fast rotational speed", "Gravitational pull from Neptune"],
        correct: 1,
        explanation: "Scientists believe an ancient collision with an Earth-sized object knocked Uranus onto its side."
    },
    {
        q: "Which moon is the only one in the solar system known to have a dense atmosphere?",
        options: ["Europa (Jupiter)", "Titan (Saturn)", "Ganymede (Jupiter)", "Triton (Neptune)"],
        correct: 1,
        explanation: "Titan (Saturn's moon) has a thick nitrogen atmosphere with methane lakes."
    },
    {
        q: "What component gives Mars its signature reddish appearance?",
        options: ["Copper oxide", "Sulfuric acid", "Iron oxide (rust)", "Methane frost"],
        correct: 2,
        explanation: "Iron oxide dust covering Mars' surface gives it a rusty red color."
    },
    {
        q: "Which planet has the fastest winds recorded in the Solar System?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 3,
        explanation: "Neptune experiences supersonic winds exceeding 2,000 km/h."
    },
    {
        q: "Where is the Asteroid Belt located?",
        options: ["Between Earth and Mars", "Between Mars and Jupiter", "Beyond Neptune", "Inside Mercury's orbit"],
        correct: 1,
        explanation: "The main Asteroid Belt orbits in the gap between Mars and Jupiter."
    },
    {
        q: "How old is our Solar System approximately?",
        options: ["2.1 Billion Years", "4.6 Billion Years", "10 Billion Years", "13.8 Billion Years"],
        correct: 1,
        explanation: "Radiometric dating of meteorites reveals our Solar System formed about 4.6 billion years ago."
    },
    {
        q: "Which planet would theoretically float if placed in a giant bathtub of water?",
        options: ["Uranus", "Saturn", "Neptune", "Mercury"],
        correct: 1,
        explanation: "Saturn's average density is 0.69 g/cm³, less than liquid water (1.0 g/cm³)."
    }
];

/* ==========================================================================
   SPACECRAFT & SATELLITE MISSIONS DATASET (FEATURED ISRO & GLOBAL MISSIONS)
   ========================================================================== */
const SPACECRAFT_DATA = {
    chandrayaan3: {
        id: 'chandrayaan3',
        agency: 'ISRO (India)',
        name: 'Chandrayaan-3',
        type: 'Lunar Lander & Rover Mission',
        launched: '14 July 2023',
        rocket: 'LVM3-M4',
        landingDate: '23 August 2023',
        site: 'Lunar South Pole (Shiv Shakti Point)',
        parent: 'Moon',
        offset: { x: 0.45, y: 0.15, z: 0.2 },
        speed: 0.015,
        color: 0xff9933, // ISRO Saffron
        achievements: 'India became the FIRST country to land near the Moon\'s South Pole and the 4th nation to achieve a soft lunar landing. Deployed Vikram Lander and Pragyan Rover, discovering elemental Sulfur in the lunar polar regolith.',
        description: 'Chandrayaan-3 is ISRO\'s historic lunar exploration mission that successfully soft-landed at 69.37°S, 32.35°E near the Moon\'s South Pole.'
    },
    mangalyaan: {
        id: 'mangalyaan',
        name: 'Mangalyaan (Mars Orbiter Mission / MOM)',
        agency: 'ISRO (India)',
        type: 'Mars Interplanetary Orbiter',
        launched: '5 November 2013',
        rocket: 'PSLV-C25',
        landingDate: '24 September 2014 (Mars Orbit Insertion)',
        site: 'Elliptical Mars Orbit',
        parent: 'Mars',
        offset: { x: 2.2, y: 0.4, z: 1.1 },
        speed: 0.007,
        color: 0xff9933,
        achievements: 'India became the FIRST nation in the world to reach Mars orbit on its VERY FIRST attempt, and the first Asian country to reach Mars. Built at an incredible record-low cost of ~$74 million.',
        description: 'Mangalyaan (MOM) spent 7+ years exploring the Martian atmosphere, surface topography, and methane levels using 5 indigenous payloads.'
    },
    adityal1: {
        id: 'adityal1',
        name: 'Aditya-L1',
        agency: 'ISRO (India)',
        type: 'Solar Observatory Satellite',
        launched: '2 September 2023',
        rocket: 'PSLV-C57',
        landingDate: '6 January 2024 (Halo Orbit L1)',
        site: 'Sun-Earth L1 Lagrange Point (1.5M km from Earth)',
        parent: 'Earth',
        offset: { x: 2.4, y: 0.3, z: 1.5 },
        speed: 0.005,
        color: 0xffb703,
        achievements: 'India\'s first dedicated solar space observatory stationed in halo orbit around Sun-Earth L1. Observes the solar corona, solar wind flares, and Coronal Mass Ejections (CMEs).',
        description: 'Aditya-L1 continuously monitors Sun dynamics without any occultation or eclipses, sending high-resolution solar imagery back to ISRO.'
    },
    chandrayaan1: {
        id: 'chandrayaan1',
        name: 'Chandrayaan-1',
        agency: 'ISRO (India)',
        type: 'Lunar Orbiter & Impact Probe',
        launched: '22 October 2008',
        rocket: 'PSLV-C11',
        landingDate: '14 November 2008 (Moon Impact Probe)',
        site: 'Lunar Orbit & Shackleton Crater',
        parent: 'Moon',
        offset: { x: 0.55, y: -0.2, z: 0.35 },
        speed: 0.012,
        color: 0xff9933,
        achievements: 'DISCOVERED WATER MOLECULES (H2O & OH) on the Moon using ISRO\'s Moon Impact Probe (MIP) and NASA\'s M3 payload—a groundbreaking discovery in lunar science history.',
        description: 'India\'s inaugural deep-space mission to the Moon that confirmed widespread water ice trapped inside permanently shadowed lunar craters.'
    },
    astrosat: {
        id: 'astrosat',
        name: 'ASTROSAT',
        agency: 'ISRO (India)',
        type: 'Space Astronomy Observatory',
        launched: '28 September 2015',
        rocket: 'PSLV-C30',
        landingDate: 'Low Earth Orbit (650 km)',
        site: 'Earth Orbit',
        parent: 'Earth',
        offset: { x: 1.1, y: 0.25, z: 0.4 },
        speed: 0.018,
        color: 0x3a86ff,
        achievements: 'India\'s first dedicated multi-wavelength space telescope observing the universe simultaneously in Ultraviolet, Optical, and X-ray spectral bands.',
        description: 'ASTROSAT studies black holes, neutron stars, active galactic nuclei, and star formation regions in distant galaxies.'
    },
    gaganyaan: {
        id: 'gaganyaan',
        name: 'Gaganyaan (Crew Module Test Vehicle)',
        agency: 'ISRO (India)',
        type: 'Human Spaceflight Mission',
        launched: 'TV-D1 Oct 2023 / Orbital Test 2024-2025',
        rocket: 'LVM3 (Human Rated)',
        landingDate: 'Targeted Crew Orbit',
        site: '400 km Low Earth Orbit',
        parent: 'Earth',
        offset: { x: 0.85, y: 0.08, z: 0.15 },
        speed: 0.022,
        color: 0x10b981,
        achievements: 'India\'s premier Human Spaceflight Programme designed to carry 3 Indian Astronauts (Gaganauts) into a 400 km Earth orbit for 3 days.',
        description: 'Gaganyaan will establish India as the 4th country capable of launching indigenous human spaceflights after Russia, USA, and China.'
    },
    voyager1: {
        id: 'voyager1',
        name: 'Voyager 1',
        agency: 'NASA (USA)',
        type: 'Interstellar Space Probe',
        launched: '5 September 1977',
        rocket: 'Titan IIIE',
        landingDate: 'Entered Interstellar Space Aug 2012',
        site: '24+ Billion km (Interstellar Medium)',
        parent: null,
        offset: { x: 55, y: 15, z: -45 },
        speed: 0.0003,
        color: 0x00f0ff,
        achievements: 'Farthest human-made object from Earth. Flew past Jupiter and Saturn, carrying the Golden Record message for extraterrestrial intelligence.',
        description: 'Voyager 1 continues transmitting scientific instruments data from deep interstellar space beyond our Sun\'s heliosphere.'
    },
    jwst: {
        id: 'jwst',
        name: 'James Webb Space Telescope (JWST)',
        agency: 'NASA / ESA / CSA',
        type: 'Infrared Space Telescope',
        launched: '25 December 2021',
        rocket: 'Ariane 5',
        landingDate: 'January 2022 (Halo L2)',
        site: 'Sun-Earth L2 Lagrange Point',
        parent: 'Earth',
        offset: { x: 1.8, y: 0.4, z: 0.8 },
        speed: 0.008,
        color: 0xffb703,
        achievements: 'Unprecedented infrared sensitivity revealing the earliest galaxies formed 13.5 billion years ago and analyzing exoplanet atmospheric spectra.',
        description: 'JWST features a 6.5-meter beryllium gold-coated primary mirror and a 5-layer tennis-court-sized sunshield.'
    },
    iss: {
        id: 'iss',
        name: 'International Space Station (ISS)',
        agency: 'NASA / Roscosmos / ESA / JAXA / CSA',
        type: 'Habitable Orbital Space Station',
        launched: '20 November 1998',
        rocket: 'Proton-K / Space Shuttle',
        landingDate: 'Continuous Human Occupancy since 2000',
        site: '408 km Low Earth Orbit',
        parent: 'Earth',
        offset: { x: 0.95, y: 0.1, z: 0.2 },
        speed: 0.02,
        color: 0x3a86ff,
        achievements: 'Largest artificial body in space, serving as an international microgravity research laboratory for over 23 years continuously.',
        description: 'The ISS orbits Earth every 90 minutes at 28,000 km/h, hosting science experiments in biology, physics, and astronomy.'
    }
};




