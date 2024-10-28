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
    // Retrieve the user's role from localStorage
    const userRole = localStorage.getItem('role');

    // Define content areas by role
    const rootContent = document.getElementById('rootContent');
    const studentContent = document.getElementById('studentContent');
    const adminContent = document.getElementById('adminContent');

    // Show the relevant content based on the role
    if (userRole === 'root') {
        rootContent.style.display = 'block';
    } else if (userRole === 'student') {
        studentContent.style.display = 'block';
    } else if (userRole === 'admin') {
        adminContent.style.display = 'block';
    } else {
        // Handle unknown or missing roles if necessary
        console.error('No valid user role found');
    }
});