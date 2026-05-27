// datastore.js — Local data persistence using localStorage
// Stores time-series data and simulation configuration
//
// Students: This module acts as the "database" for the digital twin.
// In a production system, this would be replaced with a real database
// or cloud storage. localStorage keeps everything in the browser.

class DataStore {
    constructor() {
        this.KEY_PREFIX = 'windmill_dt_';
        this.timeSeries = {
            timestamps: [],
            windSpeed: [],
            windDirection: [],
            rotorRPM: [],
            pitchAngle: [],
            powerCoefficient: [],
            aeroPower: [],
            elecPower: [],
            tipSpeedRatio: [],
            yawError: []
        };
        this.maxPoints = CONFIG.MAX_DATA_POINTS;
        this._loadFromStorage();
    }

    // Record a data point from the current simulation state
    record(timestamp, windState, turbineState) {
        this.timeSeries.timestamps.push(timestamp);
        this.timeSeries.windSpeed.push(windState.speed);
        this.timeSeries.windDirection.push(windState.direction);
        this.timeSeries.rotorRPM.push(turbineState.rotorRPM);
        this.timeSeries.pitchAngle.push(turbineState.pitchAngle);
        this.timeSeries.powerCoefficient.push(turbineState.powerCoefficient);
        this.timeSeries.aeroPower.push(turbineState.aeroPower);
        this.timeSeries.elecPower.push(turbineState.elecPower);
        this.timeSeries.tipSpeedRatio.push(turbineState.tipSpeedRatio);
        this.timeSeries.yawError.push(turbineState.yawError);

        // Trim to max points
        if (this.timeSeries.timestamps.length > this.maxPoints) {
            for (const key of Object.keys(this.timeSeries)) {
                this.timeSeries[key].shift();
            }
        }
    }

    // Save current time-series and config to localStorage
    save() {
        try {
            localStorage.setItem(
                this.KEY_PREFIX + 'timeseries',
                JSON.stringify(this.timeSeries)
            );
        } catch (e) {
            console.warn('DataStore: Could not save to localStorage', e);
        }
    }

    // Save simulation configuration
    saveConfig(config) {
        try {
            localStorage.setItem(
                this.KEY_PREFIX + 'config',
                JSON.stringify(config)
            );
        } catch (e) {
            console.warn('DataStore: Could not save config', e);
        }
    }

    // Load saved configuration
    loadConfig() {
        try {
            const data = localStorage.getItem(this.KEY_PREFIX + 'config');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    // Clear all stored data
    clear() {
        this.timeSeries = {
            timestamps: [],
            windSpeed: [],
            windDirection: [],
            rotorRPM: [],
            pitchAngle: [],
            powerCoefficient: [],
            aeroPower: [],
            elecPower: [],
            tipSpeedRatio: [],
            yawError: []
        };
        localStorage.removeItem(this.KEY_PREFIX + 'timeseries');
        localStorage.removeItem(this.KEY_PREFIX + 'config');
    }

    // Export data as CSV string (for students to analyze externally)
    exportCSV() {
        const headers = Object.keys(this.timeSeries);
        const rows = [headers.join(',')];
        const len = this.timeSeries.timestamps.length;

        for (let i = 0; i < len; i++) {
            const row = headers.map(h =>
                typeof this.timeSeries[h][i] === 'number'
                    ? this.timeSeries[h][i].toFixed(4)
                    : this.timeSeries[h][i]
            );
            rows.push(row.join(','));
        }
        return rows.join('\n');
    }

    // Trigger CSV download in browser
    downloadCSV() {
        const csv = this.exportCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `windmill_data_${new Date().toISOString().slice(0, 19)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    _loadFromStorage() {
        try {
            const data = localStorage.getItem(this.KEY_PREFIX + 'timeseries');
            if (data) {
                const parsed = JSON.parse(data);
                // Validate structure
                if (parsed.timestamps && Array.isArray(parsed.timestamps)) {
                    this.timeSeries = parsed;
                }
            }
        } catch (e) {
            console.warn('DataStore: Could not load from localStorage', e);
        }
    }
}
