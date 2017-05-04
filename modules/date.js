const localStorage = require('./storage');
let storage = localStorage.get() || {};

let totalDayRate = 400;
let startTime = 10;
let endTime = 18;
let currency = '£';

if (Object.keys(storage).length) {
  totalDayRate = storage.dailyrate;
  startTime = storage.starttime;
  endTime = storage.endtime;
  currency = storage.currency;
}

module.exports = {
    getRate: function() {
        storage = localStorage.get() || {};
        if (Object.keys(storage).length) {
            totalDayRate = storage.dailyrate;
            startTime = storage.starttime;
            endTime = storage.endtime;
            currency = storage.currency;
        }

        const totalHours = Math.abs(startTime - endTime);
        const perHourRate = totalDayRate / totalHours;
        const perMinuteRate = perHourRate / 60;

        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes();

        const elpasedHours = Math.abs(startTime - hours);
        const madeHoursSoFar = elpasedHours * perHourRate;
        const madeMinutesSoFar = mins * perMinuteRate;

        return currency + (madeHoursSoFar + madeMinutesSoFar).toFixed(2);
    },
    getEndTime: function() {
        storage = localStorage.get() || {};
         if (Object.keys(storage).length) {
            endTime = storage.endtime;
         }
        return endTime;
    },
    getMaxRate: function() {
        storage = localStorage.get() || {};
         if (Object.keys(storage).length) {
            totalDayRate = storage.dailyrate;
         }      
        return totalDayRate;
    }
};
