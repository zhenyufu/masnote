const electron = require('electron');
const {app, BrowserWindow, Menu} = require('electron');

//const electron = require("electron");
//const app = electron.app;
//const BrowserWindow = electron.BrowserWindow;
//const Menu = electron.Menu;
//app.disableHardwareAcceleration();
//var GyMenus = require("./js/menus.js");

var mainWindow;

function createWindow () {
    //mainWindow = new BrowserWindow({width: 800, height: 600});
    
    mainWindow = new BrowserWindow({width: 1024, height: 900});
    var gyMenus = new GyMenus(electron, mainWindow);

    Menu.setApplicationMenu(Menu.buildFromTemplate(gyMenus.mainMenu));
    
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    //mainWindow.loadURL(`file://${__dirname}/shelf/page1.html`);
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
};


// "ready" when electron has finished initialization
app.on("ready", createWindow);
 
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// "activate" for MacOS clicking on dock icon
app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});



