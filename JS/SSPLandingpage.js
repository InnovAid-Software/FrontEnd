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

axios.get('https://innovaid.dev/api/queue', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
        'Content-Type': 'application/json'
    }
})

    .then(response => {
        const queueData = response.data;
        console.log("Queue Data:", queueData);
        populateTable(queueData);  // Call function to populate the table with retrieved data
    })
    .catch(error => console.error("Error fetching data:", error));
   
//function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById('userTableBody');

    // Ensure table body exists before modifying
    if (!tableBody) {
        console.error("Table body element not found");
        return;
    }

    tableBody.innerHTML = '';  // Clear existing rows

    data.forEach(user => {
        // Extract necessary fields from each user object

        const user_email = user.user_email;
        const request_type = user.request_type;

        //create a new row and populate it
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${request_type}</td>
  <td data-user-email="${user_email}">${user_email}</td>
           <td>
               <button type="button" class="btn btn-allow btn-sm" onclick="allowUser('${user_email}')">Allow</button>
               <button type="button" class="btn btn-deny btn-sm" onclick="denyUser('${user_email}')">Deny</button>
           </td>
        
`;




tableBody.appendChild(row);

    });

    function handleDecision(email, approvalStatus) {
        // Create payload with necessary data
        const payload = {
            token: localStorage.getItem("token"),  // Assuming token is stored in local storage
            email: email,
            approval_status: approvalStatus  // 'approvalStatus' should be a boolean (true for approve, false for deny)
        };

        // Send the decision to the backend
        axios.post('https://innovaid.dev/api/queue', payload)

            .then(response => {
                console.log("Decision sent successfully:", response.data);
                // Optionally, update the UI (e.g., remove the row or mark as approved/denied)
                const row = document.querySelector(`td[data-user-email="${email}"]`).parentElement;
                if (row) row.remove();
            })
            .catch(error => console.error("Error sending decision:", error));
    }

}
function allowUser(email) {
    handleDecision(email, true);
}

function denyUser(email) {
    handleDecision(email, false);
}

