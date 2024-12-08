// JavaScript source code
document.addEventListener('DOMContentLoaded', () => {
    const schedulesContainer = document.getElementById('schedulesContainer');
    const schedules = JSON.parse(localStorage.getItem('generatedSchedules'));

    if (schedules) {
        schedules.forEach(scheduleData => {
            createScheduleTable(scheduleData.sections, scheduleData.scheduleIndex, schedulesContainer);
        });
    } else {
        schedulesContainer.textContent = 'No schedules found.';
    }
});

/**
* Function to create a schedule table.
* @param {Array} schedule - Array of schedule rows.
* @param {number} scheduleIndex - Schedule index (e.g., 1, 2, etc.).
* @param {HTMLElement} container - Container to append the table.
*/
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
