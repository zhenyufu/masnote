const {remote, clipboard} = require('electron');
const {Menu, MenuItem, dialog } = remote;
const FileSystem = require("fs");
var exec = require('child_process').exec;
const Config = require('electron-config');
const config = new Config();
const Path = require('path');
//const tinymce = require("tinymce");
/* 
 *  Init
 *  Handlers
 *  Doers 
 *  Getters 
 *  Setters 
 *
 *
 */


////////////////////////////////////////////////////// init {

var buttonArrayNewPage, buttonArrayNewBook, buttonArrayOpenBook, buttonArrayOpenPage, buttonArraySaveBook, buttonArraySaveAll, buttonArraySettings;
var masContent, masFilePath, masCurrentBookIndex, masServerAddress, sidebarContent;
var mceEditor;
var workspacePath = "../workspace";
var bookArray = [];// array of book objects 




/* the book object */
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
 



/* main */
onload = function() {     
    masContent = document.getElementById("mce-main");
    masFilePath = null;
    sidebarContent =  document.getElementById("sidebar-content");
    buttonArrayNewPage = document.getElementsByClassName("mas-new-page");
    buttonArrayNewBook = document.getElementsByClassName("mas-new-book");
    buttonArrayOpenBook = document.getElementsByClassName("mas-open-book");
    buttonArraySaveBook = document.getElementsByClassName("mas-save-book");
    buttonArraySettings = document.getElementsByClassName("mas-settings");
    for(var i = 0; i < buttonArrayNewPage.length; i++){ buttonArrayNewPage.item(i).addEventListener("click", handleButtonNewPage); }
    for(var i = 0; i < buttonArrayNewBook.length; i++){ buttonArrayNewBook.item(i).addEventListener("click", handleButtonNewBook); }
    for(var i = 0; i < buttonArrayOpenBook.length; i++){ buttonArrayOpenBook.item(i).addEventListener("click", handleButtonOpenBook); }
    for(var i = 0; i < buttonArraySaveBook.length; i++){ buttonArraySaveBook.item(i).addEventListener("click", handleButtonSaveBook); }
    for(var i = 0; i < buttonArraySettings.length; i++){ buttonArraySettings.item(i).addEventListener("click", handleButtonSettings); }

    // toggle for enabling saved config
    //getConfig();
    config.clear();

    for(var i = 0; i < bookArray.length; i++){ 
        var temp = bookArray[i];
        bookArray[i] = new Book(temp.path);
        doAddBookToSidebar( bookArray[i]); 
    }

    if (bookArray.length > 0){
        console.log("reloding last book at index" + masCurrentBookIndex.toString());
        doOpenBookIndexPage(getCurrentBook()); // open the last book index page for now 
    }

}




/* on exit */
window.onbeforeunload = function (e) { 
    // set the configs again one last time or only here?     
    setConfig();
    doSaveToFile(mceEditor.getContent(), masFilePath);
}




/* loading whatever saved configs */
function getConfig(){
    workspacePath = config.get("workspacePath") || "";
    bookArray = config.get("bookArray") || bookArray;
    masCurrentBookIndex = config.get("masCurrentBookIndex") || -1;
}




/* saving config stuff */
function setConfig(){
    config.set("workspacePath", workspacePath);
    config.set("bookArray", bookArray);
    config.set("masCurrentBookIndex", masCurrentBookIndex);
}





/* editor init */
tinymce.init({
    selector: 'div#mce-main',
    height: 740,
    resize: false,
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
    */
    init_instance_callback : function(){
        mceEditor = tinymce.get('mce-main');
    }
});




/* resizing for the editor */
window.addEventListener('resize', function(e){
    e.preventDefault();
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
    mceEditor.theme.resizeTo (myWidth - 200, myHeight - 130); ///////////////////////////height resize is hardcoded  
});

////////////////////////////////////////////////////// init }




////////////////////////////////////////////////////// Handlers {

/* creates a page for the currently open book*/
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
                var pageListEle = getPageListEle(getCurrentBook());
                doAddPageToSidebar(getPageOfBook(newName, getCurrentBook()), pageListEle,  getCurrentBook());

         });
     }// onsubmit
   });
}




/* creates a new book and opens the index page */
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




/* the setting button */
function handleButtonSettings(){
    mceEditor.windowManager.open({
    title: 'Settings',
    body: [
        {type: 'textbox', name: 'masWorkspacePath', label:"workspace path", value: workspacePath},
        {type: 'textbox', name: 'serverAddress', label:"Sever Address", value: masServerAddress},
    ],
    onsubmit: function(e) { workspacePath = e.data.masWorkspacePath; }
    });
}




/* open existing page button */
function handleButtonOpenPage() {
    dialog.showOpenDialog({properties: ['openFile']}, function(myPath) { if(myPath) {doOpenPage(myPath.toString()); } });
}




/* open existing book button */
function handleButtonOpenBook() {
    dialog.showOpenDialog({properties:  ['openDirectory']}, function(myPath) { 
        myPath = myPath[0];
        if(myPath) {
            var b = new Book(myPath); 
            // iterate the pages and give that to b
            FileSystem.readdir(myPath, (err, dir) => { //readDir(myPath, function(dir) {
                for(let filePath of dir) {
                    //console.log(filePath);
                    if (filePath != ".git" && filePath != "index.html" && Path.extname(filePath) == ".html" ){
                    b.pageArray.push(filePath);
                    }
                }
                doOpenBook(b);
            });
        } 
    });
}




/* save book button */
function handleButtonSaveBook() {
    // write editor to current file path 
    doSaveToFile(mceEditor.getContent(), masFilePath);
    //mceEditor.getContent();
}

////////////////////////////////////////////////////// Handlers }




////////////////////////////////////////////////////// Doers {

function doSaveToFile(stuff, path){
    FileSystem.writeFile(path, stuff, function (err) {
        if (err) { console.log("Write failed: " + err); }

    });
}




/* given the full path, opens and dispalys the page */
function doOpenPage(myPath){
    FileSystem.readFile(myPath, function (err, data) {
        if (err) { console.log("Read error: " + err); }
        handleButtonSaveBook();////////////////////////////////////saves the current first
        setMasContent(String(data));
        setMasFilePath(myPath);
        //do not add if it is index.html file
        /*
        if(Path.basename(myPath) != "index.html"){
            var pageListEle = getPageListEle(getCurrentBook());
            doAddPageToSidebar(myPath, pageListEle);
        }
        */
    });
}




/* given the book names, opens and displays the book, add it to sidebar if not there */
function doOpenBook(book){
    // if the book is not in the array add the book
    if( getBookIndex(book) == -1 ){
        console.log("book not in the array"); 
        bookArray.push(book);
        doAddBookToSidebar(book);
        masCurrentBookIndex = getBookIndex(book);
        console.log(masCurrentBookIndex);
    }
    else{
        console.log("book is already in the array");
    }
    //doAddPagesToSidebar(book);
    doOpenBookIndexPage(book); //////////////////////////////////////////////should be here right : open either way
}




/* given book name, opens the index page */
function doOpenBookIndexPage(book){
    var p = book.getIndexFile();//getIndexFile(book);
    console.log(p);
    setMasFilePath(getCurrentBook().getIndexFile());
    doOpenPage(p);  
    
}




/* given the thing to add to fa-, creates and returns a element */
function doMakeFont(name){
    var i  = document.createElement('i');
    i.className = "fa fa-" + name;
    doAddCssClass(i,"cs-padding-2");//i.className += " cs-padding-2";
    return i;
}




/* append a css class to the element */
function doAddCssClass(ele, str){
    ele.className += (" " + str);
}




/* 
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
*/




/* given the full path of page, add it to the sidebar */ 
function doAddPageToSidebar(myPath, pageListEle, book){
        var pageEle = document.createElement('li');
        doAddCssClass(pageEle, "left-pad-8");
        setElementId(pageEle, "page", book.getName(), getRemoveExtension(Path.basename(myPath)));

        var pg = doMakeFont("file-o");
        var a = document.createElement('a');
        a.appendChild(pg)
        var linkText = document.createTextNode ( " " + getRemoveExtension(Path.basename(myPath)) );
        a.appendChild(linkText);
        setClickOpenPage(a, myPath);

        pageEle.appendChild(a);
        //insertAfter(pageEle,bookEle);
        pageListEle.appendChild(pageEle);
}



/* add all pages of the given book to the sidebar */
function doAddPagesToSidebar(book){
    var pageListEle = getPageListEle(book); //document.getElementById("display-" + book.getName() + "-pageList");
    console.log(book.pageArray);
    for (var i = 0; i < book.pageArray.length; i++){
        //bookEle.appendChild(pageEle)
        var myPath = book.getPath() + "/" + book.pageArray[i];
        doAddPageToSidebar(myPath, pageListEle, book);   
    
    }
   
}



/* add the given book to the sidebar */
function doAddBookToSidebar(book){
    var bookName = book.getName();//getBookNameFromPath(bookPath);
    
    var li = document.createElement('li');
    li.id = "book-" + bookName + "-index";
    //fa-book
    var bk = doMakeFont("book");
    var a = document.createElement('a');
    a.appendChild(bk)
    
    var linkText = document.createTextNode ( " " + bookName);
    a.appendChild(linkText);
    //a.masLink = book.getIndexFile(); 
    /*
    a.addEventListener("click", function() {
    doOpenPage(book.getIndexFile() );

    });
    */
    setClickOpenPage(a, book.getIndexFile());

    li.appendChild(a);
    //
    //li.appendChild(linkText);
        //a.title = bookName;
    //a.href = "http://example.com";
    
    //fa-refresh
    var font = doMakeFont("refresh");
    doAddCssClass(font, "cs-right");
    li.appendChild(font);
    //
    font = doMakeFont("caret-down");
    setElementId(font, "action", bookName, "down");
    doAddCssClass(font, "cs-right down-arrow");
    font.addEventListener("click", function() { 
        var pList = document.getElementById("display-" + bookName + "-pageList");
        //pList.classList.toggle("show");
        console.log(pList);
        doToggleShowHide(pList);
    });

    li.appendChild(font);
    //the list 
    var pList = document.createElement('div');
    setElementId(pList, "display", bookName, "pageList");
    li.appendChild(pList);


    sidebarContent.appendChild(li);   
    console.log("add book");

    doAddPagesToSidebar(book);

}




/* toggles the display of the given element */
function doToggleShowHide(ele){
    if (ele.style.display !== 'none') {
        ele.style.display = 'none';
    }
    else {
        ele.style.display = 'block';
    }

}

////////////////////////////////////////////////////// Doers }




////////////////////////////////////////////////////// Getters {

/* give the book, return the index in the current bookArray */
function getBookIndex(book) {
    for(var i = 0; i < bookArray.length; i += 1) {
        if(bookArray[i].getName() == book.getName()) {
            return i;
        }
    }
    return -1;
}



/* i given bookname, return the full path from workspace*/
function getBookPath(bookName){
    return  workspacePath + "/" + bookName;
}





/* add indexfile path*/
function getIndexFile(dirPath){
    return dirPath + "/" + "index.html";
}




/* get the current book */
function getCurrentBook(){
    return bookArray[masCurrentBookIndex];
}




/* given the book and pageName, return the actual file path to the html file */
function getPageOfBook(pageName, book){
    return book.getPath() + "/" + pageName + ".html";
}




/* gives the bookPath, returns the bookName */
function getBookNameFromPath(bookPath){
    var temp = bookPath.split("/");
    return temp[temp.length - 1];

}




/* removes the extension */
function getRemoveExtension(file){
   return Path.parse(file).name; 
}




function getPageListEle(book){
    return document.getElementById("display-" + book.getName() + "-pageList");
}

////////////////////////////////////////////////////// Getters }




////////////////////////////////////////////////////// Setters {

/* set the editor to the passed in html, */
function setMasContent(myHtml){
    mceEditor.setContent(myHtml);
    mceEditor.undoManager.clear();//////////////////////////////////////////////////////clears the undo history for now, might want to change it different instences later 
    //console.log(myHtml);
}




function setMasFilePath(myFilePath){
    masFilePath = myFilePath;
    console.log(masFilePath);
}



function setElementId(ele,type,bookName,thing ){
    ele.id = type + "-" + bookName + "-" +  thing;
}




function setClickOpenPage(ele, path){
    ele.addEventListener("click", function() {
     doOpenPage(path);
        // change the last current page color  
        var pName = getRemoveExtension(Path.basename(masFilePath));
        pId = "";

        if (pName == "index"){
            pId = "book-" + getCurrentBook().getName() + "-" + pName;
        }
        else{
            pId = "page-" + getCurrentBook().getName() + "-" + pName;
        }

        
        console.log(path);
        var pLi = document.getElementById(pId)
        if(pLi){
            pLi.style.backgroundColor = "inherit";
            // set the new one 
            ele.parentNode.style.backgroundColor = "#cecece"; 
        }
    });
}

////////////////////////////////////////////////////// Setters }

