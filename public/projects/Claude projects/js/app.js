// app.js — Main application: simulation loop, UI bindings, and initialization
// This is the entry point that wires everything together

class WindmillApp {
    constructor() {
        this.wind = new WindModel();
        this.turbine = new TurbinePhysics();
        this.dataStore = new DataStore();
        this.renderer = new TurbineRenderer('turbine-canvas');
        this.dashboard = new Dashboard(this.dataStore);

        this.running = false;
        this.simTime = 0;
        this.lastFrameTime = 0;
        this.lastChartUpdate = 0;
        this.lastDataRecord = 0;
        this.speedMultiplier = 1;

        this._bindControls();
        this._loadSavedConfig();
        this._renderLoop = this._renderLoop.bind(this);
    }

    // Start the simulation
    start() {
        this.running = true;
        this.lastFrameTime = performance.now();
        document.getElementById('btn-start').textContent = 'Pause';
        document.getElementById('btn-start').classList.add('active');
        requestAnimationFrame(this._renderLoop);
    }

    // Pause the simulation
    pause() {
        this.running = false;
        document.getElementById('btn-start').textContent = 'Start';
        document.getElementById('btn-start').classList.remove('active');
    }

    // Reset everything
    reset() {
        this.pause();
        this.simTime = 0;
        this.wind = new WindModel();
        this.turbine = new TurbinePhysics();
        this.dataStore.clear();
        this.dashboard.destroy();
        this.dashboard = new Dashboard(this.dataStore);
        this._loadSavedConfig();
        this._syncSlidersToState();
        this.renderer.render(this.turbine.getState(), this.wind.getState());
        this._updateTimeDisplay();
    }

    // Main loop
    _renderLoop(timestamp) {
        if (!this.running) return;

        const elapsed = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
        this.lastFrameTime = timestamp;

        // Physics updates (may run multiple substeps)
        const simDt = CONFIG.TIME_STEP;
        let simElapsed = elapsed * this.speedMultiplier;
        while (simElapsed > 0) {
            const step = Math.min(simElapsed, simDt);
            this.wind.update(step);
            this.turbine.update(
                step,
                this.wind.currentSpeed,
                this.wind.currentDirection
            );
            this.simTime += step;
            simElapsed -= step;
        }

        // Render turbine visualization
        this.renderer.render(
            this.turbine.getState(),
            this.wind.getState()
        );

        // Update gauges every frame
        this.dashboard.updateGauges(
            this.wind.getState(),
            this.turbine.getState()
        );

        this._updateTimeDisplay();

        // Record data and update charts at lower frequency
        const now = performance.now();
        if (now - this.lastDataRecord > CONFIG.CHART_UPDATE_INTERVAL) {
            this.dataStore.record(
                this.simTime,
                this.wind.getState(),
                this.turbine.getState()
            );
            this.lastDataRecord = now;
        }

        if (now - this.lastChartUpdate > CONFIG.CHART_UPDATE_INTERVAL) {
            this.dashboard.update();
            this.lastChartUpdate = now;
        }

        requestAnimationFrame(this._renderLoop);
    }

    _updateTimeDisplay() {
        const el = document.getElementById('sim-time');
        if (el) {
            const mins = Math.floor(this.simTime / 60);
            const secs = Math.floor(this.simTime % 60);
            el.textContent =
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    _bindControls() {
        // Start/Pause
        document.getElementById('btn-start').addEventListener('click', () => {
            this.running ? this.pause() : this.start();
        });

        // Reset
        document.getElementById('btn-reset').addEventListener('click', () => {
            this.reset();
        });

        // Emergency brake
        document.getElementById('btn-brake').addEventListener('click', () => {
            if (this.turbine.brakeEngaged) {
                this.turbine.releaseBrake();
                document.getElementById('btn-brake').textContent = 'E-Brake';
                document.getElementById('btn-brake').classList.remove('engaged');
            } else {
                this.turbine.engageBrake();
                document.getElementById('btn-brake').textContent = 'Release Brake';
                document.getElementById('btn-brake').classList.add('engaged');
            }
        });

        // Gust button
        document.getElementById('btn-gust').addEventListener('click', () => {
            this.wind.triggerGust(
                this.wind.baseSpeed * 0.6,
                4
            );
        });

        // Wind speed slider
        this._bindSlider('slider-wind-speed', 'val-wind-speed', (val) => {
            this.wind.baseSpeed = parseFloat(val);
        }, ' m/s');

        // Wind direction slider
        this._bindSlider('slider-wind-dir', 'val-wind-dir', (val) => {
            this.wind.baseDirection = parseFloat(val);
        }, ' deg');

        // Turbulence slider
        this._bindSlider('slider-turbulence', 'val-turbulence', (val) => {
            this.wind.turbulenceIntensity = parseFloat(val);
        }, '');

        // Sim speed slider
        this._bindSlider('slider-sim-speed', 'val-sim-speed', (val) => {
            this.speedMultiplier = parseFloat(val);
        }, 'x');

        // Export CSV
        document.getElementById('btn-export').addEventListener('click', () => {
            this.dataStore.downloadCSV();
        });

        // Save config
        document.getElementById('btn-save-config').addEventListener('click', () => {
            this._saveCurrentConfig();
            this._flashButton('btn-save-config', 'Saved!');
        });

        // Keyboard shortcuts (skip when embedded twin is hidden)
        document.addEventListener('keydown', (e) => {
            const simRoot = document.getElementById('twin-simulator');
            if (simRoot && !simRoot.offsetParent) return;
            if (e.target.tagName === 'INPUT') return;
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    this.running ? this.pause() : this.start();
                    break;
                case 'r':
                    this.reset();
                    break;
                case 'g':
                    this.wind.triggerGust(this.wind.baseSpeed * 0.6, 4);
                    break;
                case 'b':
                    document.getElementById('btn-brake').click();
                    break;
            }
        });
    }

    _bindSlider(sliderId, valueId, callback, suffix) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(valueId);
        if (!slider || !display) return;

        const update = () => {
            display.textContent = slider.value + suffix;
            callback(slider.value);
        };

        slider.addEventListener('input', update);
        update(); // set initial
    }

    _saveCurrentConfig() {
        this.dataStore.saveConfig({
            windSpeed: this.wind.baseSpeed,
            windDirection: this.wind.baseDirection,
            turbulence: this.wind.turbulenceIntensity,
            simSpeed: this.speedMultiplier
        });
    }

    _loadSavedConfig() {
        const config = this.dataStore.loadConfig();
        if (config) {
            if (config.windSpeed != null) {
                this.wind.baseSpeed = config.windSpeed;
                this._setSlider('slider-wind-speed', config.windSpeed);
            }
            if (config.windDirection != null) {
                this.wind.baseDirection = config.windDirection;
                this._setSlider('slider-wind-dir', config.windDirection);
            }
            if (config.turbulence != null) {
                this.wind.turbulenceIntensity = config.turbulence;
                this._setSlider('slider-turbulence', config.turbulence);
            }
            if (config.simSpeed != null) {
                this.speedMultiplier = config.simSpeed;
                this._setSlider('slider-sim-speed', config.simSpeed);
            }
        }
    }

    _setSlider(id, value) {
        const slider = document.getElementById(id);
        if (slider) {
            slider.value = value;
            slider.dispatchEvent(new Event('input'));
        }
    }

    _syncSlidersToState() {
        this._setSlider('slider-wind-speed', this.wind.baseSpeed);
        this._setSlider('slider-wind-dir', this.wind.baseDirection);
        this._setSlider('slider-turbulence', this.wind.turbulenceIntensity);
        this._setSlider('slider-sim-speed', this.speedMultiplier);
    }

    _flashButton(id, text) {
        const btn = document.getElementById(id);
        const original = btn.textContent;
        btn.textContent = text;
        setTimeout(() => { btn.textContent = original; }, 1500);
    }

    /** Resize canvas/charts and redraw static preview (needed when embed is initially hidden). */
    refreshView() {
        this.renderer._resize();
        this.renderer.render(
            this.turbine.getState(),
            this.wind.getState()
        );
        if (this.dashboard?.charts) {
            Object.values(this.dashboard.charts).forEach((c) => {
                try { c.resize(); } catch (_) { /* chart not laid out yet */ }
            });
        }
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    window.app = new WindmillApp();
    window.app.refreshView();

    // Portfolio embed: layer1 is hidden at load — redraw when simulator becomes visible
    const simRoot = document.getElementById('twin-simulator');
    if (simRoot) {
        const redrawWhenVisible = () => {
            if (!simRoot.offsetParent) return;
            window.app.refreshView();
        };
        const visObs = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) redrawWhenVisible();
        }, { threshold: 0.08 });
        visObs.observe(simRoot);
        const layer1 = document.getElementById('layer1');
        if (layer1) {
            new MutationObserver(redrawWhenVisible).observe(layer1, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
});
