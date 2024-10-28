const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});



document.addEventListener('DOMContentLoaded', () => {
    //is a way to make sure that your JavaScript
    //only runs after the HTML document has finished loading.

    // Retrieve the user's role from localStorage
    const role = localStorage.getItem('role');
   

    // Define content areas by role
    const rootContent = document.getElementById('rootContent');
    const studentContent = document.getElementById('studentContent');
    const adminContent = document.getElementById('adminContent');

    // Show the relevant content based on the role
    if (role === 'ROOT') {
        rootContent.style.display = 'block';
    } else if (role === 'STUDENT') {
        studentContent.style.display = 'block';
    } else if (role === 'admin') {
        adminContent.style.display = 'ADMIN';
    } else {
        // Handle unknown or missing roles if necessary
        console.error('No valid user role found');
    }
});