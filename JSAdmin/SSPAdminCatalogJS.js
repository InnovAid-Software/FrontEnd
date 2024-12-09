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

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();
            if (!row) continue; // Skip empty rows

            const columns = row.split(",").map(col => col.trim());
            
            // We only need the first 3 columns for courses
            if (columns.length >= 3) {
                const [departmentId, courseNumber, courseTitle] = columns;

                // Create unique key for the course
                const courseKey = `${departmentId}-${courseNumber}`;

                // Only add if we haven't seen this course before
                if (!coursesMap.has(courseKey)) {
                    // Validate department ID and course number
                    if (!/^[a-zA-Z]{4}$/.test(departmentId)) {
                        console.warn(`Invalid Department ID: ${departmentId} in row ${i + 1}`);
                        continue;
                    }
                    if (!/^\d{4}$/.test(courseNumber)) {
                        console.warn(`Invalid Course Number: ${courseNumber} in row ${i + 1}`);
                        continue;
                    }

                    coursesMap.set(courseKey, {
                        departmentId,
                        courseNumber,
                        courseTitle
                    });
                }
            }
        }

        // Convert map to array and update the courses array
        courses = Array.from(coursesMap.values());
        renderCourses(); // Update the table display

        // Save to backend
        saveCourseData(courses);
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
        alert("Courses imported and saved successfully!");
    })
    .catch(error => {
        console.error("Error saving courses:", error.response?.data || error.message);
        alert("Error saving courses. Please check the console for details.");
    });
}
function getCatalog() {
    axios.get("https://innovaid.dev/api/catalog/courses", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then(response => {
       
        console.log("Raw API response:", response.data); // Inspect the raw API data

        // Update the local courses array with the fetched data
        courses = response.data.map(course => ({
            departmentId: course.departmentId || course.department_id || "", 
            courseNumber: course.courseNumber || course.course_number || "", 
            courseTitle: course.courseTitle || course.course_title || "",    
        }));

        // Debug the processed courses array
        console.log("Processed courses:", courses); // Check the mapped array

        // Re-render the table with the updated courses
        renderCourses();
        console.log("Catalog fetched successfully:", response.data);
        alert("Catalog fetched and updated successfully!");
    })
    .catch(error => {
        console.error("Error fetching catalog:", error.response?.data || error.message);
        alert("An error occurred while fetching the catalog.");
    });
}


// Initial rendering of the table
renderCourses();