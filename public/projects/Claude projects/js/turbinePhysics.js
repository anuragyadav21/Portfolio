// turbinePhysics.js — Wind turbine physics engine
// Models aerodynamics, blade dynamics, power generation, and control systems
//
// Key equations for students:
//   Aerodynamic Power:  P_aero = 0.5 * rho * A * Cp(lambda, beta) * v^3
//   Tip-Speed Ratio:    lambda = (omega * R) / v
//   Aerodynamic Torque: T_aero = P_aero / omega
//   Rotor Dynamics:     J * d(omega)/dt = T_aero - T_friction - T_generator
//   Electrical Power:   P_elec = T_generator * omega * eta_generator

class TurbinePhysics {
    constructor() {
        // --- Rotor state ---
        this.rotorAngle = 0;         // radians (current blade angular position)
        this.rotorSpeed = 0;         // rad/s (angular velocity)
        this.rotorRPM = 0;           // revolutions per minute

        // --- Pitch control ---
        this.pitchAngle = 0;         // degrees (current blade pitch)
        this.pitchTarget = 0;        // degrees (target pitch from controller)

        // --- Yaw control ---
        this.nacelleAngle = CONFIG.DEFAULT_WIND_DIRECTION; // degrees (nacelle facing)
        this.yawError = 0;           // degrees (misalignment with wind)

        // --- Power and torque ---
        this.aeroPower = 0;          // kW
        this.elecPower = 0;          // kW
        this.aeroTorque = 0;         // N·m
        this.genTorque = 0;          // N·m
        this.tipSpeedRatio = 0;
        this.powerCoefficient = 0;   // Cp

        // --- Status ---
        this.status = 'IDLE';        // IDLE, STARTING, GENERATING, SHUTDOWN
        this.brakeEngaged = false;
    }

    // ========================================================
    // Power Coefficient Cp(lambda, beta) — Heier parametric model
    // Students: This is the heart of the aerodynamic model.
    // The Cp curve determines how efficiently the rotor extracts
    // energy from the wind at a given tip-speed ratio and pitch angle.
    // ========================================================
    computeCp(lambda, betaDeg) {
        if (lambda < 0.1) return 0; // Guard against division by zero

        const { c1, c2, c3, c4, c5, c6 } = CONFIG.CP_COEFFICIENTS;

        // Intermediate variable lambda_i
        const denom = 1.0 / (lambda + 0.08 * betaDeg) -
                      0.035 / (Math.pow(betaDeg, 3) + 1);
        if (Math.abs(denom) < 1e-10) return 0;
        const lambdaI = 1.0 / denom;

        let cp = c1 * (c2 / lambdaI - c3 * betaDeg - c4) *
                 Math.exp(-c5 / lambdaI) + c6 * lambda;

        // Cp cannot be negative, NaN, or exceed Betz limit
        if (!isFinite(cp)) return 0;
        return Math.max(0, Math.min(cp, CONFIG.BETZ_LIMIT));
    }

    // ========================================================
    // Main physics update — call every time step
    // ========================================================
    update(dt, windSpeed, windDirection) {
        // --- Yaw control: rotate nacelle toward wind ---
        this._updateYaw(dt, windDirection);

        // --- Effective wind speed (reduced by yaw misalignment) ---
        const yawRad = this.yawError * Math.PI / 180;
        const effectiveWind = windSpeed * Math.cos(yawRad);

        // --- Turbine operational status ---
        this._updateStatus(effectiveWind);

        // --- Pitch control ---
        this._updatePitch(dt, effectiveWind);

        // --- Aerodynamics ---
        if (effectiveWind > 0.5 && !this.brakeEngaged) {
            // Tip-speed ratio
            this.tipSpeedRatio = (this.rotorSpeed * CONFIG.ROTOR_RADIUS) /
                                  effectiveWind;

            // Power coefficient
            this.powerCoefficient = this.computeCp(
                this.tipSpeedRatio, this.pitchAngle
            );

            // Aerodynamic power: P = 0.5 * rho * A * Cp * v^3
            this.aeroPower = 0.5 * CONFIG.AIR_DENSITY *
                             CONFIG.SWEPT_AREA *
                             this.powerCoefficient *
                             Math.pow(effectiveWind, 3) / 1000; // convert to kW

            // Aerodynamic torque
            if (this.rotorSpeed > 0.5) {
                this.aeroTorque = (this.aeroPower * 1000) / this.rotorSpeed;
            } else {
                // Starting torque: wind drag on stationary/slow blades
                // This gets the rotor spinning until TSR is high enough
                // for the Cp curve to take over
                const dragCoeff = 0.02;
                this.aeroTorque = dragCoeff * 0.5 * CONFIG.AIR_DENSITY *
                                  CONFIG.SWEPT_AREA *
                                  Math.pow(effectiveWind, 2) *
                                  CONFIG.ROTOR_RADIUS;
            }
        } else {
            this.tipSpeedRatio = 0;
            this.powerCoefficient = 0;
            this.aeroPower = 0;
            this.aeroTorque = 0;
        }

        // --- Generator torque (simple proportional control) ---
        if (this.status === 'GENERATING') {
            // Target RPM for optimal TSR tracking
            const targetOmega = (CONFIG.OPTIMAL_TSR * effectiveWind) /
                                 CONFIG.ROTOR_RADIUS;
            const omegaError = this.rotorSpeed - targetOmega;

            // Generator applies resistive torque to extract energy
            this.genTorque = Math.max(0,
                this.aeroTorque * 0.9 + omegaError * 50000
            );
        } else {
            this.genTorque = 0;
        }

        // --- Brake torque ---
        const brakeTorque = this.brakeEngaged ? this.rotorSpeed * 100000 : 0;

        // --- Rotor dynamics: J * dw/dt = T_aero - T_friction - T_gen - T_brake ---
        const netTorque = this.aeroTorque -
                          CONFIG.ROTOR_FRICTION -
                          this.genTorque -
                          brakeTorque;

        const angularAccel = netTorque / CONFIG.ROTOR_INERTIA;
        this.rotorSpeed = Math.max(0, this.rotorSpeed + angularAccel * dt);

        // Clamp to max RPM
        const maxOmega = CONFIG.MAX_RPM * 2 * Math.PI / 60;
        this.rotorSpeed = Math.min(this.rotorSpeed, maxOmega);

        // Update angle
        this.rotorAngle += this.rotorSpeed * dt;
        this.rotorAngle %= (2 * Math.PI);

        // RPM
        this.rotorRPM = this.rotorSpeed * 60 / (2 * Math.PI);

        // --- Electrical power output ---
        if (this.status === 'GENERATING' && this.genTorque > 0) {
            this.elecPower = (this.genTorque * this.rotorSpeed / 1000) *
                              CONFIG.GENERATOR_EFFICIENCY;
            this.elecPower = Math.min(this.elecPower, CONFIG.RATED_POWER);
            this.elecPower = Math.max(0, this.elecPower);
        } else {
            this.elecPower = 0;
        }
    }

    // Yaw controller — slowly aligns nacelle with wind direction
    _updateYaw(dt, windDirection) {
        this.yawError = windDirection - this.nacelleAngle;
        // Normalize to [-180, 180]
        while (this.yawError > 180) this.yawError -= 360;
        while (this.yawError < -180) this.yawError += 360;

        if (Math.abs(this.yawError) > CONFIG.YAW_ERROR_THRESHOLD) {
            const yawStep = CONFIG.YAW_RATE * dt * Math.sign(this.yawError);
            this.nacelleAngle += yawStep;
            this.nacelleAngle = ((this.nacelleAngle % 360) + 360) % 360;
        }
    }

    // Pitch controller — adjusts blade pitch based on wind conditions
    _updatePitch(dt, windSpeed) {
        if (this.status === 'SHUTDOWN' || this.brakeEngaged) {
            this.pitchTarget = CONFIG.MAX_PITCH_ANGLE; // feather blades
        } else if (windSpeed > CONFIG.RATED_WIND_SPEED) {
            // Above rated: pitch to limit power
            const excess = windSpeed - CONFIG.RATED_WIND_SPEED;
            this.pitchTarget = Math.min(
                CONFIG.MAX_PITCH_ANGLE,
                excess * 2.5
            );
        } else {
            // Below rated: pitch for maximum energy capture
            this.pitchTarget = CONFIG.MIN_PITCH_ANGLE;
        }

        // Actuator rate limit
        const pitchError = this.pitchTarget - this.pitchAngle;
        const maxStep = CONFIG.PITCH_RATE * dt;
        if (Math.abs(pitchError) > maxStep) {
            this.pitchAngle += maxStep * Math.sign(pitchError);
        } else {
            this.pitchAngle = this.pitchTarget;
        }
    }

    // State machine for turbine operational status
    _updateStatus(windSpeed) {
        switch (this.status) {
            case 'IDLE':
                if (windSpeed >= CONFIG.CUT_IN_WIND_SPEED && !this.brakeEngaged) {
                    this.status = 'STARTING';
                }
                break;
            case 'STARTING':
                if (windSpeed < CONFIG.CUT_IN_WIND_SPEED) {
                    this.status = 'IDLE';
                } else if (this.rotorRPM > 2) {
                    this.status = 'GENERATING';
                }
                break;
            case 'GENERATING':
                if (windSpeed < CONFIG.CUT_IN_WIND_SPEED * 0.8) {
                    this.status = 'IDLE';
                } else if (windSpeed > CONFIG.CUT_OUT_WIND_SPEED) {
                    this.status = 'SHUTDOWN';
                }
                break;
            case 'SHUTDOWN':
                if (windSpeed < CONFIG.CUT_OUT_WIND_SPEED * 0.9 &&
                    windSpeed >= CONFIG.CUT_IN_WIND_SPEED) {
                    this.status = 'STARTING';
                } else if (windSpeed < CONFIG.CUT_IN_WIND_SPEED) {
                    this.status = 'IDLE';
                }
                break;
        }
    }

    // Emergency stop
    engageBrake() {
        this.brakeEngaged = true;
        this.status = 'SHUTDOWN';
    }

    releaseBrake() {
        this.brakeEngaged = false;
        this.status = 'IDLE';
    }

    // Get full state snapshot
    getState() {
        return {
            rotorAngle: this.rotorAngle,
            rotorRPM: this.rotorRPM,
            rotorSpeed: this.rotorSpeed,
            pitchAngle: this.pitchAngle,
            nacelleAngle: this.nacelleAngle,
            yawError: this.yawError,
            tipSpeedRatio: this.tipSpeedRatio,
            powerCoefficient: this.powerCoefficient,
            aeroPower: this.aeroPower,
            elecPower: this.elecPower,
            aeroTorque: this.aeroTorque,
            genTorque: this.genTorque,
            status: this.status,
            brakeEngaged: this.brakeEngaged
        };
    }
}
