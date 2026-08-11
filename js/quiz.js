/* ==========================================================================
   SOLAR SYSTEM EXPLORER - GAMIFIED QUIZ ENGINE & CONFETTI
   ========================================================================== */

class QuizEngine {
    constructor() {
        this.questions = [...QUIZ_QUESTIONS];
        this.shuffleArray(this.questions);
        this.questions = this.questions.slice(0, 8); // 8 random questions per round

        this.currentIdx = 0;
        this.score = 0;
        this.streak = 0;
        this.timer = null;
        this.timeLeft = 15;
        this.isAnswering = false;

        this.initDOM();
        this.initAudio();
        this.initKeyBindings();
        this.loadQuestion();
    }

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    initDOM() {
        this.qNumText = document.getElementById('q-num-text');
        this.scoreText = document.getElementById('score-text');
        this.streakText = document.getElementById('streak-text');
        this.questionText = document.getElementById('question-text');
        this.optionsGrid = document.getElementById('options-grid');
        this.timerFill = document.getElementById('timer-bar-fill');
        this.timerSecText = document.getElementById('timer-sec-text');

        this.quizBoard = document.getElementById('quiz-board');
        this.resultBoard = document.getElementById('result-board');
        this.finalScoreText = document.getElementById('final-score-text');
        this.highScoreText = document.getElementById('high-score-text');
        this.btnRestart = document.getElementById('btn-restart-quiz');
    }

    initAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        } catch (e) {}
    }

    initKeyBindings() {
        window.addEventListener('keydown', (e) => {
            if (this.isAnswering || this.currentIdx >= this.questions.length) return;
            const key = e.key.toUpperCase();
            let optIndex = -1;

            if (key === 'A' || key === '1') optIndex = 0;
            if (key === 'B' || key === '2') optIndex = 1;
            if (key === 'C' || key === '3') optIndex = 2;
            if (key === 'D' || key === '4') optIndex = 3;

            if (optIndex >= 0) {
                const btns = this.optionsGrid.querySelectorAll('.option-btn');
                if (btns[optIndex]) {
                    this.handleAnswer(optIndex, btns[optIndex]);
                }
            }
        });
    }

    playSfx(type) {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            if (type === 'correct') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
                osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.1); // E5
                gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.3);
            } else if (type === 'wrong') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
                osc.frequency.setValueAtTime(164.81, this.audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.3);
            }
        } catch (e) {}
    }

    loadQuestion() {
        if (this.currentIdx >= this.questions.length) {
            this.showResults();
            return;
        }

        this.isAnswering = false;
        const qData = this.questions[this.currentIdx];

        if (this.qNumText) this.qNumText.textContent = `Question ${this.currentIdx + 1} / ${this.questions.length}`;
        if (this.scoreText) this.scoreText.textContent = `${this.score}`;
        if (this.streakText) this.streakText.textContent = `${this.streak} 🔥`;
        if (this.questionText) this.questionText.textContent = qData.q;

        this.optionsGrid.innerHTML = '';
        qData.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="opt-prefix">${String.fromCharCode(65 + index)}</span> ${optText}`;
            btn.addEventListener('click', () => this.handleAnswer(index, btn));
            this.optionsGrid.appendChild(btn);
        });

        this.startTimer();
    }

    startTimer() {
        clearInterval(this.timer);
        this.timeLeft = 15;
        if (this.timerFill) this.timerFill.style.width = '100%';
        if (this.timerSecText) this.timerSecText.textContent = '15s';

        this.timer = setInterval(() => {
            this.timeLeft -= 0.1;
            const pct = Math.max(0, (this.timeLeft / 15) * 100);
            if (this.timerFill) this.timerFill.style.width = `${pct}%`;
            if (this.timerSecText) this.timerSecText.textContent = `${Math.ceil(Math.max(0, this.timeLeft))}s`;

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeout();
            }
        }, 100);
    }

    handleAnswer(selectedIndex, clickedBtn) {
        if (this.isAnswering) return;
        this.isAnswering = true;
        clearInterval(this.timer);

        const qData = this.questions[this.currentIdx];
        const allBtns = this.optionsGrid.querySelectorAll('.option-btn');

        if (selectedIndex === qData.correct) {
            clickedBtn.classList.add('correct');
            this.streak++;
            const pointsGained = 100 + (this.streak * 20) + Math.round(this.timeLeft * 10);
            this.score += pointsGained;
            if (this.scoreText) this.scoreText.textContent = `${this.score}`;
            if (this.streakText) this.streakText.textContent = `${this.streak} 🔥`;
            this.playSfx('correct');
        } else {
            clickedBtn.classList.add('wrong');
            if (allBtns[qData.correct]) {
                allBtns[qData.correct].classList.add('correct');
            }
            this.streak = 0;
            if (this.streakText) this.streakText.textContent = `0 🔥`;
            this.playSfx('wrong');
        }

        setTimeout(() => {
            this.currentIdx++;
            this.loadQuestion();
        }, 1300);
    }

    handleTimeout() {
        if (this.isAnswering) return;
        this.isAnswering = true;

        const qData = this.questions[this.currentIdx];
        const allBtns = this.optionsGrid.querySelectorAll('.option-btn');
        if (allBtns[qData.correct]) {
            allBtns[qData.correct].classList.add('correct');
        }
        this.streak = 0;
        if (this.streakText) this.streakText.textContent = `0 🔥`;
        this.playSfx('wrong');

        setTimeout(() => {
            this.currentIdx++;
            this.loadQuestion();
        }, 1300);
    }

    showResults() {
        this.quizBoard.style.display = 'none';
        this.resultBoard.style.display = 'block';

        const high = parseInt(localStorage.getItem('solar_quiz_highscore') || '0', 10);
        if (this.score > high) {
            localStorage.setItem('solar_quiz_highscore', this.score.toString());
            this.highScoreText.textContent = `New Record! High Score: ${this.score} 🎉`;
        } else {
            this.highScoreText.textContent = `Best Score: ${high}`;
        }

        this.finalScoreText.textContent = `${this.score} Pts`;

        // Launch Confetti
        this.triggerConfetti();

        if (this.btnRestart) {
            this.btnRestart.addEventListener('click', () => location.reload());
        }
    }

    triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#00f0ff', '#3a86ff', '#8338ec', '#ffb703', '#06d6a0', '#ff0055'];

        for (let i = 0; i < 160; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 4 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360
            });
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += 2;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (particles.some(p => p.y < canvas.height)) {
                requestAnimationFrame(render);
            }
        }
        render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-board')) {
        new QuizEngine();
    }
});
