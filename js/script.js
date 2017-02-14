const {remote, clipboard} = require('electron');
const {Menu, MenuItem, dialog } = remote;
const FileSystem = require("fs");
var exec = require('child_process').exec;
const Config = require('electron-config');
const config = new Config();
//config.set('unicorn', 'd');
//console.log(config.get('unicorn'));

var buttonArrayNewBook, buttonArrayOpenBook, buttonArrayOpenPage, buttonArraySaveBook, buttonArraySaveAll, buttonArraySettings;
var masContent, masFilePath,sidebarContent;
var mceEditor;

var workspacePath;//"../workspace";
var bookArray = [];
// array of book objects 
// with book name and full path 

onload = function() {     
    masContent = document.getElementById("mce-main");
    //setMasContent("<b>yo</b>");
    masFilePath = null;
    sidebarContent =  document.getElementById("sidebar-content");
     //document.getElementById("mas-open-page").addEventListener("click", handleButtonOpenPage); 

    buttonArrayNewBook = document.getElementsByClassName("mas-new-book");
    buttonArrayOpenBook = document.getElementsByClassName("mas-open-book");
    buttonArrayOpenPage = document.getElementsByClassName("mas-open-page");

    buttonArraySaveBook = document.getElementsByClassName("mas-save-book");
    buttonArraySaveAll = document.getElementsByClassName("mas-save-all");
    
    buttonArraySettings = document.getElementsByClassName("mas-settings");
    for(var i = 0; i < buttonArrayNewBook.length; i++){ buttonArrayNewBook.item(i).addEventListener("click", handleButtonNewBook); }
    for(var i = 0; i < buttonArrayOpenBook.length; i++){ buttonArrayOpenBook.item(i).addEventListener("click", handleButtonOpenBook); }
    for(var i = 0; i < buttonArrayOpenPage.length; i++){ buttonArrayOpenPage.item(i).addEventListener("click", handleButtonOpenPage); }
    //for(var i = 0; i < buttonArraySaveBook.length; i++){ buttonArraySaveBook.item(i).addEventListener("click", handleButtonSaveBook); }
    
    for(var i = 0; i < buttonArraySettings.length; i++){ buttonArraySettings.item(i).addEventListener("click", handleButtonSettings); }

getConfig();
//config.clear();
//config.delete('bookArray');
for(var i = 0; i < bookArray.length; i++){ addBookToSidebar( bookArray[i]); }
}


window.onbeforeunload = function (e) { 
    //alert("dd");
    // set the configs again one last time or only here?     
setConfig();
}


function getConfig(){
    workspacePath = config.get("workspacePath");
    bookArray = config.get("bookArray");
}


function setConfig(){
    config.set("workspacePath", workspacePath);
    config.set("bookArray", bookArray);
}


tinymce.init({
   selector: 'div#mce-main',
   /*fixed_toolbar_container: '#mce-toolbar',
    setup: function (editor) {
        editor.on('blur', function () {
            throw new Error('tiny mce hack workaround');
        });
    },*/
   height: 740,
   menubar: false,
   plugins: [
     'advlist autolink lists link image charmap print preview hr anchor pagebreak',
     'searchreplace wordcount visualblocks visualchars code fullscreen',
     'insertdatetime media nonbreaking save table contextmenu directionality',
     'emoticons template paste textcolor colorpicker textpattern imagetools codesample     toc'
   ],
   toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter       alignright alignjustify | bullist numlist outdent indent | link image',
   toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
 
   /*
    external_plugins: {
     'myplugin': '/js/myplugin/plugin.min.js'
   }
 
      plugins: [
     'advlist autolink lists link image charmap print preview anchor',
     'searchreplace visualblocks code fullscreen',
     'insertdatetime media table contextmenu paste code'
   ],
   toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter        alignright alignjustify | bullist numlist outdent indent | link image',
   //content_css: '//www.tinymce.com/css/codepen.min.css'
     */
    init_instance_callback : function(){
        mceEditor = tinymce.get('mce-main');
    }
});

function getBookPath(bookName){
    return  workspacePath + "/" + bookName;
}

function getIndexFile(dirPath){
    return dirPath + "/" + "index.html";
}

function handleButtonNewBook() {
    setMasContent("");
    mceEditor.windowManager.open({
    title: 'New book',
    body: {type: 'textbox', name:"masName", label:"Enter name"},
    onsubmit: function(e) { 
        var newName = e.data.masName; 
        var newPath = getBookPath(newName); 
        // mkdir 
        exec('mkdir ' + newName, {cwd: workspacePath}, function (error, stdout, stderr){
            console.log("pwd: " + error + " : " + stdout);
            // git init
            exec('git init', {cwd: newPath}, function (error, stdout, stderr){
                console.log("pwd: " + error + " : " + stdout);
            });
            //empty initial file
            FileSystem.writeFile(newPath + "/index.html", " ", function (err) {
                if (err) { console.log("Write failed: " + err); }
            });
        doOpenBook(newPath);

        });
    }// onsubmit
  });
}


// call ed.focus(); if needed 

/*
mceEditor.windowManager.open({
  title: 'Container',
  body: [{
    type: 'container',
    label  : 'flow',
    layout: 'flow',
    items: [
      {type: 'label', text: 'A container'},
      {type: 'textbox', label: 'textbox', value: 'with a textbox'},
      {type: 'textbox', label: 'textboxb', value: 'another  textbox'}
    ]
  }]
});
*/



function handleButtonSettings(){
    mceEditor.windowManager.open({
   title: 'Settings',
   body: {type: 'textbox', name: 'masWorkspacePath', label:"workspace path", value: workspacePath},
   onsubmit: function(e) { workspacePath = e.data.masWorkspacePath; }
 });

}


function handleButtonOpenPage() {
    dialog.showOpenDialog({properties: ['openFile']}, function(myPath) { doOpenPage(myPath.toString()); });
}

function handleButtonOpenBook() {
    dialog.showOpenDialog({properties: ['openiFile']}, function(myPath) { doOpenBook(myPath.toString()); });
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
   //  masContent.innerHTML = myHtml;
   // tinyMCE.activeEditor.
    mceEditor.setContent(myHtml);
    console.log(myHtml);
}

function setMasFilePath(myFilePath){
    masFilePath = myFilePath;
    console.log(masFilePath);
}

function getBookNameFromPath(bookPath){
    var temp = bookPath.split("/");
    return temp[temp.length - 1];

}



function doOpenBook(bookPath){
    if(!bookArray.includes(bookPath)){
        bookArray.push(bookPath);
        addBookToSidebar(bookPath);
    }
    openBookIndexPage(bookPath);
}

function openBookIndexPage(bookPath){
    var p = getIndexFile(bookPath);
    console.log(p);
    doOpenPage(p);  
    
}


function addBookToSidebar(bookPath){
    var bookName = getBookNameFromPath(bookPath);
    
    var li = document.createElement('li');
    //
    var i = document.createElement('i');
    i.className = "fa fa-book";
    li.appendChild(i);
    //
    var linkText = document.createTextNode ( " " + bookName);
    li.appendChild(linkText);
        //a.title = bookName;
    //a.href = "http://example.com";
    sidebarContent.appendChild(li);   
    console.log("add book");

}



