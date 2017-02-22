const {remote, clipboard} = require('electron');
const {Menu, MenuItem, dialog } = remote;
const FileSystem = require("fs");
var exec = require('child_process').exec;
const Config = require('electron-config');
const config = new Config();
const Path = require('path');

//config.set('unicorn', 'd');
//console.log(config.get('unicorn'));

var buttonArrayNewPage, buttonArrayNewBook, buttonArrayOpenBook, buttonArrayOpenPage, buttonArraySaveBook, buttonArraySaveAll, buttonArraySettings;
var masContent, masFilePath, masCurrentBookIndex, sidebarContent;
var mceEditor;

var workspacePath;//"../workspace";
var bookArray = [];
// array of book objects 
// with book name and full path 

function Book (path) {
    this.name = Path.parse(path).base;
    this.path = path;
    this.upstream = "";
    this.getName = function(){return this.name;};
    this.getPath = function(){return this.path;};
    this.getUpstream = function(){return this.Upstream;};
    this.getIndexFile = function(){return this.path + "/" + "index.html";};
    this.pageArray = [];
}
 




onload = function() {     
    masContent = document.getElementById("mce-main");
    //setMasContent("<b>yo</b>");
    masFilePath = null;
    sidebarContent =  document.getElementById("sidebar-content");
     //document.getElementById("mas-open-page").addEventListener("click", handleButtonOpenPage); 
    buttonArrayNewPage = document.getElementsByClassName("mas-new-page");

    buttonArrayNewBook = document.getElementsByClassName("mas-new-book");
    buttonArrayOpenBook = document.getElementsByClassName("mas-open-book");
    //buttonArrayOpenPage = document.getElementsByClassName("mas-open-page");

    buttonArraySaveBook = document.getElementsByClassName("mas-save-book");
    //buttonArraySaveAll = document.getElementsByClassName("mas-save-all");
    
    buttonArraySettings = document.getElementsByClassName("mas-settings");
    for(var i = 0; i < buttonArrayNewPage.length; i++){ buttonArrayNewPage.item(i).addEventListener("click", handleButtonNewPage); }

    for(var i = 0; i < buttonArrayNewBook.length; i++){ buttonArrayNewBook.item(i).addEventListener("click", handleButtonNewBook); }
    for(var i = 0; i < buttonArrayOpenBook.length; i++){ buttonArrayOpenBook.item(i).addEventListener("click", handleButtonOpenBook); }
    //for(var i = 0; i < buttonArrayOpenPage.length; i++){ buttonArrayOpenPage.item(i).addEventListener("click", handleButtonOpenPage); }
    for(var i = 0; i < buttonArraySaveBook.length; i++){ buttonArraySaveBook.item(i).addEventListener("click", handleButtonSaveBook); }
    
    for(var i = 0; i < buttonArraySettings.length; i++){ buttonArraySettings.item(i).addEventListener("click", handleButtonSettings); }

//getConfig();
config.clear();
//config.delete('bookArray');
        for(var i = 0; i < bookArray.length; i++){ 
            var temp = bookArray[i];
            bookArray[i] = new Book(temp.path);
            addBookToSidebar( bookArray[i]); 
        }

        if (bookArray.length > 0){
            console.log("reloding last book at index" + masCurrentBookIndex.toString());
            //doOpenBook(bookArray[masCurrentBookIndex]);
            openBookIndexPage(getCurrentBook()); // open the last book index page for now 
        }


}

window.onbeforeunload = function (e) { 
    //alert("dd");
    // set the configs again one last time or only here?     
setConfig();
doSaveToFile(mceEditor.getContent(), masFilePath);
}


function getConfig(){
    workspacePath = config.get("workspacePath") || "";
    bookArray = config.get("bookArray") || bookArray;
    masCurrentBookIndex = config.get("masCurrentBookIndex") || -1;
}



function setConfig(){
    config.set("workspacePath", workspacePath);
    config.set("bookArray", bookArray);
    config.set("masCurrentBookIndex", masCurrentBookIndex);
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
     'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
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

function getCurrentBook(){
    return bookArray[masCurrentBookIndex];
}


function handleButtonNewPage(){
     setMasContent("");
     mceEditor.windowManager.open({
     title: 'New Page',
     body: {type: 'textbox', name:"masName", label:"Enter name"},
     onsubmit: function(e) {
         var newName = e.data.masName;
         var newPath = getCurrentBook().getPath();
         // mkdir 
         exec('cd ' + newPath, function (error, stdout, stderr){
             console.log("pwd: " + error + " : " + stdout);
             FileSystem.writeFile(newPath + "/" + newName + ".html", " ", function (err) {
                 if (err) { console.log("Write failed: " + err); }
             });
             doOpenPage(getPageOfBook(newName, getCurrentBook()));
         });
     }// onsubmit
   });


}


function getPageOfBook(pageName, book){
    return book.getPath() + "/" + pageName + ".html";
}

function handleButtonNewBook() {
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
            //success 
            var b = new Book(newPath);
            //bookArray.push(b);
            
            setMasContent("");
            doOpenBook(b);

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
    dialog.showOpenDialog({properties: ['openFile']}, function(myPath) { if(myPath) {doOpenPage(myPath.toString()); } });
}

function handleButtonOpenBook() {
    dialog.showOpenDialog({properties:  ['openDirectory']}, function(myPath) { 
        myPath = myPath[0];
        if(myPath) {
            //
            var b = new Book(myPath); 
            // iterate the pages and give that to b
            FileSystem.readdir(myPath, (err, dir) => { //readDir(myPath, function(dir) {
                for(let filePath of dir) {
                    //console.log(filePath);
                    b.pageArray.push(filePath);
                }

                    doOpenBook(b);
            });


        } 
    });
}

function handleButtonSaveBook() {
    // write editor to current file path 
    doSaveToFile(mceEditor.getContent(), masFilePath);
    //mceEditor.getContent();
}



function doSaveToFile(stuff, path){

FileSystem.writeFile(path, stuff, function (err) {
        if (err) { console.log("Write failed: " + err); }

    });

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

function findBookIndex(book) {
    for(var i = 0; i < bookArray.length; i += 1) {
        if(bookArray[i].getName() == book.getName()) {
            return i;
        }
    }
    return -1;
}


function doOpenBook(book){
    // if the book is not in the array add the book
    if( findBookIndex(book) == -1 ){
        console.log("book not in the array"); 
        bookArray.push(book);
        addBookToSidebar(book);
        masCurrentBookIndex = findBookIndex(book);
        console.log(masCurrentBookIndex);
    }
    else{
        console.log("book is already in the array");
    }
    //addPagesToSidebar(book);
    openBookIndexPage(book); //////////////////////////////////////////////should be here right : open either way
}

function openBookIndexPage(book){
    var p = book.getIndexFile();//getIndexFile(book);
    console.log(p);
    doOpenPage(p);  
    
}


function makeFont(name){
    var i  = document.createElement('i');
    i.className = "fa fa-" + name;
    addCssClass(i,"cs-padding-2");//i.className += " cs-padding-2";
    return i;
}

function addCssClass(ele, str){
    ele.className += (" " + str);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addPagesToSidebar(book){
    var bookEle = document.getElementById(book.getName());
    console.log("haaaaaaaa " + book.pageArray.length); 
    for (var i = 0; i < book.pageArray.length; i++){
        console.log(book.pageArray[i]);
        var pageEle = document.createElement('li');
        addCssClass(pageEle, "left-pad-8");
        var pg = makeFont("file-o");
        var a = document.createElement('a');
        a.appendChild(pg)
        var linkText = document.createTextNode ( " " + book.pageArray[i]);
        a.appendChild(linkText);

        pageEle.appendChild(a);
        insertAfter(pageEle,bookEle);

        //bookEle.appendChild(pageEle)
    }
   
}



function addBookToSidebar(book){
    var bookName = book.getName();//getBookNameFromPath(bookPath);
    
    var li = document.createElement('li');
    li.id = bookName;
    //fa-book
    var bk = makeFont("book");
    var a = document.createElement('a');
    a.appendChild(bk)
    
    var linkText = document.createTextNode ( " " + bookName);
    a.appendChild(linkText);


    li.appendChild(a);
    //
    //li.appendChild(linkText);
        //a.title = bookName;
    //a.href = "http://example.com";
    
    //fa-refresh
    var font = makeFont("refresh");
    addCssClass(font, "cs-right");
    li.appendChild(font);
    //
    font = makeFont("caret-down");
    addCssClass(font, "cs-right");
    li.appendChild(font);

    sidebarContent.appendChild(li);   
    console.log("add book");

    addPagesToSidebar(book);

}



