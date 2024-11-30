const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle"),
      sidebar = body.querySelector("nav"),
      sidebarToggle = body.querySelector(".sidebar-toggle");

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

//Student Homepage
//Event Listener for the 'Add' icon click
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("reservedTimesBody");
    const addIcon = document.getElementById("addIcon");

    // Add functionality to the delete buttons in default rows
    tableBody.addEventListener("click", (event) => {
        if (event.target.closest(".remove-button")) {
            const row = event.target.closest("tr");
            tableBody.removeChild(row);
        }
    });

    // Add a new row when the add icon is clicked
    addIcon.addEventListener("click", () => {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td><input type="text" class="form-control-sm" placeholder="Ex: 0900"></td>
            <td><input type="text" class="form-control-sm" placeholder="Ex: 1200"></td>
            <td><input type="text" class="form-control-sm" placeholder="Lunch time"></td>
            <td>
                <button type="button" class="btn btn-link p-0 text-danger remove-button">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(newRow);
    });
});


//Admin user
//admin js
// Array to hold the section data locally
let sections = [];

// Function to render the table rows dynamically
function renderSections() {
    const tableBody = document.getElementById("schedule-table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    sections.forEach((section, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <input type="text" class="form-control" value="${section.departmentId
            }" 
                    onchange="validateDepartmentId(${index}, this.value)" placeholder="Dept ID">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.courseNumber
            }" 
                    onchange="validateCourseNumber(${index}, this.value)" placeholder="Course Number">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.sectionId
            }" 
                    onchange="updateSection(${index}, 'sectionId', this.value)" placeholder="Section ID">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.instructor
            }" 
                    onchange="updateSection(${index}, 'instructor', this.value)" placeholder="Instructor">
            </td>
            <td>
                <div class="form-check form-check-inline">
                    ${generateDaysCheckboxes(index, section.days)}
                </div>
            </td>
            <td>
                <input type="text" class="form-control" value="${section.startTime
            }" 
                    onchange="validateTime(${index}, 'startTime', this.value)" placeholder="Start Time (HHMM)">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.endTime
            }" 
                    onchange="validateTime(${index}, 'endTime', this.value)" placeholder="End Time (HHMM)">
            </td>
            <td>
              <button type="button" class="btn btn-link p-0 text-danger" onclick="deleteSection(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Validate Department ID (exactly 4 characters)
function validateDepartmentId(index, value) {
    if (value.length !== 4) {
        alert("Department ID must be exactly 4 characters.");
        renderSections(); // Reset to the last valid state
    } else {
        updateSection(index, "departmentId", value);
    }
}

// Validate Course Number (exactly 4 digits)
function validateCourseNumber(index, value) {
    const courseNumberRegex = /^\d{4}$/; // Matches exactly 4 digits
    if (!courseNumberRegex.test(value)) {
        alert("Course Number must be exactly 4 digits.");
        renderSections(); // Reset to the last valid state
    } else {
        updateSection(index, "courseNumber", value);
    }
}

// Generate checkboxes for days of the week
function generateDaysCheckboxes(index, selectedDays) {
    const days = ["M", "T", "W", "R", "F"];
    return days
        .map(
            (day) => `
                <label class="form-check-label me-2">
                    <input 
                        type="checkbox" 
                        class="form-check-input" 
                        ${selectedDays.includes(day) ? "checked" : ""} 
                        onchange="toggleDay(${index}, '${day}', this.checked)">
                    ${day}
                </label>`
        )
        .join("");
}

// Toggle a day selection
function toggleDay(index, day, isChecked) {
    const selectedDays = sections[index].days || "";
    if (isChecked) {
        if (!selectedDays.includes(day)) {
            sections[index].days += day;
        }
    } else {
        sections[index].days = selectedDays.replace(day, "");
    }
}

// Function to add a new section row
function addNewSection() {
    sections.push({
        departmentId: "",
        courseNumber: "",
        sectionId: "",
        instructor: "",
        days: "",
        startTime: "",
        endTime: ""
    });
    renderSections();
}

// Function to validate time input (HHMM format only)
function validateTime(index, field, value) {
    const timeRegex = /^([01]\d|2[0-3])([0-5]\d)$/; // Matches HHMM format
    if (!timeRegex.test(value)) {
        alert("Please enter time in HHMM format (24-hour clock).");
        renderSections(); // Reset the input value to the last valid value
    } else {
        updateSection(index, field, value);
    }
}

// Function to update a section in the local array
function updateSection(index, field, value) {
    sections[index][field] = value;
}

// Function to delete a section row
function deleteSection(index) {
    sections.splice(index, 1); // Remove the section from the array
    renderSections();
}

// Function to import sections from a CSV file
function importCSV() {
    const fileInput = document.getElementById("csv-file-input");
    fileInput.click(); // Trigger the hidden file input
}

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const rows = e.target.result.split("\n");

            rows.forEach((row, index) => {
                if (!row.trim()) return; // Skip empty rows

                // Split the row into columns, accounting for quoted fields
                const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
                if (!columns || columns.length < 7) {
                    console.warn(
                        `Row ${index + 1} is invalid or has missing fields. Skipping.`
                    );
                    return;
                }

                const [
                    departmentId,
                    courseNumber,
                    sectionId,
                    instructor,
                    days,
                    startTime,
                    endTime
                ] = columns.map((col) => col.replace(/^"|"$/g, "").trim()); // Trim and remove quotes

                // Debugging logs for each field
                console.log(`Parsed Row ${index + 1}:`, {
                    departmentId,
                    courseNumber,
                    sectionId,
                    instructor,
                    days,
                    startTime,
                    endTime
                });

                // Validate and add to sections array
                if (
                    departmentId &&
                    courseNumber &&
                    sectionId &&
                    instructor &&
                    days &&
                    startTime &&
                    endTime
                ) {
                    sections.push({
                        departmentId,
                        courseNumber,
                        sectionId,
                        instructor,
                        days,
                        startTime,
                        endTime
                    });
                } else {
                    console.warn(
                        `Row ${index + 1} is missing required fields. Skipping.`
                    );
                }
            });

            renderSections(); // Re-render the table with the new data
        };
        reader.readAsText(file);
    } else {
        console.error("No file selected.");
    }
}

// Function to save sections to the backend


// Initial rendering of the table
renderSections();

function saveSections() {
    const tableBody = document.getElementById("schedule-table-body");
    const rows = tableBody.querySelectorAll("tr");

    // Array to hold all section data
    const updatedSections = [];

    // Loop through each row in the table
    rows.forEach(row => {
        const inputs = row.querySelectorAll("input");
        const checkboxes = row.querySelectorAll("input[type='checkbox']");

        const section = {
            departmentId: inputs[0].value,
            courseNumber: inputs[1].value,
            sectionId: inputs[2].value,
            instructor: inputs[3].value,
            days: Array.from(checkboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value),
            startTime: inputs[4].value,
            endTime: inputs[5].value,
        };

        updatedSections.push(section);
    });

    // Send updatedSections to the backend
    // Use Axios to send updatedSections to the backend
    axios.post('https://innovaid.dev/api/schedule', updatedSections, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then(function (response) {
            // Handle successful save
            console.log('Sections saved successfully', response.data);
            alert('Sections saved successfully!');
        })
        .catch(function (error) {
            // Handle errors
            console.error('Error saving sections:', error.response?.data || error.message);
            alert('An error occurred while saving the sections.');
        });
}


//Root User
document.addEventListener('DOMContentLoaded', () => {
    //is a way to make sure that your JavaScript
    //only runs after the HTML document has finished loading.

    // Retrieve the user's role from localStorage
    const role = localStorage.getItem('role');
   

    // Define content areas by role
    const rootContent = document.getElementById('rootContent');
    const studentContent = document.getElementById('studentContent');
    const adminContent = document.getElementById('adminContent');

    // Define navigation menu items
    const navLinks = document.querySelector('.nav-links');

    // Clear existing links
    navLinks.innerHTML = '';



    // Show the relevant content based on the role
    if (role === 'ROOT') {
        rootContent.style.display = 'block';

        navLinks.innerHTML = `  
        <li>
        <a href="#">
            <i class='bx bx-home'></i>
            <span class="link-name">Dashboard</span>
        </a>
    </li>
    <li>
        <a href="#">
            <i class='bx bx-file'></i>
            <span class="link-name">Catalog</span>
        </a>
    </li>
    <li>
        <a href="#">
            <i class='bx bx-cog'></i>
            <span class="link-name">Course Sections</span>
        </a>
    </li>
</ul>


    </li> `;


    } else if (role === 'STUDENT') {
        studentContent.style.display = 'block';
        navLinks.innerHTML = `  
        <li>
        <a href="#">
            <i class='bx bx-home'></i>
            <span class="link-name">HomePage</span>
        </a>
    </li>
    <li>
        <a href="#">
            <i class='bx bx-file'></i>
            <span class="link-name">Saved Schedules</span>
        </a>
    </li>
   
</ul>


    </li> `;

    } else if (role === 'ADMIN') {
        adminContent.style.display = 'block';
        navLinks.innerHTML = `  
        <li>
        <a href="#">
            <i class='bx bx-home'></i>
            <span class="link-name">Course Sections</span>
        </a>
    </li>
    <li>
        <a href="#">
            <i class='bx bx-file'></i>
            <span class="link-name">Catalog</span>
        </a>
    </li>
   
</ul>


    </li> `;
    } else {
        // Handle unknown or missing roles if necessary
        console.error('No valid user role found');
    }
});


//fetch admin/root data from the backend

axios.get('https://innovaid.dev/api/queue', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
        
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
}

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


function allowUser(email) {
    handleDecision(email, true);
}

function denyUser(email) {
    handleDecision(email, false);
}

