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
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const rows = e.target.result.split("\n");
            rows.forEach((row) => {
                const [departmentId, courseNumber, courseTitle] = row.split(",");
                if (departmentId && courseNumber && courseTitle) {
                    courses.push({
                        departmentId: departmentId.trim(),
                        courseNumber: courseNumber.trim(),
                        courseTitle: courseTitle.trim()
                    });
                }
            });
            renderCourses();
        };
        reader.readAsText(file);
    }
}


// Initial rendering of the table
renderCourses();

// Function to save courses to the backend
function saveCourses() {
    const catalogData = courses.map(course => ({
        departmentId: course.departmentId,
        courseNumber: course.courseNumber,
        courseTitle: course.courseTitle,
    }));

    if (catalogData.length === 0) {
        alert("No courses to save.");
        return;
    }

    axios.post("https://innovaid.dev/api/catalog/courses", catalogData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
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