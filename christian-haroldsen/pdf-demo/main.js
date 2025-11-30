
const downloadButton = document.getElementById('download-pdf');

function generateReport() {
    window.print();
}

function populateReport() {
    const reportBody = document.getElementById('report-body');
    for (let i = 1; i < 51; i ++) {
        reportBody.insertAdjacentHTML('beforeend', `
            <tr><td>2025.11.25</td><td>101</td><td>Bedroom 1</td><td>Left Bed</td><td>The bed is on fire.</td><td>IMAGE</td></tr>
        `);
    }
}

populateReport();
downloadButton.addEventListener('click', generateReport);
