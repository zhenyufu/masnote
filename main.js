const electron = require('electron');
const {app, BrowserWindow, Menu} = require('electron');


//app.disableHardwareAcceleration();
var mainWindow;

function createWindow () {
    
    mainWindow = new BrowserWindow({width: 1024, height: 900});
    // toggle this to remove the default menu
    //mainWindow.setMenu(null);
    
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    
    mainWindow.on("closed", function () {
        mainWindow = null;
        //config.set('winBounds', win.getBounds())
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



