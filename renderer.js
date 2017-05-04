const ipc = require('electron').ipcRenderer;
const authButton = document.getElementById('submit');
const starttimeEl = document.getElementById('starttime');
const endtimeEl = document.getElementById('endtime');
const dailyrateEl = document.getElementById('dailyrate');
const currencyEl = document.getElementById('currency');

authButton.addEventListener('click', function() {
    const starttime = starttimeEl.options[starttimeEl.selectedIndex].value;
    const endtime = endtimeEl.options[endtimeEl.selectedIndex].value;
    const dailyrate = dailyrateEl.value;
    const currency = currencyEl.value;
    ipc.send('saveButtonPressed', {starttime, endtime, dailyrate, currency});
});

ipc.on('settingPageLoaded' , function(event , storageData){ 
    dailyrateEl.value = storageData.dailyrate;
    currencyEl.value = storageData.currency;
    starttimeEl.value = storageData.starttime;
    endtimeEl.value = storageData.endtime;
});