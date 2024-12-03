// JavaScript source code


document.addEventListener('DOMContentLoaded', () => {
    const savedSchedulesContainer = document.getElementById('savedSchedulesContainer');

    // Get saved schedules from localStorage
    const savedSchedules = JSON.parse(localStorage.getItem('savedSchedules')) || [];

    // Render each saved schedule
    savedSchedules.forEach((schedule, index) => {
        createScheduleTable(schedule, index + 1, savedSchedulesContainer);
    });
});

/**
 * Reuses the same function to create and display schedules.
 * @param {Array} schedule - Schedule data.
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
    caption.textContent = `Saved Schedule ${scheduleIndex}`;
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

    // Append table to the wrapper
    scheduleWrapper.appendChild(table);

    // Append the wrapper to the container
    container.appendChild(scheduleWrapper);
}
