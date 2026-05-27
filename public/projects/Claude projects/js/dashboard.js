// dashboard.js — Real-time charts and gauge displays using Chart.js
// Provides time-series plots for power, wind speed, RPM, and Cp

class Dashboard {
    constructor(dataStore) {
        this.dataStore = dataStore;
        this.charts = {};
        this._initCharts();
    }

    destroy() {
        for (const chart of Object.values(this.charts)) {
            chart.destroy();
        }
        this.charts = {};
    }

    _initCharts() {
        const lightEmbed = !!document.getElementById('twin-simulator');
        const tickColor = lightEmbed ? '#4a6070' : '#888';
        const legendColor = lightEmbed ? '#4a6070' : '#ccc';
        const gridX = lightEmbed ? 'rgba(15,26,34,0.08)' : 'rgba(255,255,255,0.05)';
        const gridY = lightEmbed ? 'rgba(15,26,34,0.1)' : 'rgba(255,255,255,0.08)';

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            plugins: {
                legend: {
                    labels: { color: legendColor, font: { size: 11 } }
                }
            },
            scales: {
                x: {
                    display: true,
                    ticks: { color: tickColor, maxTicksLimit: 6, font: { size: 10 } },
                    grid: { color: gridX }
                },
                y: {
                    ticks: { color: tickColor, font: { size: 10 } },
                    grid: { color: gridY }
                }
            }
        };

        // Power chart
        this.charts.power = new Chart(
            document.getElementById('chart-power').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Electrical Power (kW)',
                            borderColor: '#4caf50',
                            backgroundColor: 'rgba(76,175,80,0.1)',
                            data: [],
                            fill: true,
                            tension: 0.3,
                            pointRadius: 0,
                            borderWidth: 2
                        },
                        {
                            label: 'Aerodynamic Power (kW)',
                            borderColor: '#ff9800',
                            backgroundColor: 'rgba(255,152,0,0.05)',
                            data: [],
                            fill: true,
                            tension: 0.3,
                            pointRadius: 0,
                            borderWidth: 1.5,
                            borderDash: [4, 2]
                        }
                    ]
                },
                options: {
                    ...commonOptions,
                    scales: {
                        ...commonOptions.scales,
                        y: {
                            ...commonOptions.scales.y,
                            title: { display: true, text: 'kW', color: tickColor },
                            min: 0
                        }
                    }
                }
            }
        );

        // Wind speed chart
        this.charts.wind = new Chart(
            document.getElementById('chart-wind').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Wind Speed (m/s)',
                        borderColor: '#4a9eff',
                        backgroundColor: 'rgba(74,158,255,0.1)',
                        data: [],
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0,
                        borderWidth: 2
                    }]
                },
                options: {
                    ...commonOptions,
                    scales: {
                        ...commonOptions.scales,
                        y: {
                            ...commonOptions.scales.y,
                            title: { display: true, text: 'm/s', color: tickColor },
                            min: 0
                        }
                    }
                }
            }
        );

        // RPM and Pitch chart
        this.charts.rotor = new Chart(
            document.getElementById('chart-rotor').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Rotor RPM',
                            borderColor: '#e040fb',
                            data: [],
                            tension: 0.3,
                            pointRadius: 0,
                            borderWidth: 2,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Pitch Angle (deg)',
                            borderColor: '#ffeb3b',
                            data: [],
                            tension: 0.3,
                            pointRadius: 0,
                            borderWidth: 1.5,
                            borderDash: [4, 2],
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    ...commonOptions,
                    scales: {
                        ...commonOptions.scales,
                        y: {
                            ...commonOptions.scales.y,
                            title: { display: true, text: 'RPM', color: tickColor },
                            min: 0,
                            position: 'left'
                        },
                        y1: {
                            ticks: { color: tickColor, font: { size: 10 } },
                            grid: { display: false },
                            title: { display: true, text: 'Pitch (deg)', color: tickColor },
                            min: 0,
                            max: 35,
                            position: 'right'
                        }
                    }
                }
            }
        );

        // Cp and TSR chart
        this.charts.efficiency = new Chart(
            document.getElementById('chart-efficiency').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Cp (Power Coefficient)',
                            borderColor: '#00bcd4',
                            data: [],
                            tension: 0.3,
                            pointRadius: 0,
                            borderWidth: 2,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Tip-Speed Ratio',
                            borderColor: '#ff5722',
                            data: [],
                            tension: 0.3,
                            pointRadius: 0,
                            borderWidth: 1.5,
                            borderDash: [4, 2],
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    ...commonOptions,
                    scales: {
                        ...commonOptions.scales,
                        y: {
                            ...commonOptions.scales.y,
                            title: { display: true, text: 'Cp', color: tickColor },
                            min: 0,
                            max: 0.6,
                            position: 'left'
                        },
                        y1: {
                            ticks: { color: tickColor, font: { size: 10 } },
                            grid: { display: false },
                            title: { display: true, text: 'TSR', color: tickColor },
                            min: 0,
                            position: 'right'
                        }
                    }
                }
            }
        );
    }

    // Update all charts with latest data from the datastore
    update() {
        const ts = this.dataStore.timeSeries;
        const labels = ts.timestamps.map(t => t.toFixed(0) + 's');

        // Power chart
        this.charts.power.data.labels = labels;
        this.charts.power.data.datasets[0].data = ts.elecPower;
        this.charts.power.data.datasets[1].data = ts.aeroPower;
        this.charts.power.update('none');

        // Wind chart
        this.charts.wind.data.labels = labels;
        this.charts.wind.data.datasets[0].data = ts.windSpeed;
        this.charts.wind.update('none');

        // Rotor chart
        this.charts.rotor.data.labels = labels;
        this.charts.rotor.data.datasets[0].data = ts.rotorRPM;
        this.charts.rotor.data.datasets[1].data = ts.pitchAngle;
        this.charts.rotor.update('none');

        // Efficiency chart
        this.charts.efficiency.data.labels = labels;
        this.charts.efficiency.data.datasets[0].data = ts.powerCoefficient;
        this.charts.efficiency.data.datasets[1].data = ts.tipSpeedRatio;
        this.charts.efficiency.update('none');
    }

    // Update the numeric gauges in the dashboard panel
    updateGauges(windState, turbineState) {
        this._setGauge('gauge-wind-speed', windState.speed.toFixed(1), 'm/s');
        this._setGauge('gauge-wind-dir', windState.direction.toFixed(0), 'deg');
        this._setGauge('gauge-power', turbineState.elecPower.toFixed(0), 'kW');
        this._setGauge('gauge-rpm', turbineState.rotorRPM.toFixed(1), 'RPM');
        this._setGauge('gauge-pitch', turbineState.pitchAngle.toFixed(1), 'deg');
        this._setGauge('gauge-cp', turbineState.powerCoefficient.toFixed(3), '');
        this._setGauge('gauge-tsr', turbineState.tipSpeedRatio.toFixed(1), '');
        this._setGauge('gauge-yaw-error', turbineState.yawError.toFixed(1), 'deg');

        // Power bar (percentage of rated)
        const powerPct = Math.min(100,
            (turbineState.elecPower / CONFIG.RATED_POWER) * 100
        );
        const powerBar = document.getElementById('power-bar-fill');
        if (powerBar) {
            powerBar.style.width = powerPct + '%';
            powerBar.className = 'power-bar-fill' +
                (powerPct > 90 ? ' high' : powerPct > 50 ? ' mid' : ' low');
        }
        const pctLabel = document.getElementById('power-pct');
        if (pctLabel) pctLabel.textContent = powerPct.toFixed(0);
    }

    _setGauge(id, value, unit) {
        const el = document.getElementById(id);
        if (el) {
            el.querySelector('.gauge-value').textContent = value;
            const unitEl = el.querySelector('.gauge-unit');
            if (unitEl) unitEl.textContent = unit;
        }
    }
}
