const electron = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain;
const localStorage = require('./modules/storage');
const time = require('./modules/date');
const app = electron.app
const iconPath = path.join(__dirname, 'oval@2x.png');
let mainWindow
let appIcon = null;
let endTime = time.getEndTime();
let maxRate = time.getMaxRate();

function createWindow() {
  appIcon = new electron.Tray(iconPath);
  appIcon.setTitle(time.getRate());

  const now = new Date();
  const hours = now.getHours();
  if (hours <= endTime) {
    setInterval(function () {
      appIcon.setTitle(time.getRate());
    }, 10000);
  } else {
    appIcon.setTitle(maxRate);
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
        return appIcon.setTitle(time.getRate());
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

  ipc.on('saveButtonPressed', function(event, data){
      localStorage.set(data);
      endTime = time.getEndTime();
      maxRate = time.getMaxRate();
  });  
}

function makeSettingsWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 300,
    height: 300,
    title: 'config'
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('settingPageLoaded', localStorage.get())
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