/**
 * Ancient Nexus - Canvas Ambient Background FX
 * Generates floating ancient runes, rising glowing embers, and dynamic fog of war.
 */

export class CanvasBackground {
  constructor(canvasId = 'canvas-bg') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.runes = ['ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᛃ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛞ', 'ᛟ'];
    this.mode = 'embers'; // 'embers', 'fog', 'runes', 'minimal'
    this.accentColor = { r: 245, g: 158, b: 11 };
    this.animationId = null;
    this.numParticles = 50;

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.initParticles();
    this.start();
  }

  setMode(mode) {
    this.mode = mode;
    this.initParticles();
  }

  setThemeColor(r, g, b) {
    this.accentColor = { r, g, b };
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    if (this.mode === 'minimal') return;

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        isRune: this.mode === 'runes' && Math.random() > 0.4,
        runeChar: this.runes[Math.floor(Math.random() * this.runes.length)]
      });
    }
  }

  start() {
    if (!this.animationId) {
      this.loop();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  loop() {
    this.animationId = requestAnimationFrame(this.loop);
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.mode === 'minimal') return;

    const { r, g, b } = this.accentColor;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      // Wrap around
      if (p.y < -20) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;

      const currentAlpha = Math.max(0.05, Math.min(0.7, p.alpha));

      if (p.isRune) {
        this.ctx.font = `${Math.floor(p.size * 5 + 10)}px 'Cinzel', serif`;
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.5})`;
        this.ctx.fillText(p.runeChar, p.x, p.y);
      } else {
        // Glowing ember
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
        this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        this.ctx.shadowBlur = p.size * 3;
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // reset
      }
    }
  }
}
