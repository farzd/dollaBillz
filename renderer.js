var ipc = require('electron').ipcRenderer;
var authButton = document.getElementById('submit');
authButton.addEventListener('click', function(){
    var starttimeEl = document.getElementById('starttime');
    var starttime = starttimeEl.options[starttimeEl.selectedIndex].value;
    var endtimeEl = document.getElementById('endtime');
    var endtime = endtimeEl.options[endtimeEl.selectedIndex].value;
    var dailyrate = document.getElementById('dailyrate').value;
    // ipc.once('actionReply', function(event, response){
    //     processResponse(response);
    
    // })
    ipc.send('invokeAction', {starttime, endtime, dailyrate});
  
});


   
    ipc.on('info' , function(event , data){ 
        document.getElementById('ss').innerHTML = data;

     });