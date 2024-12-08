//admin js
// Array to hold the course data locally
let courses = [];

// Function to render the table rows dynamically
function renderCourses() {
    const tableBody = document.getElementById("course-table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    courses.forEach((course, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <input type="text" class="form-control" value="${course.departmentId}" 
                    onchange="updateCourse(${index}, 'departmentId', this.value)" placeholder="Dept ID">
            </td>
            <td>
                <input type="text" class="form-control" value="${course.courseNumber}" 
                    onchange="updateCourse(${index}, 'courseNumber', this.value)" placeholder="Course Number">
            </td>
            <td>
                <input type="text" class="form-control" value="${course.courseTitle}" 
                    onchange="updateCourse(${index}, 'courseTitle', this.value)" placeholder="Course Title">
            </td>
            <td>
                <button type="button" class="btn btn-link p-0 text-danger" onclick="deleteCourse(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to add a new course row
function addNewCourse() {
    courses.push({
        departmentId: "",
        courseNumber: "",
        courseTitle: ""
    });
    renderCourses();
}

// Function to update a course in the local array
function updateCourse(index, field, value) {
    if (field === "departmentId" && !/^[a-zA-Z]{4}$/.test(value)) {
        alert("Department ID must be exactly 4 characters.");
        return;
    }
    if (field === "courseNumber" && !/^\d{4}$/.test(value)) {
        alert("Course Number must be exactly 4 digits.");
        return;
    }
    courses[index][field] = value;
}

// Function to delete a course row
function deleteCourse(index) {
    courses.splice(index, 1); // Remove the course from the array
    renderCourses();
}

// Function to import courses from a CSV file
function importCSV() {
    const fileInput = document.getElementById("csv-file-input");
    fileInput.click(); // Trigger the hidden file input
}

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const rows = e.target.result.split("\n");
        const coursesMap = new Map(); // To track unique courses
        const sectionsData = [];

        rows.forEach((row, index) => {
            if (!row.trim()) return; // Skip empty rows

            const columns = row.split(",").map(col => col.trim());
            
            // Check if we have enough columns for a section entry
            if (columns.length >= 8) {
                const [departmentId, courseNumber, courseTitle, sectionId, instructor, days, startTime, endTime] = columns;

                // Add to courses map if not already present
                const courseKey = `${departmentId}-${courseNumber}`;
                if (!coursesMap.has(courseKey)) {
                    coursesMap.set(courseKey, {
                        departmentId,
                        courseNumber,
                        courseTitle
                    });
                }

                // Add to sections array
                sectionsData.push({
                    departmentId,
                    courseNumber,
                    courseTitle,
                    sectionId,
                    instructor,
                    days,
                    startTime,
                    endTime
                });
            } else {
                console.warn(`Row ${index + 1} has insufficient columns. Expected 8, got ${columns.length}`);
            }
        });

        // Convert courses map to array
        const coursesData = Array.from(coursesMap.values());

        // Save courses to backend
        saveCourseData(coursesData);

        // Save sections to backend
        saveSectionData(sectionsData);
    };

    reader.readAsText(file);
}

function saveCourseData(coursesData) {
    axios.post("https://innovaid.dev/api/catalog/courses", coursesData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.log("Courses saved successfully:", response.data);
    })
    .catch(error => {
        console.error("Error saving courses:", error.response?.data || error.message);
    });
}

function saveSectionData(sectionsData) {
    axios.post("https://innovaid.dev/api/catalog/courses/sections", sectionsData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.log("Sections saved successfully:", response.data);
    })
    .catch(error => {
        console.error("Error saving sections:", error.response?.data || error.message);
    });
}

// Initial rendering of the table
renderCourses();