
const {remote, clipboard} = require('electron');
const {Menu, MenuItem, dialog } = remote;
const FileSystem = require("fs");
var exec = require('child_process').exec;

var buttonArrayNewBook, buttonArrayOpenBook, buttonArraySaveBook, buttonArraySaveAll, buttonArraySettings;
var masContent, masFilePath;
var mceEditor;
var workspacePath = "../workspace";

onload = function() {
     
     masContent = document.getElementById("mce-main");
     //setMasContent("<b>yo</b>");
     masFilePath = null;
    
     //document.getElementById("mas-open-page").addEventListener("click", handleButtonOpenPage); 

    buttonArrayNewBook = document.getElementsByClassName("mas-new-book");
    buttonArrayOpenBook = document.getElementsByClassName("mas-open-book");
    buttonArraySaveBook = document.getElementsByClassName("mas-save-book");
    buttonArraySaveAll = document.getElementsByClassName("mas-save-all");
    
    buttonArraySettings = document.getElementsByClassName("mas-settings");
    for(var i = 0; i < buttonArrayNewBook.length; i++){ buttonArrayNewBook.item(i).addEventListener("click", handleButtonNewBook); }
    for(var i = 0; i < buttonArraySettings.length; i++){ buttonArraySettings.item(i).addEventListener("click", handleButtonSettings); }



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


 function handleButtonNewBook() {
     alert("hi");
     setMasContent("");
    // mkdir
    // git init
    exec('git status', {cwd: '../test'}, function (error, stdout, stderr){
          // result
          console.log("pwd: " + error + " : " + stdout);
      });


mceEditor.windowManager.open({
  title: 'Test Container',
  body: {type: 'textbox', name: 'my_textbox', label  : 'My textbox'},
  onsubmit: function(e) {alert(e.data.my_textbox)}
});
// call ed.focus(); if needed 


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



 }

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

function doOpenBook(myPath){
alert(myPath);

}
