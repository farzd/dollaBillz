const electron = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain;
const localStorage = require('./modules/storage');
const time = require('./modules/date');

const app = electron.app
let mainWindow
let appIcon = null;
let timeInterval;


function updateStatus(appIcon) {
  if (timeInterval) {
      clearInterval(timeInterval) 
  }
  let endTime = time.getEndTime();
  let maxRate = time.getMaxRate();  
  let frequency = time.getFrequency();

  appIcon.setTitle(time.getRate());

  const now = new Date();
  const hours = now.getHours();
  if (hours <= endTime) {
    timeInterval = setInterval(function () {
      appIcon.setTitle(time.getRate());
    }, frequency);
  } else {
    appIcon.setTitle(maxRate);
  }
}

function createWindow() {
  appIcon = new electron.Tray(path.join(__dirname ,'assets', 'cash@2x.png'));
  updateStatus(appIcon);
  
  let viewFlag = 1;
  const contextMenu = electron.Menu.buildFromTemplate([{
      label: 'Hide/Show',
      click: function () {
        if (viewFlag == 1) {
          viewFlag = 0;
          return appIcon.setTitle('');
        }
        viewFlag = 1;
        return updateStatus(appIcon);
      }
    },
    {
      label: 'Config',
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

  ipc.on('saveButtonPressed', function(event, data){
      localStorage.set(data);
      updateStatus(appIcon);
  });  
}

function makeSettingsWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 300,
    height: 300,
    title: 'config',
    resizable: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('did-finish-load', () => {
    let defaultValues = localStorage.get() || {};
    if (!Object.keys(defaultValues).length) {
      defaultValues = time.getDefaults();
    }
    mainWindow.webContents.send('settingPageLoaded', defaultValues)
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