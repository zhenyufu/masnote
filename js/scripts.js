
const {remote, clipboard} = require('electron');
const {Menu, MenuItem, dialog } = remote;
const FileSystem = require("fs");
const Dialogs = require('dialogs');

var masContent, masFilePath;

onload = function() {
     masContent = document.getElementById("mce-main");
     setMasContent("<b>yo</b>");
     masFilePath = null;
    alert(masContent.innerHTML); 
 }


function handleButtonOpenPage() {
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
