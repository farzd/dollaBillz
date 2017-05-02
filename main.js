const electron = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain;
const app = electron.app
const iconPath = path.join(__dirname, 'oval@2x.png');
const Config = require('electron-config');
const config = new Config();
let mainWindow
let appIcon = null;


function getLocalStorage() {
  return config.get('dolla');
}

function setLocalStorage(obj) {
  config.set('dolla', obj);
}

let globalEndTime = 18;

function getDoller() {
  const storage = getLocalStorage() || {};
  let totalDayRate = storage.dailyrate || 400;
  let startTime = storage.starttime  || 10;
  let endTime = storage.endtime || 18;
  globalEndTime = storage.endtime || 18;
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
}

 

function createWindow() {
  appIcon = new electron.Tray(iconPath);
  appIcon.setTitle('£' + getDoller());

  const now = new Date();
  const hours = now.getHours();
  if (hours <= globalEndTime) {
    setInterval(function () {
      appIcon.setTitle('£' + getDoller());
    }, 10000);
  }

  let viewFlag = 1;
  const contextMenu = electron.Menu.buildFromTemplate([{
      label: 'hide/show',
      click: function () {
        if (viewFlag == 1) {
          viewFlag = 0;
          return appIcon.setTitle('');
        }
        viewFlag = 1;
        return appIcon.setTitle('£' + getDoller());
      }
    },
    {
      label: 'config',
      click: function () {
         makeSettingsWindow();
      }
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);

  appIcon.setContextMenu(contextMenu);

  ipc.on('invokeAction', function(event, data){
      //var result = processData(data);
      console.log(data);
      setLocalStorage(data);
      appIcon.setTitle('£' + getDoller());
      //event.sender.send('actionReply', result);
  });  
}

function makeSettingsWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 300,
    height: 300,
    title: 'config'
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('info', 'whoooooooh!')
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    //  mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)




// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) {
  //   createWindow()
  // }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.