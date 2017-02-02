const electron = require('electron');
const {app, BrowserWindow, Menu} = require('electron');


//app.disableHardwareAcceleration();
var MasMenus = require("./js/menus.js");

var mainWindow;

function createWindow () {
    //mainWindow = new BrowserWindow({width: 800, height: 600});
    
    mainWindow = new BrowserWindow({width: 1024, height: 900});
    var masMenus = new MasMenus(mainWindow);

    Menu.setApplicationMenu(Menu.buildFromTemplate(masMenus.mainMenu));
    
    mainWindow.loadURL(`file://${__dirname}/index.html`);
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



