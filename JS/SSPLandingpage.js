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

        const coursesList = document.getElementById('availableCoursesList');
        coursesList.innerHTML = '';

        response.data.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'list-group-item course-item';
            courseElement.innerHTML = `
                <div class="course-info">
                    <div class="course-code">${course.department_id} ${course.course_number}</div>
                    <div class="course-title">${course.course_title}</div>
                </div>
                <button class="btn btn-sm btn-outline-primary add-course">
                    <i class="bi bi-plus-lg"></i>
                </button>
            `;

            courseElement.querySelector('.add-course').addEventListener('click', () => {
                addCourse(course);
            });

            coursesList.appendChild(courseElement);
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
};

const addCourse = (course) => {
    const selectedList = document.getElementById('selectedCoursesList');
    const courseId = `${course.department_id}-${course.course_number}`;

    if (!document.getElementById(courseId)) {
        const courseElement = document.createElement('div');
        courseElement.className = 'list-group-item course-item';
        courseElement.id = courseId;
        courseElement.innerHTML = `
            <div class="course-info">
                <div class="course-code">${course.department_id} ${course.course_number}</div>
                <div class="course-title">${course.course_title}</div>
            </div>
            <button class="btn btn-sm btn-outline-danger remove-course">
                <i class="bi bi-trash"></i>
            </button>
        `;

        courseElement.querySelector('.remove-course').addEventListener('click', () => {
            selectedList.removeChild(courseElement);
            updateSelectedCount();
        });

        selectedList.appendChild(courseElement);
        updateSelectedCount();
    }
};

const updateSelectedCount = () => {
    const count = document.getElementById('selectedCoursesList').children.length;
    document.getElementById('selectedCount').textContent = count;
};

// Reserved Times Management
// Add time validation function
function validateTimeFormat(timeString) {
    const timeRegex = /^([01]\d|2[0-3])([0-5]\d)$/; // Matches HHMM format
    return timeRegex.test(timeString);
}

// Update the addTimeBtn click handler
document.getElementById('addTimeBtn').addEventListener('click', () => {
    const timesList = document.getElementById('reservedTimesList');
    const timeSlot = document.createElement('div');
    timeSlot.className = 'list-group-item time-slot';
    timeSlot.innerHTML = `
        <input type="text" class="form-control form-control-sm" placeholder="Days (M,T,W,R,F)" maxlength="5">
        <input type="text" class="form-control form-control-sm time-input" placeholder="Start (HHMM)" 
            onchange="validateTimeInput(this)">
        <input type="text" class="form-control form-control-sm time-input" placeholder="End (HHMM)"
            onchange="validateTimeInput(this)">
        <button class="btn btn-sm btn-outline-danger">
            <i class="bi bi-trash"></i>
        </button>
    `;

    timeSlot.querySelector('.btn-outline-danger').addEventListener('click', () => {
        timesList.removeChild(timeSlot);
    });

    timesList.appendChild(timeSlot);
});

// Add time validation handler
function validateTimeInput(input) {
    const value = input.value;
    if (!validateTimeFormat(value)) {
        alert("Please enter time in HHMM format (24-hour clock).");
        input.value = '';
        input.focus();
    }
}

// Search Functionality
document.getElementById('courseSearch').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const courses = document.querySelectorAll('#availableCoursesList .course-item');
    
    courses.forEach(course => {
        const text = course.textContent.toLowerCase();
        course.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchCourses();
});



// Fetch courses on page load
document.addEventListener('DOMContentLoaded', fetchCourses);


function generateSchedules() {
    const selectedCoursesList = document.getElementById('selectedCoursesList');
    const reservedTimesList = document.getElementById('reservedTimesList');

    // Collect courses data
    const selectedCourses = [];
    selectedCoursesList.querySelectorAll('.course-item').forEach(item => {
        const courseCode = item.querySelector('.course-code').textContent;
        const [department_id, course_number] = courseCode.split(' ');
        const courseTitle = item.querySelector('.course-title').textContent;

        selectedCourses.push({
            department_id,
            course_number,
            title: courseTitle,
        });
    });

    // Collect reserved times
    const reserved = [];
    reservedTimesList.querySelectorAll('.time-slot').forEach(slot => {
        const inputs = slot.querySelectorAll('input');
        const days = inputs[0].value;
        const startTime = inputs[1].value;
        const endTime = inputs[2].value;

        if (days && startTime && endTime) {
            reserved.push({
                days: days.split(''),
                start_time: startTime,
                end_time: endTime,
            });
        }
    });

    const payload = {
        courses: selectedCourses,
        reserved: reserved,
    };

    axios.post('https://innovaid.dev/api/schedule/generate', payload, {
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

        localStorage.setItem('generatedSchedules', JSON.stringify(allSchedules));
        window.location.href = '../HTMLStudent/generatedSchedules.html';
    })
    .catch(error => {
        console.error('Error generating schedules:', error);
        
        // Handle specific error messages from the backend
        if (error.response && error.response.status === 404) {
            const message = error.response.data.message;
            
            if (message.includes('No sections found for')) {
                // Extract course info from error message
                const courseInfo = message.split('No sections found for ')[1];
                alert(`No available sections found for ${courseInfo}. Please choose different courses.`);
            } else if (message.includes('No valid schedules found')) {
                alert('Unable to generate schedules: All possible combinations have time conflicts. Please adjust your course selection or reserved times.');
            } else if (message.includes('No possible schedule combinations')) {
                alert('No possible schedules could be generated with your selected courses. Please try different combinations.');
            } else {
                alert('Failed to generate schedules. Please check your course selection and try again.');
            }
        } else {
            alert('An error occurred while generating schedules. Please try again.');
        }
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
        <a class="nav-link" href="../HTMLAdmin/SSPAdminCourseSectionsPage.html">
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


