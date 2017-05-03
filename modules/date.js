const localStorage = require('./storage');
const storage = localStorage.get() || {};

let totalDayRate = 400;
let startTime = 10;
let endTime = 18;

if (storage) {
  totalDayRate = storage.dailyrate;
  startTime = storage.starttime;
  endTime = storage.endtime;
}

module.exports = {
    getRate: function() {
        const totalHours = Math.abs(startTime - endTime);
        const perHourRate = totalDayRate / totalHours;
        const perMinuteRate = perHourRate / 60;

        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes();

        const elpasedHours = Math.abs(startTime - hours);
        const madeHoursSoFar = elpasedHours * perHourRate;
        const madeMinutesSoFar = mins * perMinuteRate;

        return (madeHoursSoFar + madeMinutesSoFar).toFixed(2);
    },
    getEndTime: function() {
        return endTime;
    }
};
