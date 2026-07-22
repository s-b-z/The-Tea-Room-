// Store the home-page Menu button in a variable
const menuButton = document.getElementById("menu-btn");

// Only run the click code if the button exists on this page
if (menuButton) {
  // Listen for a click on the Menu button
  menuButton.addEventListener("click", function () {
    // Send the user to the menu page
    window.location.href = "menu.html";
  });
}
