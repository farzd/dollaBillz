const ipc = require('electron').ipcRenderer;
const authButton = document.getElementById('submit');
const starttimeEl = document.getElementById('starttime');
const endtimeEl = document.getElementById('endtime');
const dailyrateEl = document.getElementById('dailyrate');
const currencyEl = document.getElementById('currency');
const frequencyEl = document.getElementById('frequency');

authButton.addEventListener('click', function() {
    const starttime = starttimeEl.options[starttimeEl.selectedIndex].value;
    const endtime = endtimeEl.options[endtimeEl.selectedIndex].value;
    const dailyrate = dailyrateEl.value;
    const currency = currencyEl.value;
    const frequency = frequencyEl.value;
    ipc.send('saveButtonPressed', {starttime, endtime, dailyrate, currency, frequency});
});

ipc.on('settingPageLoaded' , function(event , storageData){ 
    dailyrateEl.value = storageData.dailyrate;
    currencyEl.value = storageData.currency;
    starttimeEl.value = storageData.starttime;
    endtimeEl.value = storageData.endtime;
    frequencyEl.value = storageData.frequency;
});