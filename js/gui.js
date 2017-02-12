/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction(name) {
    closeDropdown();
    str = "menu-dropdown-" + name;
    document.getElementById(str).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    closeDropdown();
  }
}

function closeDropdown(){
var dropdowns = document.getElementsByClassName("dropdown-content");
     for (var d = 0; d < dropdowns.length; d++) {
       var openDropdown = dropdowns[d];
       if (openDropdown.classList.contains('show')) {
         openDropdown.classList.remove('show');
       }
     }


}
