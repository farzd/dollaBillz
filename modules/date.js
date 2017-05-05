const localStorage = require('./storage');
let storage = localStorage.get() || {};

let dailyrate = 400;
let starttime = 10;
let endtime = 18;
let currency = '£';
let frequency = 1;

function updateFromStorage() {
    storage = localStorage.get() || {};
    if (Object.keys(storage).length) {
        dailyrate = storage.dailyrate;
        starttime = storage.starttime;
        endtime = storage.endtime;
        currency = storage.currency;
        frequency = storage.frequency;
    }
}

module.exports = {
    getDefaults: function() {
        return {
            dailyrate,
            starttime,
            endtime,
            currency,
            frequency
        }
    },
    getRate: function() {
        updateFromStorage();
        const totalHours = Math.abs(starttime - endtime);
        const perHourRate = dailyrate / totalHours;
        const perMinuteRate = perHourRate / 60;

        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes();

        const elpasedHours = Math.abs(starttime - hours);
        const madeHoursSoFar = elpasedHours * perHourRate;
        const madeMinutesSoFar = mins * perMinuteRate;
        return currency + (madeHoursSoFar + madeMinutesSoFar).toFixed(2);
    },
    getEndTime: function() {
        updateFromStorage();
        return endtime;
    },
    getMaxRate: function() {
        updateFromStorage();    
        return dailyrate;
    },
    getFrequency: function() {
        updateFromStorage();
        return frequency * 10000;
    }
};
