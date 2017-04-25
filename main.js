const electron = require('electron')
const path = require('path')
const url = require('url')
const moment = require('moment');

// Module to control application life.
const iconPath = path.join(__dirname, 'oval@2x.png');
let appIcon = null;
const app = electron.app
// Module to create native browser window.
//const BrowserWindow = electron.BrowserWindow
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let totalDayRate = 400;
let startTime = 10;
let endTime = 18;
let totalHours = Math.abs(startTime - endTime);
let perHourRate = totalDayRate / totalHours;
let perMinuteRate = perHourRate / 60;
//let hoursWorked = Math.abs(startTime - timeNow);


function createWindow () {
  // Create the browser window.
  appIcon = new electron.Tray(iconPath);

var now = new Date();
var hours = now.getHours();

if(hours <= endTime) {
    setInterval(function () {

var now = new Date();
var hours = now.getHours();

var mins = now.getMinutes();

var elpasedHours = Math.abs(startTime - hours);
var madeHoursSoFar = elpasedHours * perHourRate;
var madeMinutesSoFar = mins * perMinuteRate;

  appIcon.setTitle('£' + (madeHoursSoFar + madeMinutesSoFar).toFixed(2));


    }, 10000);
 
}


 var contextMenu = electron.Menu.buildFromTemplate([
    {
      label: 'Item3',
      type: 'radio',
      checked: true
    },
    { label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);



  appIcon.setToolTip('This is my application.');
  appIcon.setContextMenu(contextMenu);


  // mainWindow = new BrowserWindow({width: 800, height: 600})

  // // and load the index.html of the app.
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  // mainWindow.on('closed', function () {
  //   // Dereference the window object, usually you would store windows
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  // //  mainWindow = null
  // })
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
