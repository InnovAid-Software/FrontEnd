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
                <input type="text" class="form-control" value="${section.departmentId}" 
                    onchange="updateSection(${index}, 'departmentId', this.value)" placeholder="Department">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.courseNumber}" 
                    onchange="updateSection(${index}, 'courseNumber', this.value)" placeholder="Course #">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.courseTitle}" 
                    onchange="updateSection(${index}, 'courseTitle', this.value)" placeholder="Course Title">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.sectionId}" 
                    onchange="updateSection(${index}, 'sectionId', this.value)" placeholder="Section #">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.instructor}" 
                    onchange="updateSection(${index}, 'instructor', this.value)" placeholder="Instructor">
            </td>
            <td>
                <div class="form-check form-check-inline">
                    ${generateDaysCheckboxes(index, section.days)}
                </div>
            </td>
            <td>
                <input type="text" class="form-control" value="${section.startTime}" 
                    onchange="validateTime(${index}, 'startTime', this.value)" placeholder="Start Time (HHMM)">
            </td>
            <td>
                <input type="text" class="form-control" value="${section.endTime}" 
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

// Function to update a section in the local array
function updateSection(index, field, value) {
    sections[index][field] = value;
}

// Generate checkboxes for days of the week
function generateDaysCheckboxes(index, selectedDays) {
    const days = ["M", "T", "W", "R", "F"];
    return days
        .map(day => `
            <label class="form-check-label me-2">
                <input type="checkbox" class="form-check-input" 
                    ${selectedDays.includes(day) ? "checked" : ""} 
                    onchange="toggleDay(${index}, '${day}', this.checked)">
                ${day}
            </label>
        `).join("");
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

// Function to validate time input (HHMM format only)
function validateTime(index, field, value) {
    const timeRegex = /^([01]\d|2[0-3])([0-5]\d)$/; // Matches HHMM format
    if (!timeRegex.test(value)) {
        alert("Please enter time in HHMM format (24-hour clock).");
        renderSections(); // Reset to the last valid value
    } else {
        updateSection(index, field, value);
    }
}

// Function to add a new section row
function addNewSection() {
    sections.push({
        departmentId: "",
        courseNumber: "",
        courseTitle: "",
        sectionId: "",
        instructor: "",
        days: "",
        startTime: "",
        endTime: "",
    });
    renderSections();
}

// Function to delete a section row
function deleteSection(index) {
    sections.splice(index, 1);
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
            sections = []; // Clear existing sections

            // Skip header row
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (!row) continue; // Skip empty rows

                const columns = row.split(",").map(col => col.trim());
                if (columns.length < 8) {
                    console.warn(`Row ${i + 1} is invalid or has missing fields.`);
                    continue;
                }

                const [departmentId, courseNumber, courseTitle, sectionId, instructor, days, startTime, endTime] = columns;

                // Convert days string (e.g., "MW") into an array of individual days
                const daysArray = days.split("").filter(day => "MTWRF".includes(day));

                sections.push({
                    departmentId,
                    courseNumber,
                    courseTitle,
                    sectionId,
                    instructor,
                    days: daysArray.join(""),  // Store as string for compatibility with existing code
                    startTime,
                    endTime,
                });
            }

            renderSections();
        };
        reader.readAsText(file);
    }
}

// Function to save sections to the backend
function saveSections() {
    const tableBody = document.getElementById("schedule-table-body");
    const rows = tableBody.querySelectorAll("tr");

    const updatedSections = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll("input[type='text']");
        const checkboxes = row.querySelectorAll("input[type='checkbox']");

        // Get checked days
        const selectedDays = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.parentElement.textContent.trim())
            .join("");

        const section = {
            departmentId: inputs[0].value,
            courseNumber: inputs[1].value,
            courseTitle: inputs[2].value,
            sectionId: inputs[3].value,
            instructor: inputs[4].value,
            days: selectedDays,
            startTime: inputs[5].value,
            endTime: inputs[6].value,
        };

        updatedSections.push(section);
    });

    axios.post('https://innovaid.dev/api/catalog/courses/sections', updatedSections, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then(response => {
        console.log('Sections saved successfully', response.data);
        alert('Sections saved successfully!');
    })
    .catch(error => {
        console.error('Error saving sections:', error.response?.data || error.message);
        alert('An error occurred while saving the sections.');
    });
}
function getSections() {
    axios.get("https://innovaid.dev/api/catalog/courses/sections/all", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    .then(response => {
        // Update the local sections array with the fetched data
        sections = response.data.map(section => ({
            departmentId: section.department_id,
            courseNumber: section.course_number,
            courseTitle: section.course_title,
            sectionId: section.section_id,
            instructor: section.instructor,
            days: section.days || "", // Handle days being null or missing
            startTime: section.start_time,
            endTime: section.end_time
        }));

        renderSections();
        console.log("Sections fetched successfully:", response.data);
        alert("Sections fetched and updated successfully!");
    })
    .catch(error => {
        console.error("Error fetching sections:", error.response?.data || error.message);
        alert("An error occurred while fetching the sections.");
    });
}


// Initial rendering of the table
renderSections();
