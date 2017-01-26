module.exports = function (electron, browserWindow) {
    var module = {};

    module.mainMenu = [{
        label: "File",
            submenu: [
                {
                    label: "Undo",
                    accelerator: "CmdOrCtrl+Z",
                    role: 'undo'
                },
                {
                    label: "Open",
                    accelerator: "CmdOrCtrl+O",
                    click: () => {
                        electron.dialog.showOpenDialog({ properties: [ "openFile", "openDirectory", "multiSelections" ]});
                    }
                },
                {
                    label: "dev",
                    submenu: [
                        {
                            label: "Open dev",
                            accelerator: "CmdOrCtrl+A",
                            click: () => {
                                browserWindow.openDevTools();
                            }
                        },
                        {
                            label: "Close dev",
                            accelerator: "CmdOrCtrl+B",
                            click: () => {
                                browserWindow.closeDevTools();
                            }
                        }          
                    ]
                }
            ]
     }];


    return module;
};
