// windModel.js — Wind environment simulation
// Models wind speed, direction, gusts, and turbulence
//
// Key concepts for students:
//   - Mean wind speed follows slow sinusoidal variation
//   - Turbulence adds high-frequency random fluctuations
//   - Gusts are modeled as transient speed increases
//   - Wind direction drifts slowly over time
//   - Wind shear: speed increases with height (power law)

class WindModel {
    constructor() {
        this.baseSpeed = CONFIG.DEFAULT_WIND_SPEED;       // m/s, user-controlled
        this.baseDirection = CONFIG.DEFAULT_WIND_DIRECTION; // degrees, user-controlled
        this.turbulenceIntensity = CONFIG.DEFAULT_TURBULENCE;

        // Internal state
        this._time = 0;
        this._gustActive = false;
        this._gustSpeed = 0;
        this._gustRemaining = 0;
        this._directionNoise = 0;

        // Current output values (read these from outside)
        this.currentSpeed = this.baseSpeed;
        this.currentDirection = this.baseDirection;
        this.currentGustComponent = 0;
        this.currentTurbulenceComponent = 0;
    }

    // Wind shear model: speed at height h given reference speed at hub height
    // Uses power law: v(h) = v_ref * (h / h_ref)^alpha
    // alpha ~ 0.14 for open terrain
    speedAtHeight(height, referenceSpeed) {
        const alpha = 0.14;
        return referenceSpeed * Math.pow(height / CONFIG.HUB_HEIGHT, alpha);
    }

    // Trigger a gust event
    triggerGust(magnitude, durationSeconds) {
        this._gustActive = true;
        this._gustSpeed = magnitude || (this.baseSpeed * 0.5);
        this._gustRemaining = durationSeconds || 5;
    }

    // Main update — call each physics tick
    update(dt) {
        this._time += dt;

        // --- Slow sinusoidal variation (period ~60s) ---
        const slowVariation = Math.sin(this._time * 0.1) * 0.5
                            + Math.sin(this._time * 0.037) * 0.3;

        // --- Turbulence: high-frequency noise scaled by intensity ---
        const turb1 = Math.sin(this._time * 2.7 + 1.3) * 0.4;
        const turb2 = Math.sin(this._time * 5.1 + 0.7) * 0.2;
        const turb3 = (Math.random() - 0.5) * 0.6;
        this.currentTurbulenceComponent =
            this.turbulenceIntensity * this.baseSpeed * (turb1 + turb2 + turb3);

        // --- Gust model ---
        if (this._gustActive) {
            this._gustRemaining -= dt;
            if (this._gustRemaining <= 0) {
                this._gustActive = false;
                this._gustSpeed = 0;
                this._gustRemaining = 0;
            }
            // Gust ramps up and down with a sine envelope
            const gustProgress = 1 - (this._gustRemaining /
                (this._gustRemaining + dt));
            this.currentGustComponent =
                this._gustSpeed * Math.sin(gustProgress * Math.PI);
        } else {
            this.currentGustComponent = 0;
        }

        // --- Total wind speed (clamped >= 0) ---
        this.currentSpeed = Math.max(0,
            this.baseSpeed + slowVariation +
            this.currentTurbulenceComponent + this.currentGustComponent
        );

        // --- Wind direction: slow drift + small noise ---
        this._directionNoise = Math.sin(this._time * 0.05) * 3
                             + Math.sin(this._time * 0.13) * 2
                             + (Math.random() - 0.5) * 1;
        this.currentDirection = this.baseDirection + this._directionNoise;

        // Normalize direction to [0, 360)
        this.currentDirection = ((this.currentDirection % 360) + 360) % 360;
    }

    // Get a snapshot of current wind state
    getState() {
        return {
            speed: this.currentSpeed,
            direction: this.currentDirection,
            gustComponent: this.currentGustComponent,
            turbulenceComponent: this.currentTurbulenceComponent,
            baseSpeed: this.baseSpeed,
            baseDirection: this.baseDirection,
            turbulenceIntensity: this.turbulenceIntensity
        };
    }
}
