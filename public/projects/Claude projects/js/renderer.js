// renderer.js — Canvas 2D visualization of wind turbine
// Draws a side-view of the turbine with animated blades,
// wind direction indicator, and wind particles

class TurbineRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this._initParticles(80);
        this._resize();
        window.addEventListener('resize', () => this._resize());
    }

    _resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.scale = Math.min(this.canvas.width / 500, this.canvas.height / 450);
        // Turbine base position
        this.baseX = this.canvas.width * 0.5;
        this.baseY = this.canvas.height * 0.88;
    }

    // Initialize wind particles for visual effect
    _initParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random(),
                y: Math.random() * 0.7 + 0.05,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.3 + 0.7,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    // Main render call
    render(turbineState, windState) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const s = this.scale;

        ctx.clearRect(0, 0, w, h);

        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#1a2a4a');
        skyGrad.addColorStop(0.5, '#2d4a7a');
        skyGrad.addColorStop(0.85, '#4a7ab5');
        skyGrad.addColorStop(1, '#6aaa6a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // Ground
        const groundY = this.baseY + 10 * s;
        const groundGrad = ctx.createLinearGradient(0, groundY - 20 * s, 0, h);
        groundGrad.addColorStop(0, '#3a7a3a');
        groundGrad.addColorStop(1, '#2a5a2a');
        ctx.fillStyle = groundGrad;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.quadraticCurveTo(w * 0.25, groundY - 8 * s, w * 0.5, groundY + 2 * s);
        ctx.quadraticCurveTo(w * 0.75, groundY + 8 * s, w, groundY - 3 * s);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Wind particles
        this._renderParticles(ctx, w, h, windState);

        // Tower
        this._renderTower(ctx, s);

        // Nacelle
        this._renderNacelle(ctx, s, turbineState);

        // Blades
        this._renderBlades(ctx, s, turbineState);

        // Hub
        this._renderHub(ctx, s);

        // Wind direction compass
        this._renderCompass(ctx, w, windState, turbineState);

        // Status indicator
        this._renderStatus(ctx, w, turbineState);
    }

    _renderParticles(ctx, w, h, windState) {
        const speed = windState.speed / 25; // normalize
        const dir = windState.direction;
        // Determine horizontal movement direction (simplified: left-to-right for west wind)
        const dx = Math.cos((dir - 180) * Math.PI / 180) * speed;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (const p of this.particles) {
            p.x += dx * p.speed * 0.008;
            // Wrap around
            if (p.x > 1.1) p.x = -0.1;
            if (p.x < -0.1) p.x = 1.1;

            const px = p.x * w;
            const py = p.y * h;
            ctx.globalAlpha = p.opacity * Math.min(1, speed * 3);
            ctx.beginPath();

            // Draw as small streaks
            const streakLen = speed * p.speed * 15;
            ctx.moveTo(px, py);
            ctx.lineTo(px - dx * streakLen * 40, py);
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * Math.min(1, speed * 3)})`;
            ctx.lineWidth = p.size * 0.5;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    _renderTower(ctx, s) {
        const bx = this.baseX;
        const by = this.baseY;
        const towerH = 300 * s;
        const topW = CONFIG.TOWER_TOP_WIDTH * s * 1.2;
        const botW = CONFIG.TOWER_BASE_WIDTH * s * 1.5;

        // Tower shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.moveTo(bx - botW + 5, by);
        ctx.lineTo(bx - topW + 3, by - towerH);
        ctx.lineTo(bx + topW + 7, by - towerH);
        ctx.lineTo(bx + botW + 5, by);
        ctx.closePath();
        ctx.fill();

        // Tower body
        const towerGrad = ctx.createLinearGradient(bx - botW, 0, bx + botW, 0);
        towerGrad.addColorStop(0, '#d0d0d0');
        towerGrad.addColorStop(0.3, '#f0f0f0');
        towerGrad.addColorStop(0.7, '#e0e0e0');
        towerGrad.addColorStop(1, '#b0b0b0');
        ctx.fillStyle = towerGrad;

        ctx.beginPath();
        ctx.moveTo(bx - botW, by);
        ctx.lineTo(bx - topW, by - towerH);
        ctx.lineTo(bx + topW, by - towerH);
        ctx.lineTo(bx + botW, by);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    _renderNacelle(ctx, s, state) {
        const bx = this.baseX;
        const by = this.baseY - 300 * s;
        const nLen = 40 * s;
        const nH = 14 * s;

        ctx.fillStyle = '#e8e8e8';
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;

        // Nacelle body (rounded rectangle)
        const nx = bx - nLen * 0.3;
        const ny = by - nH;
        ctx.beginPath();
        ctx.roundRect(nx, ny, nLen, nH, 4 * s);
        ctx.fill();
        ctx.stroke();

        // Nacelle top detail
        ctx.fillStyle = '#d0d0d0';
        ctx.fillRect(nx + nLen * 0.6, ny - 3 * s, nLen * 0.25, 3 * s);
    }

    _renderBlades(ctx, s, state) {
        const hubX = this.baseX;
        const hubY = this.baseY - 300 * s;
        const bladeLen = 140 * s;
        const bladeW = 8 * s;

        ctx.save();
        ctx.translate(hubX, hubY);

        for (let i = 0; i < CONFIG.BLADE_COUNT; i++) {
            const angle = state.rotorAngle + (i * 2 * Math.PI / CONFIG.BLADE_COUNT);

            ctx.save();
            ctx.rotate(angle);

            // Blade shadow
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.beginPath();
            ctx.moveTo(-bladeW * 0.3 + 2, 5);
            ctx.lineTo(-bladeW * 0.05 + 2, bladeLen + 3);
            ctx.lineTo(bladeW * 0.15 + 2, bladeLen + 3);
            ctx.lineTo(bladeW * 0.5 + 2, 5);
            ctx.closePath();
            ctx.fill();

            // Blade body — tapered shape
            const bladeGrad = ctx.createLinearGradient(-bladeW, 0, bladeW, 0);
            bladeGrad.addColorStop(0, '#d8d8d8');
            bladeGrad.addColorStop(0.4, '#f5f5f5');
            bladeGrad.addColorStop(1, '#c0c0c0');
            ctx.fillStyle = bladeGrad;

            ctx.beginPath();
            ctx.moveTo(-bladeW * 0.3, 8 * s);
            ctx.quadraticCurveTo(-bladeW * 0.4, bladeLen * 0.3, -bladeW * 0.05, bladeLen);
            ctx.lineTo(bladeW * 0.15, bladeLen);
            ctx.quadraticCurveTo(bladeW * 0.6, bladeLen * 0.3, bladeW * 0.5, 8 * s);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#aaa';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            ctx.restore();
        }

        ctx.restore();
    }

    _renderHub(ctx, s) {
        const hubX = this.baseX;
        const hubY = this.baseY - 300 * s;
        const hubR = 10 * s;

        // Hub
        const hubGrad = ctx.createRadialGradient(
            hubX - 2, hubY - 2, 0,
            hubX, hubY, hubR
        );
        hubGrad.addColorStop(0, '#ffffff');
        hubGrad.addColorStop(0.5, '#e0e0e0');
        hubGrad.addColorStop(1, '#b0b0b0');

        ctx.fillStyle = hubGrad;
        ctx.beginPath();
        ctx.arc(hubX, hubY, hubR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center bolt
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(hubX, hubY, 3 * s, 0, Math.PI * 2);
        ctx.fill();
    }

    _renderCompass(ctx, canvasW, windState, turbineState) {
        const cx = canvasW - 70;
        const cy = 70;
        const r = 45;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
        ctx.fill();

        // Compass ring
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Cardinal directions
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N', cx, cy - r + 12);
        ctx.fillText('S', cx, cy + r - 12);
        ctx.fillText('E', cx + r - 12, cy);
        ctx.fillText('W', cx - r + 12, cy);

        // Wind direction arrow (blue)
        const windRad = (windState.direction - 90) * Math.PI / 180;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(windRad);
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.moveTo(0, -r + 18);
        ctx.lineTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Nacelle direction (orange line)
        const nacRad = (turbineState.nacelleAngle - 90) * Math.PI / 180;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(nacRad);
        ctx.strokeStyle = '#ff8c00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r + 20);
        ctx.stroke();
        // Small circle at end
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath();
        ctx.arc(0, -r + 20, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('WIND / YAW', cx, cy + r + 16);

        // Legend
        ctx.fillStyle = '#4a9eff';
        ctx.fillRect(cx - 35, cy + r + 24, 8, 8);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.textAlign = 'left';
        ctx.fillText('Wind', cx - 24, cy + r + 31);

        ctx.fillStyle = '#ff8c00';
        ctx.fillRect(cx + 5, cy + r + 24, 8, 8);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('Yaw', cx + 16, cy + r + 31);
    }

    _renderStatus(ctx, canvasW, turbineState) {
        const statusColors = {
            'IDLE': '#888',
            'STARTING': '#f0c040',
            'GENERATING': '#4caf50',
            'SHUTDOWN': '#f44336'
        };

        const x = 15;
        const y = 20;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.roundRect(x, y, 120, 30, 6);
        ctx.fill();

        // Status dot
        ctx.fillStyle = statusColors[turbineState.status] || '#888';
        ctx.beginPath();
        ctx.arc(x + 15, y + 15, 6, 0, Math.PI * 2);
        ctx.fill();

        // Status text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(turbineState.status, x + 28, y + 15);
    }
}
