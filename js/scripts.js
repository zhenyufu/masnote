const electron = require('electron');
const dialog = electron.dialog;
const FileSystem = require("fs");


// Private Variables
var masContent, masFilePath;

onload = function() {
     masContent = document.getElementById("mce-main");
     //setMasContent("<b>yo</b>");
     masFilePath = null;
    alert(masContent.innerHTML); 
 }


function handleButtonOpenPage() {
     //console.log(masContent.innerHTML);
    dialog.showOpenDialog({properties: ['openFile']}, function(myPath) { doOpenPage(myPath.toString()); });
}

function handleButtonOpenBook() {
    dialog.showOpenDialog({properties: ['openDirectory']}, function(myPath) { doOpenBook(myPath.toString()); });
}

function handleButtonSave() {
    if (masFilePath) {
        doSaveToCurrentFile(masFilePath);
    } 
    else {
        dialog.showSaveDialog(function(myPath) { doSaveToNewFile(myPath.toString()); });
    }
}


// Public

module.exports = {
    masContent: masContent,
    masFilePath: masFilePath,
    handleButtonOpenPage: handleButtonOpenPage,
    handleButtonOpenBook: handleButtonOpenBook,
    handleButtonSave: handleButtonSave,
};
/*
module.exports = masContent;
module.exports = masFilePath;

module.exports = handleButtonOpenPage;
module.exports = handleButtonOpenBook;
module.exports = handleButtonSave;
*/


// Private
function doFileNew(myPath){
    setMasFilePath(null);
}

function doOpenPage(myPath){
    FileSystem.readFile(myPath, function (err, data) {
        if (err) { console.log("Read error: " + err); }
        setMasContent(String(data));
        setMasFilePath(myPath);
    });
}

// helper functions 
function setMasContent(myHtml){
    alert(masContent);
     masContent.innerHTML = myHtml;
}

function setMasFilePath(myFilePath){
    masFilePath = myFilePath;
    console.log(masFilePath);
}

function doOpenBook(myPath){
alert(myPath);

}
