// config.js — Physical constants and turbine specifications
// Students: Modify these parameters to explore different turbine designs

const CONFIG = {
    // --- Physical Constants ---
    AIR_DENSITY: 1.225,          // kg/m³ (sea level, 15°C)
    GRAVITY: 9.81,               // m/s²

    // --- Turbine Geometry ---
    BLADE_COUNT: 3,
    BLADE_LENGTH: 40,            // meters (radius of rotor)
    HUB_HEIGHT: 80,              // meters
    NACELLE_LENGTH: 10,          // meters
    TOWER_BASE_WIDTH: 4,         // meters
    TOWER_TOP_WIDTH: 2.5,        // meters

    // --- Rotor Dynamics ---
    ROTOR_INERTIA: 1e6,          // kg·m² (moment of inertia)
    ROTOR_FRICTION: 500,         // N·m (bearing friction torque)
    MAX_RPM: 15,                 // maximum rotor speed
    MIN_RPM: 0,

    // --- Power Generation ---
    RATED_POWER: 2000,           // kW (rated electrical output)
    GENERATOR_EFFICIENCY: 0.94,  // electrical generator efficiency
    GEARBOX_RATIO: 100,          // gearbox speed-up ratio
    CUT_IN_WIND_SPEED: 3,       // m/s — turbine starts generating
    RATED_WIND_SPEED: 12,       // m/s — reaches rated power
    CUT_OUT_WIND_SPEED: 25,     // m/s — turbine shuts down for safety

    // --- Cp Curve Parameters (Heier model) ---
    // Cp(lambda, beta) = c1*(c2/lambda_i - c3*beta - c4)*exp(-c5/lambda_i) + c6*lambda
    CP_COEFFICIENTS: {
        c1: 0.5176,
        c2: 116,
        c3: 0.4,
        c4: 5,
        c5: 21,
        c6: 0.0068
    },
    OPTIMAL_TSR: 8.1,            // optimal tip-speed ratio
    BETZ_LIMIT: 0.5926,          // theoretical max Cp

    // --- Pitch Control ---
    MIN_PITCH_ANGLE: 0,          // degrees
    MAX_PITCH_ANGLE: 30,         // degrees
    PITCH_RATE: 5,               // degrees per second (actuator speed)

    // --- Yaw Control ---
    YAW_RATE: 0.5,               // degrees per second
    YAW_ERROR_THRESHOLD: 5,      // degrees — acceptable misalignment

    // --- Wind Defaults ---
    DEFAULT_WIND_SPEED: 8,       // m/s
    DEFAULT_WIND_DIRECTION: 270, // degrees (west wind)
    DEFAULT_TURBULENCE: 0.1,     // turbulence intensity (0–1)

    // --- Simulation ---
    TIME_STEP: 0.05,             // seconds per physics update
    RENDER_FPS: 30,              // frames per second for canvas
    CHART_UPDATE_INTERVAL: 500,  // ms between chart updates
    MAX_DATA_POINTS: 600,        // max points stored in charts (~5 min at 500ms)

    // --- Derived (computed at init) ---
    get SWEPT_AREA() {
        return Math.PI * this.BLADE_LENGTH * this.BLADE_LENGTH;
    },
    get ROTOR_RADIUS() {
        return this.BLADE_LENGTH;
    }
};
