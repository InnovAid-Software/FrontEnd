const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle"),
    sidebar = body.querySelector("nav"),
    mainContent = document.querySelector("main");

// Toggle Dark Mode
modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode"); // Changed to 'dark-mode' for specificity
});

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.nav-link i.bx-log-out').parentElement;

    logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        //clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        //redirect
        window.location.href = '../HTML/SSPLoginPage.html';
    })

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
            <td><input type="text" class="form-control-sm" placeholder="Ex: M"></td>
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



// Fetch available courses from the backend and populate the table
const fetchCourses = async () => {
    try {
        const response = await axios.get('https://innovaid.dev/api/catalog/courses', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });

        const courses = response.data;
        const tableBody = document.getElementById('availableCoursesBody');

        // Iterate over the courses and create rows
        courses.forEach(course => {
            const row = document.createElement('tr');

            // Department ID column
            const departmentIdCell = document.createElement('td');
            departmentIdCell.textContent = course.department_id;
            row.appendChild(departmentIdCell);

            // Course number column
            const courseNumberCell = document.createElement('td');
            courseNumberCell.textContent = course.course_number;
            row.appendChild(courseNumberCell);

            // Course title column
            const courseTitleCell = document.createElement('td');
            courseTitleCell.textContent = course.course_title;
            row.appendChild(courseTitleCell);

            // Add icon column
            const addCell = document.createElement('td');
            const addIcon = document.createElement('i');
            addIcon.className = 'fas fa-plus-circle text-success'; // Font Awesome icon
            addIcon.style.cursor = 'pointer';

            // Add click event to icon
            addIcon.addEventListener('click', () => {
                addCourse({
                    departmentId: course.department_id,
                    courseNumber: course.course_number,
                    courseTitle: course.course_title,
                });
            });

            addCell.appendChild(addIcon);
            row.appendChild(addCell);

            // Append row to table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};






// Handle adding a course
const addCourse = ({ departmentId, courseNumber, courseTitle }) => {
    const proposedCoursesBody = document.getElementById('proposedCoursesBody');

    // Create a new row for the selected course
    const row = document.createElement('tr');

    // Department ID column
    const departmentIdCell = document.createElement('td');
    departmentIdCell.textContent = departmentId;
    row.appendChild(departmentIdCell);

    // Course Number column
    const courseNumberCell = document.createElement('td');
    courseNumberCell.textContent = courseNumber;
    row.appendChild(courseNumberCell);

    // Course Title column
    const courseTitleCell = document.createElement('td');
    courseTitleCell.textContent = courseTitle;
    row.appendChild(courseTitleCell);

    // Trash icon column (for removal)
    const trashCell = document.createElement('td');

    // Create the button element for trash icon
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-link p-0 text-danger remove-button';
    removeButton.placeholder = 'Description';

    // Create the trash icon inside the button
    const trashIcon = document.createElement('i');
    trashIcon.className = 'bi bi-trash'; // Bootstrap Icons trash icon
    removeButton.appendChild(trashIcon);

    // Add click event to remove the course
    removeButton.addEventListener('click', () => {
        row.remove(); // Remove the row from the table
        console.log(`Removed course: ${courseTitle}`);
        
    });

    trashCell.appendChild(removeButton);
    row.appendChild(trashCell);

    // Append row to the Proposed Courses table
    proposedCoursesBody.appendChild(row);
};



// Fetch courses on page load
document.addEventListener('DOMContentLoaded', fetchCourses);


function generateSchedules() {
    const proposedCoursesBody = document.getElementById('proposedCoursesBody');
    const reservedTimesBody = document.getElementById('reservedTimesBody');

    // Collect courses data with proper structure
    const selectedCourses = [];
    proposedCoursesBody.querySelectorAll('tr').forEach(row => {
        const department_id = row.querySelector('td:nth-child(1)').textContent.trim();
        const course_number = row.querySelector('td:nth-child(2)').textContent.trim();
        const courseTitle = row.querySelector('td:nth-child(3)').textContent.trim();

        selectedCourses.push({
            department_id,
            course_number,
            title: courseTitle,
        });
    });

    // Collect reserved times with proper structure
    const reserved = [];
    reservedTimesBody.querySelectorAll('tr').forEach(row => {
        const dayInput = row.querySelector('td:nth-child(1) input');
        const startTimeInput = row.querySelector('td:nth-child(2) input');
        const endTimeInput = row.querySelector('td:nth-child(3) input');

        if (startTimeInput && endTimeInput && dayInput) {
            reserved.push({
                days: dayInput.value.split(''),
                start_time: startTimeInput.value,
                end_time: endTimeInput.value,
            });
        }
    });

    const payload = {
        courses: selectedCourses,
        reserved: reserved,
    };

    axios
        .post('https://innovaid.dev/api/schedule/generate', payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            const allSchedules = response.data.map((schedule, index) => ({
                scheduleIndex: index + 1,
                sections: schedule.sections.map(section => [
                    section.section_id,
                    section.department_id,
                    section.course_number,
                    section.instructor,
                    section.days.join(''),
                    section.start_time,
                    section.end_time
                ])
            }));

            // Save all schedules to localStorage
            localStorage.setItem('generatedSchedules', JSON.stringify(allSchedules));

            // Redirect to the schedules page
            window.location.href = '../HTMLStudent/generatedSchedules.html';
        })
        .catch(error => {
            console.error('Error generating schedules:', error);
            alert('Failed to generate schedules. Please try again.');
        });
}



/**

function createScheduleTable(schedule, scheduleIndex, container) {
    // Create table wrapper
    const scheduleWrapper = document.createElement('div');
    scheduleWrapper.className = 'schedule-wrapper mb-4';

    // Create table element
    const table = document.createElement('table');
    table.className = 'table table-bordered text-center';

    // Create table caption
    const caption = document.createElement('caption');
    caption.textContent = `Schedule ${scheduleIndex}`;
    caption.className = 'font-weight-bold mb-2';
    table.appendChild(caption);

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Section', 'Dep. ID', 'Course', 'Instructor', 'Day', 'StartTime', 'EndTime'];

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    schedule.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Create Save button
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn-success mt-2';
    saveButton.textContent = 'Save Schedule';
    saveButton.addEventListener('click', () => {
        saveSchedule(schedule);
    });

    // Append table and button to the wrapper
    scheduleWrapper.appendChild(table);
    scheduleWrapper.appendChild(saveButton);

    // Append the wrapper to the container
    container.appendChild(scheduleWrapper);
}

function saveSchedule(schedule) {
    // Get existing saved schedules from localStorage
    const savedSchedules = JSON.parse(localStorage.getItem('savedSchedules')) || [];

    // Add the current schedule to the saved schedules
    savedSchedules.push(schedule);

    // Update localStorage
    localStorage.setItem('savedSchedules', JSON.stringify(savedSchedules));

    alert('Schedule saved successfully! It will appear on your SavedSchedules page.');
}

**/

















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
    const navLinks = document.querySelector('.navbar-custom .nav.flex-column');

    // Clear existing links
    navLinks.innerHTML = '';



    // Show the relevant content based on the role
    if (role === 'ROOT') {
        rootContent.style.display = 'block';

        navLinks.innerHTML = `  
        <li class="nav-item">
        <a class="nav-link" href="../HTML/SSPLandingpage.html">
            <i class='bx bx-home'></i>
              Dashboard
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="../HTMLRoot/SSPRootCatalogPage.html">
            <i class='bx bx-file'></i>
            Catalog
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="../HTMLRoot/SSPRootCourseSectionsPage.html">
            <i class='bx bx-file'></i>
            Course Sections
        </a>
    </li> `;


    } else if (role === 'STUDENT') {
        studentContent.style.display = 'block';
        navLinks.innerHTML = `  
        <li class="nav-item">
        <a class="nav-link" href="../HTML/SSPLandingpage.html">
            <i class='bx bx-home'></i>
            HomePage
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="../HTMLStudent/SSPStudentSavedSchedulesPage.html">
            <i class='bx bx-file'></i>
           Saved Schedules
        </a>

        <li class="nav-item">
        <a class="nav-link" href="../HTMLStudent/generatedSchedules.html">
            <i class='bx bx-file'></i>
           Generated Schedules
        </a>
 
    </li> `;

    } else if (role === 'ADMIN') {
        adminContent.style.display = 'block';
        navLinks.innerHTML = `  
        <li class="nav-item">
        <a class="nav-link" href="../HTML/SSPLandingpage.html">
            <i class='bx bx-home'></i>
            Course Sections
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="../HTMLAdmin/SSPAdminCatalogPage.html">
            <i class='bx bx-file'></i>
            Catalog
        </a>

    </li> `;
    } else {
        // Handle unknown or missing roles if necessary
        console.error('No valid user role found');
    }
});


// Only fetch queue data if user is ROOT or ADMIN
function fetchQueueData() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (role !== 'ROOT' && role !== 'ADMIN') {
        console.log('Unauthorized: Queue data is only available for ADMIN/ROOT users');
        return;
    }

    if (!token) {
        console.error('No authentication token found');
        return;
    }

    axios.get('https://innovaid.dev/api/queue', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        const queueData = response.data;
        console.log("Queue Data:", queueData);
        populateTable(queueData);
    })
    .catch(error => {
        if (error.response?.status === 401) {
            console.error("Authentication failed - Invalid or expired token");
        } else if (error.response?.status === 403) {
            console.error("Access forbidden - Please check if you have admin/root privileges");
        } else {
            console.error("Error fetching queue data:", error);
        }
    });
}

// Call this function when the page loads, but only if user has appropriate role
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role');
    if (role === 'ROOT' || role === 'ADMIN') {
        fetchQueueData();
    }
});

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
    axios.post('https://innovaid.dev/api/queue', payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
        },
    })
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

// In SSPAdminCatalogJS.js
function saveCourses() {
    const catalogAdmin = courses.map(course => ({
        departmentId: course.departmentId,
        courseNumber: course.courseNumber,
        courseTitle: course.courseTitle,
    }));

    if (catalogAdmin.length === 0) {  // Fixed: using catalogAdmin instead of payload
        alert("No courses to save.");
        return;
    }

    axios.post("https://innovaid.dev/api/catalog/courses", catalogAdmin, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        console.log("Catalog Courses saved successfully:", response.data);
        alert("Courses saved successfully!");
    })
    .catch(error => {
        console.error("Error saving catalog courses:", error.response?.data || error.message);
        alert("An error occurred while saving the catalog courses.");
    });
}
function getSections() {
    axios.get("https://innovaid.dev/api/catalog/courses/sections", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then(response => {
        // Update the local sections array with the fetched data
        sections = response.data.map(section => ({
            departmentId: section.departmentId,
            courseNumber: section.courseNumber,
            courseTitle: section.courseTitle,
            sectionId: section.sectionId,
            instructor: section.instructor,
            days: section.days || "", // Handle days being null or missing
            startTime: section.startTime,
            endTime: section.endTime,
        }));

        // Re-render the table with the updated sections
        renderSections();

        console.log("Sections fetched successfully:", response.data);
        alert("Sections fetched and updated successfully!");
    })
    .catch(error => {
        console.error("Error fetching sections:", error.response?.data || error.message);
        alert("An error occurred while fetching the sections.");
    });
}


