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
 */
function createScheduleTable(schedule, scheduleIndex, container) {
    const scheduleWrapper = document.createElement('div');
    scheduleWrapper.className = 'schedule-wrapper mb-4';

    const table = document.createElement('table');
    table.className = 'table table-bordered text-center';

    const caption = document.createElement('caption');
    caption.textContent = `Schedule ${scheduleIndex}`;
    caption.className = 'font-weight-bold mb-2';
    table.appendChild(caption);

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

    scheduleWrapper.appendChild(table);
    container.appendChild(scheduleWrapper);
}
