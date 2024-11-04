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
    } else if (role === 'ADMIN') {
        adminContent.style.display = 'block';
    } else {
        // Handle unknown or missing roles if necessary
        console.error('No valid user role found');
    }
});


//fetch admin/root data from the backend

axios.get('https://innovaid.dev/api/user/queue', {
    headers: {
        Authorization: 'Bearer ${localStorage.getItem("token")}'
    }
})

    .then(response => {
        const users = response.data.users; 
        populateTable(users);
    })
    .catch(error => console.error("Error fetching data:", error));

//function to populate the table
function populateTable(users) {
    const tableBody = document.getElementById('userTableBody');

    users.forEach(user => {
        // Extract necessary fields from each user object

        const user_email = user.user_email;
        const request_type = user.request_type;

        //create a new row and populate it
        const row = document.createElement('tr');

        row.innerHTML = `
    <td data-user_email="${user_email}">${user_email}</td>
    <td data-request_type="${request_type}">${request_type}</td>
    <td>
        <button type="button" class="btn btn-allow btn-sm" onclick="handleDecision('${user_email}', '${request_type}', 'allow')">Allow</button>
        <button type="button" class="btn btn-deny btn-sm" onclick="handleDecision('${user_email}', '${request_type}', 'deny')">Deny</button>
    </td>
`;




tableBody.appendChild(row);

     });

}


