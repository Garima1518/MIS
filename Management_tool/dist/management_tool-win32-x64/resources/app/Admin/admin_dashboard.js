document.addEventListener("DOMContentLoaded", function () {
  const projects = {
    "CAE-Japan": [],
    "CAE": [],
    "Flush Handle Support to Italy": [],
    "Support To Erdweg": [],
    "DEP": [],
    "Audi E-Wing": [],
    "Mahindra Demo vehicle": [],
    "Power Rotative Door": [],
    "Handle Competence -UA": [],
    "Catia Training": [],
    "ISO/Quality Systems": [],
    "Marketing - Business Management/Integration": [],
    "Functional Safety Related Activity": [],
    "Cyber-Security Related Activity": [],
    "IATF and ISO Certification": [],
    "Management": [],
    "Patent Search": [],
    "Each System Management": [],
    "Various Management/General Affairs": [],
    "Common Engine": [],
    "UBSW Project": [],
    "Software UA": [],
    "Software MAE": [],
    "DigiKey": [],
    "E- Mirror OB": [],
    "NFC": [],
    "E- Mirror QT GUI": [],
    "J34X_HC": [],
    "BSW": [],
    "J4U": [],
    "Mobile Access-eDoor": [],
    "AutoSAR- UA": [],
    "AutoSAR- MAE": [],
    "SW Competence-UA": [],
    "C70 St Switch": [],
    "BMW-XNF": [],
    "E-mirror": [],
    "5K45_HC": [],
    "VK00-HC": [],
    "Audi e-Ring": [],
    "5K45_HC_REAR": [],
    "5K45_HC_Front": [],
    "DevOps and Tools": []
  };

  // Populate Project Dropdown
  const projectSelect = document.getElementById("projectSelect");
  function populateProjects() {
    projectSelect.innerHTML = '<option value="">-- Select Project --</option>';
    for (let name in projects) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      projectSelect.appendChild(option);
    }
  }

  // Add new project to dropdown and list
  window.addProject = function () {
    const newProject = document.getElementById("newProjectInput").value.trim();
    if (newProject && !projects[newProject]) {
      projects[newProject] = [];
      document.getElementById("newProjectInput").value = "";
      populateProjects();
      displayProjects();
    }
  };

  // Add employee to selected project
  window.addEmployee = function () {
    const project = projectSelect.value;
    const employee = document.getElementById("employeeInput").value.trim();
    if (project && employee) {
      projects[project].push(employee);
      document.getElementById("employeeInput").value = "";
      displayProjects();
    }
  };

  // Display projects and employees in pivot-style table
  function displayProjects() {
    const tableBody = document.querySelector(".pivot-table tbody");
    tableBody.innerHTML = "";

    for (let project in projects) {
      if (projects[project].length > 0) {
        // Add project header
        const projectRow = document.createElement("tr");
        const projectCell = document.createElement("td");
        projectCell.textContent = project;
        projectCell.colSpan = 20;
        projectCell.style.fontWeight = "bold";
        projectCell.style.backgroundColor = "#f2f2f2";
        projectRow.appendChild(projectCell);
        tableBody.appendChild(projectRow);

        // Add employees
        projects[project].forEach(employee => {
          const empRow = document.createElement("tr");
          const empCell = document.createElement("td");
          empCell.textContent = employee;
          empRow.appendChild(empCell);

          for (let i = 0; i < 17; i++) {
            const td = document.createElement("td");
            td.textContent = "0";
            empRow.appendChild(td);
          }

          const entityCell = document.createElement("td");
          entityCell.classList.add("highlight");
          entityCell.textContent = "";
          empRow.appendChild(entityCell);

          const workCell = document.createElement("td");
          workCell.classList.add("highlight");
          workCell.textContent = "";
          empRow.appendChild(workCell);

          tableBody.appendChild(empRow);
        });
      }
    }

    calculateGrandTotals(); // Update grand totals
  }

  // Grand Total calculation
  function calculateGrandTotals() {
    const rows = document.querySelectorAll(".pivot-table tbody tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 19) return; // Skip non-employee rows

      let sum = 0;
      for (let i = 1; i <= 17; i++) {
        const val = parseInt(cells[i]?.textContent || 0, 10);
        if (!isNaN(val)) sum += val;
      }

      let grandTotalCell = cells[18];
      if (!grandTotalCell || !grandTotalCell.classList.contains("highlight")) {
        grandTotalCell = document.createElement("td");
        grandTotalCell.classList.add("highlight");
        row.insertBefore(grandTotalCell, cells[18]);
      }
      grandTotalCell.textContent = sum;
    });
  }

  // Section switcher
  window.showSection = function (sectionId, clickedElement) {
    const sections = document.querySelectorAll("main section");
    sections.forEach((section) => section.classList.add("hidden"));

    const sidebarItems = document.querySelectorAll(".sidebar ul li");
    sidebarItems.forEach((item) => item.classList.remove("active"));

    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.remove("hidden");

    clickedElement.classList.add("active");
  };

  // Add Edit/Delete buttons to project form table rows
  function addActionButtonsToRow(row) {
    const actionCell = document.createElement("td");
    actionCell.innerHTML = `
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    row.appendChild(actionCell);

    actionCell.querySelector(".edit-btn").addEventListener("click", () => {
      const cells = row.querySelectorAll("td");
      document.getElementById("projectName").value = cells[0].textContent;
      document.getElementById("themeNumber").value = cells[1].textContent;
      document.getElementById("category").value = cells[2].textContent;
      row.remove();
    });

    actionCell.querySelector(".delete-btn").addEventListener("click", () => {
      row.remove();
    });
  }

  // Add buttons to existing rows in project table
  const projRows = document.querySelectorAll("#projectTable tbody tr");
  projRows.forEach((row) => {
    if (row.children.length === 3) {
      addActionButtonsToRow(row);
    }
  });

  // Handle project form submission
  document.getElementById("projectForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const projectName = document.getElementById("projectName").value.trim();
    const themeNumber = document.getElementById("themeNumber").value.trim();
    const category = document.getElementById("category").value.trim();

    if (projectName && category) {
      const tableBody = document.querySelector("#projectTable tbody");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${projectName}</td>
        <td>${themeNumber}</td>
        <td>${category}</td>
      `;
      tableBody.appendChild(row);
      addActionButtonsToRow(row);
      this.reset();
    }
  });

  // Final initialization
  populateProjects();
});

// Placeholder logout
function logout() {
  alert('Logout function not implemented yet.');
}

// Add employee to project
function addEmployee() {
  const project = document.getElementById('projectSelect').value;
  const employee = document.getElementById('employeeInput').value;
  if (project && employee) {
    const display = document.getElementById('projectDisplay');
    const para = document.createElement('p');
    para.textContent = `${employee} added to ${project}`;
    display.appendChild(para);
  }
}

// Add new project to dropdown
function addProject() {
  const newProject = document.getElementById('newProjectInput').value;
  const projectSelect = document.getElementById('projectSelect');
  if (newProject) {
    const option = document.createElement('option');
    option.value = newProject;
    option.textContent = newProject;
    projectSelect.appendChild(option);
    document.getElementById('newProjectInput').value = '';
  }
}

function showLogoutModal() {
  document.getElementById("logoutModal").style.display = "flex";
}

function showLogoutModal() {
  document.getElementById("logoutModal").style.display = "flex";
}

function showLogoutModal() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  window.location.href = "../index.html";
}

const employeeId = localStorage.getItem('employeeId'); // Set during login/signup

// Fetch specific user data
fetch(`http://172.16.101.127/login:3000/api/user-data?employeeId=${employeeId}`)
  .then(res => res.json())
  .then(data => {
    if (!data.userInfo) return;
    document.getElementById('userInfo').textContent = `Name: ${data.userInfo.name} | Stream: ${data.userInfo.stream}`;

    const tbody = document.querySelector('#dataTable tbody');
    data.entries.forEach(entry => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${entry.project || '-'}</td>
        <td>${entry.description || '-'}</td>
        <td>${entry.utilizedHour || '-'}</td>
        <td>${entry.hours || '-'}</td>
        <td>${entry.date || '-'}</td>
        <td>${entry.shiftTime || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('User data error:', err));

// Fetch all user data for admin view
fetch('http://172.16.101.127:3000/api/all-user-data')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('userDropdownContainer');

    data.usersData.forEach((user) => {
      const userCard = document.createElement('div');
      userCard.classList.add('user-card');

      const header = document.createElement('div');
      header.classList.add('user-header');
      header.innerHTML = `
        ${user.userInfo.name} (${user.userInfo.employeeId}) - ${user.userInfo.stream}
        <span>▼</span>
      `;

      const details = document.createElement('div');
      details.classList.add('user-details');
      details.style.display = 'none';
      details.style.position = 'relative';

      const tableHTML = `
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Project</th>
              <th>Mode</th>
              <th>Date</th>
              <th>Shift</th>
              <th>Description</th>
              <th>Code</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Tool Used</th>
              <th>JI</th>
              <th>Hours</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${user.entries.map(e => `
              <tr>
                <td>${e.project || '-'}</td>
                <td>${e.mode || '-'}</td>
                <td>${e.date || '-'}</td>
                <td>${e.shiftTime || '-'}</td>
                <td>${e.description || '-'}</td>
                <td>${e.code || '-'}</td>
                <td>${e.status || '-'}</td>
                <td>${e.dueDate || '-'}</td>
                <td>${e.toolUsed || '-'}</td>
                <td>${e.ji || '-'}</td>
                <td>${e.utilizedHour || '-'}</td>
                <td>${e.remarks || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      const scrollWrapper = document.createElement('div');
      scrollWrapper.style.overflow = 'auto';
      scrollWrapper.style.maxHeight = '300px';  // or any height you prefer
      scrollWrapper.style.border = '1px solid #ccc';
      scrollWrapper.style.marginBottom = '10px';
      scrollWrapper.innerHTML = tableHTML;
      
      details.appendChild(scrollWrapper);
      


      const timeBtn = document.createElement('button');
timeBtn.classList.add('btn');
timeBtn.textContent = 'Timesheet';
timeBtn.style.position = 'absolute';
timeBtn.style.marginTop = '10px';
timeBtn.style.right = '10px';
timeBtn.style.zIndex = '1000'; // Ensure the button is on top of other elements

timeBtn.addEventListener('click', async () => {
  const pivotData = {};
  const dateSet = new Set();
  const jiHours = {}; // JA, JB, JC
  let grandTotal = 0;

  user.entries.forEach(entry => {
    const key = `${entry.project || '-'}|${entry.code || '-'}|${entry.description || '-'}|${entry.ji || '-'}`;
    if (!pivotData[key]) pivotData[key] = {};
    const hrs = parseFloat(entry.utilizedHour) || 0;
    pivotData[key][entry.date] = (pivotData[key][entry.date] || 0) + hrs;

    if (entry.date) dateSet.add(entry.date);

    const jiKey = entry.ji || '-';
    jiHours[jiKey] = (jiHours[jiKey] || 0) + hrs;
    grandTotal += hrs;
  });

  const dates = Array.from(dateSet).sort();
  const headerRow = ['Project', 'Code', 'Description', 'JI', ...dates, 'Sum'];

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(user.userInfo.name || 'Timesheet');

  // Add header row
  worksheet.addRow(headerRow);

  // Add project entries
  Object.entries(pivotData).forEach(([key, hoursPerDate]) => {
    const [project, code, description, ji] = key.split('|');
    const row = [project, code, description, ji];
    let sum = 0;

    dates.forEach(date => {
      const hrs = hoursPerDate[date] || 0;
      row.push(hrs);
      sum += hrs;
    });

    row.push(sum);
    worksheet.addRow(row);
  });

  // Add a blank row
  worksheet.addRow([]);

  // Create summary row for JA, JB, JC
  const jiList = ['JA', 'JB', 'JC'];
  const jiSummaryCells = jiList.map(ji => `${ji}: ${jiHours[ji] || 0} hrs`);

  let remainingCellsLength = dates.length - jiSummaryCells.length + 1;
  if (remainingCellsLength < 0) remainingCellsLength = 0;

  const totalRow = ['Total Hours Logged', ...jiSummaryCells, ...new Array(remainingCellsLength).fill(''), `Sum: ${grandTotal} hrs`];

  // Add and style the summary row
  const styledRow = worksheet.addRow(totalRow);

  styledRow.eachCell(cell => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" } // Yellow background
    };
    cell.font = {
      color: { argb: "FFFF0000" }, // Red text
      bold: true
    };
    cell.alignment = { horizontal: 'center' };
  });

  // Auto column width
  worksheet.columns.forEach(col => {
    col.width = 20;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${user.userInfo.name}_timesheet.xlsx`);
});

// DailySheet (Today only)
const todayBtn = document.createElement('button');
todayBtn.classList.add('btn');
todayBtn.textContent = 'Dailysheet';
todayBtn.style.position = 'absolute';
todayBtn.style.marginTop = '10px';
todayBtn.style.right = '120px'; // Adjust to avoid overlapping
todayBtn.style.zIndex = '1000'; // Ensure the button is on top of other elements

todayBtn.addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const todayData = user.entries
    .filter(e => e.date === today)
    .map(e => ({
      Project: e.project || '-',
      Mode: e.mode || '-',
      Date: e.date || '-',
      Shift: e.shiftTime || '-',
      Description: e.description || '-',
      Status: e.status || '-',
      DueDate: e.dueDate || '-',
      ToolUsed: e.toolUsed || '-',
      Hours: e.utilizedHour || '-',
      Remarks: e.remarks || '-',
    }));

  if (todayData.length === 0) {
    alert(`No entries found for ${today}`);
    return;
  }

  downloadCSV(todayData, `${user.userInfo.name}_dailysheet_${today}.csv`);
});

details.appendChild(timeBtn);
details.appendChild(todayBtn);

      function downloadCSV(data, filename) {
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        data.forEach(row => {
          const values = headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`);
          csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        a.click();
        window.URL.revokeObjectURL(url);
      }


      // Toggle details
      header.addEventListener('click', () => {
        const isOpen = details.style.display === 'block';
        details.style.display = isOpen ? 'none' : 'block';
        header.querySelector('span').textContent = isOpen ? '▼' : '▲';
      });

      userCard.appendChild(header);
      userCard.appendChild(details);
      container.appendChild(userCard);
    });
  })
  .catch(err => console.error('All-user data error:', err));


// Load users for users section
function loadUsers() {
  fetch('http://172.16.101.127:3000/api/users')
    .then(response => response.json())
    .then(data => {
      const usersBody = document.getElementById('usersBody');
      usersBody.innerHTML = '';

      if (data.length === 0) {
        usersBody.innerHTML = '<tr><td colspan="3">No users found.</td></tr>';
        return;
      }

      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.employeeId}</td>
          <td>${user.stream}</td>
        `;
        usersBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error('Error loading users:', err);
    });
}

function showSection(sectionId, element) {
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.add('hidden'));

  // Remove 'active' class from all nav items
  const navItems = document.querySelectorAll('.sidebar li');
  navItems.forEach(item => item.classList.remove('active'));

  // Show selected section
  document.getElementById(sectionId).classList.remove('hidden');

  element.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generateTimesheetPivot');
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Button Clicked!');
      generatePivotTimesheet();
    });
  }

  const btn1 = document.getElementById('generateDailyPivot'); // ✅ Corrected ID
  if (btn1) {
    btn1.addEventListener('click', () => {
      alert('Button Clicked!');
      generatePivotDailysheet(); // ✅ Added missing semicolon
    });
  }
  updateDashboardCards();
});




// document.getElementById("generateTimesheetPivot").addEventListener("click", async function () {
//   if (window.pivotSheetDownloading) return;
//   window.pivotSheetDownloading = true;

//   try {
//     const res = await fetch('http://172.16.101.127:3000/api/all-user-data');
//     const data = await res.json();

//     const workbook = new ExcelJS.Workbook();
//     const allSheet = workbook.addWorksheet("All");
//     const allHeader = ['Name', 'Project', 'Code', 'Description', 'JI', 'Date', 'Utilized Hour'];
//     allSheet.addRow(allHeader);

//     const dateDataMap = {};
//     const worksheetNames = new Set();

//     data.usersData.forEach(user => {
//       // Sanitize name and remove email-like strings
//       let rawName = user.userInfo.name || "Sheet";
// let empId = user.userInfo.employeeId || "ID"; // Make sure employeeId exists

// // Remove email and sanitize characters for Excel sheet name
// rawName = rawName.replace(/[\w.-]+@[\w.-]+\.\w+/g, '').trim();
// let sheetName = `${rawName} (${empId})`.replace(/[*:/\\?[\]]/g, '').substring(0, 31);

// if (worksheetNames.has(sheetName)) {
//   let counter = 1;
//   while (worksheetNames.has(`${sheetName}_${counter}`)) {
//     counter++;
//   }
//   sheetName = `${sheetName}_${counter}`.substring(0, 31);
// }

// worksheetNames.add(sheetName);

// const worksheet = workbook.addWorksheet(sheetName);


//       const pivotData = {};
//       const dateSet = new Set();
//       const jiTotals = {};
//       const jiList = ['JA', 'JB', 'JC'];
//       let totalSum = 0;

//       user.entries.forEach(entry => {
//         const name = rawName;
//         const row = [
//           name,
//           entry.project || '',
//           entry.code || '',
//           entry.description || '',
//           entry.ji || '',
//           entry.date || '',
//           parseFloat(entry.utilizedHour) || 0
//         ];
//         allSheet.addRow(row);

//         const key = `${entry.project || '-'}|${entry.code || '-'}|${entry.description || '-'}|${entry.ji || '-'}`;
//         if (!pivotData[key]) pivotData[key] = {};
//         const hours = parseFloat(entry.utilizedHour) || 0;

//         pivotData[key][entry.date] = (pivotData[key][entry.date] || 0) + hours;
//         if (entry.date) dateSet.add(entry.date);

//         const jiKey = (entry.ji || '-').trim();
//         jiTotals[jiKey] = (jiTotals[jiKey] || 0) + hours;
//         totalSum += hours;
//       });

//       const sortedDates = Array.from(dateSet).sort();
//       const minDate = new Date(sortedDates[0]);
//       const maxDate = new Date(sortedDates[sortedDates.length - 1]);

//       const fullDates = [];
//       for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
//         fullDates.push(d.toISOString().slice(0, 10));
//       }

//       const headerRow = ['Name', 'Project', 'Code', 'Description', 'JI', ...fullDates, 'SUM'];
//       worksheet.addRow(headerRow);

//       Object.entries(pivotData).forEach(([key, hoursPerDate]) => {
//         const [project, code, description, ji] = key.split('|');
//         const row = [rawName, project, code, description, ji];

//         let rowTotal = 0;
//         const rowRef = worksheet.addRow([]);

//         fullDates.forEach((date, idx) => {
//           const val = hoursPerDate[date] || 0;
//           row.push(val);
//           rowTotal += val;

//           if (!dateDataMap[date]) {
//             dateDataMap[date] = [];
//           }
//           dateDataMap[date].push(val);
//         });

//         row.push(rowTotal);
//         rowRef.values = row;
//       });

//       fullDates.forEach((date, idx) => {
//         const isAllZero = dateDataMap[date].every(value => value === 0);
//         if (isAllZero) {
//           worksheet.getColumn(idx + 6).eachCell(cell => {
//             cell.fill = {
//               type: 'pattern',
//               pattern: 'solid',
//               fgColor: { argb: 'FFFF0000' }
//             };
//             cell.font = {
//               color: { argb: 'FFFFFFFF' }
//             };
//             cell.alignment = { horizontal: 'center' };
//           });
//         }
//       });

//       const summaryRowData = ['Total Hours Logged'];
//       const jiSummary = jiList.map(ji => `${ji}: ${jiTotals[ji] || 0} hrs`);
//       summaryRowData.push(...jiSummary);

//       while (summaryRowData.length < headerRow.length - 1) {
//         summaryRowData.push('');
//       }

//       summaryRowData.push(`SUM: ${totalSum} hrs`);
//       worksheet.addRow([]);
//       const styledRow = worksheet.addRow(summaryRowData);

//       styledRow.eachCell(cell => {
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: 'FFFFFF00' }
//         };
//         cell.font = {
//           color: { argb: 'FF000000' },
//           bold: true
//         };
//         cell.alignment = { horizontal: 'center' };
//       });
//     });

//     const buffer = await workbook.xlsx.writeBuffer();
//     saveAs(new Blob([buffer]), 'Timesheet_AllUsers.xlsx');
//   } catch (err) {
//     console.error("Error generating Excel:", err);
//   } finally {
//     window.pivotSheetDownloading = false;
//   }
// });


// Updated Timesheet Pivot Export with ALL sheet and user-wise formatted sheets

document.getElementById("generateTimesheetPivot").addEventListener("click", async function () {
  if (window.pivotSheetDownloading) return;
  window.pivotSheetDownloading = true;

  try {
    const res = await fetch('http://172.16.101.127:3000/api/all-user-data');
    const data = await res.json();
    const workbook = new ExcelJS.Workbook();

    const allSheet = workbook.addWorksheet("All");
    allSheet.addRow(['Name', 'Project', 'Code', 'Description', 'JI', 'Date', 'Utilized Hour']);

    for (const user of data.usersData) {
      const rawName = (user.userInfo.name || '').replace(/[\w.-]+@[\w.-]+\.\w+/g, '').trim();
      const empId = user.userInfo.employeeId || 'ID';
      const sheetName = `${rawName} (${empId})`.substring(0, 31);
      const worksheet = workbook.addWorksheet(sheetName);

      const entries = user.entries || [];
      const pivotData = {};
      const jiTotals = {};
      const dateSet = new Set();

      entries.forEach(entry => {
        const key = `${entry.project || '-'}|${entry.code || '-'}|${entry.description || '-'}|${entry.ji || '-'}`;
        if (!pivotData[key]) pivotData[key] = {};
        const date = entry.date?.slice(0, 10);
        if (date) {
          dateSet.add(date);
          pivotData[key][date] = (pivotData[key][date] || 0) + (parseFloat(entry.utilizedHour) || 0);
        }
        const ji = entry.ji?.trim() || '-';
        jiTotals[ji] = (jiTotals[ji] || 0) + (parseFloat(entry.utilizedHour) || 0);

        allSheet.addRow([
          rawName,
          entry.project || '',
          entry.code || '',
          entry.description || '',
          entry.ji || '',
          date,
          parseFloat(entry.utilizedHour) || 0
        ]);
      });

      const sortedDates = Array.from(dateSet).sort();
      const fullDates = [];
      if (sortedDates.length) {
        let d = new Date(sortedDates[0]);
        const max = new Date(sortedDates[sortedDates.length - 1]);
        while (d <= max) {
          fullDates.push(d.toISOString().slice(0, 10));
          d.setDate(d.getDate() + 1);
        }
      }

      const headerRow = ['Project', 'Code', 'Description', 'JI', ...fullDates, 'Sum'];
      const totalCols = headerRow.length;
      const colSum = new Array(fullDates.length).fill(0);

      worksheet.mergeCells(`A1:${String.fromCharCode(64 + totalCols)}1`);
      worksheet.getCell('A1').value = 'U-SHIN INDIA PRIVATE LIMITED';
      worksheet.getCell('A1').font = { bold: true, size: 16 };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      worksheet.mergeCells(`A2:${String.fromCharCode(64 + totalCols)}2`);
      worksheet.getCell('A2').value = `Month: April 2025`;
      worksheet.getCell('A2').font = { italic: true, size: 12 };
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      worksheet.mergeCells(`A3:${String.fromCharCode(64 + totalCols)}3`);
      worksheet.getCell('A3').value = `Name: ${rawName}`;
      worksheet.getCell('A3').alignment = { horizontal: 'center' };

      worksheet.addRow([]);
      const header = worksheet.addRow(headerRow);
      header.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
      });

      const groupedByJI = {};
      Object.entries(pivotData).forEach(([key, hoursPerDate]) => {
        const [project, code, description, ji] = key.split('|');
        if (!groupedByJI[ji]) groupedByJI[ji] = [];
        groupedByJI[ji].push({ project, code, description, ji, hoursPerDate });
      });

      for (const [ji, rows] of Object.entries(groupedByJI)) {
        const jiRow = worksheet.addRow(['', '', '', ji]);
        jiRow.font = { bold: true };
        jiRow.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
          cell.alignment = { horizontal: 'center' };
        });

        let jiSum = 0;
        for (const row of rows) {
          const rowVals = [row.project, row.code, row.description, row.ji];
          let rowSum = 0;

          fullDates.forEach((date, idx) => {
            const hrs = row.hoursPerDate[date] || 0;
            rowVals.push(hrs);
            colSum[idx] += hrs;
            rowSum += hrs;
          });

          rowVals.push(rowSum);
          worksheet.addRow(rowVals);
          jiSum += rowSum;
        }

        const jiTotalRow = new Array(totalCols).fill('');
        jiTotalRow[totalCols - 1] = jiSum;
        const subTotal = worksheet.addRow(jiTotalRow);
        subTotal.getCell(totalCols).font = { italic: true, bold: true };
        subTotal.getCell(totalCols).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      }

      // Daily Total Row (Yellow)
      const totalRow = ['Total', '', '', '', ...colSum, colSum.reduce((a, b) => a + b, 0)];
      const bottomRow = worksheet.addRow(totalRow);
      bottomRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
      });

      // Final Summary Block
      worksheet.addRow([]);
      worksheet.addRow(['Apr 2025']);
      ['JA', 'JB', 'JC'].forEach(ji => {
        const row = [ji, jiTotals[ji] || 0];
        const styledRow = worksheet.addRow(row);
        styledRow.getCell(1).font = { italic: true, bold: true };
        styledRow.getCell(2).font = { italic: true, bold: true };
      });

      const final = worksheet.addRow(['Total', colSum.reduce((a, b) => a + b, 0)]);
      final.getCell(1).font = { italic: true, bold: true };
      final.getCell(2).font = { italic: true, bold: true };

      worksheet.columns.forEach(col => col.width = 18);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Timesheet_AllUsers.xlsx');
  } catch (e) {
    console.error('Export failed:', e);
  } finally {
    window.pivotSheetDownloading = false;
  }
});




function generatePivotDailysheet() {
  if (window.dailySheetDownloading) return;
  window.dailySheetDownloading = true;

  fetch('http://172.16.101.127:3000/api/all-user-data')
    .then(res => res.json())
    .then(data => {
      const workbook = XLSX.utils.book_new();
      const today = new Date().toISOString().split('T')[0];

      const softwareSheet = [];
      const mechanicalSheet = [];
      const allSoftwareSheet = [];
      const allMechanicalSheet = [];

      const header = ['Project', 'Mode', 'Date', 'Shift', 'Description', 'Status', 'DueDate', 'Tool Used', 'Hours', 'Remarks'];
      const fullHeader = ['Resource', ...header];

      data.usersData.forEach(user => {
        const stream = (user.userInfo.stream || '').toLowerCase().trim();
        const todayEntries = user.entries.filter(e => e.date === today);
        const allMonthEntries = user.entries;

        // Handle today's entries
        if (todayEntries.length > 0) {
          const dailyData = todayEntries.map(e => [
            e.project || '-', e.mode || '-', e.date || '-', e.shiftTime || '-', e.description || '-',
            e.status || '-', e.dueDate || '-', e.toolUsed || '-', e.utilizedHour || '-', e.remarks || '-'
          ]);

          if (stream === 'software development' || stream === 'software') {
            softwareSheet.push(...dailyData);
          } else if (stream === 'mechanical') {
            mechanicalSheet.push(...dailyData);
          }
        }

        // Handle all entries (full month)
        if (allMonthEntries.length > 0) {
          const allData = allMonthEntries.map(e => [
            e.project || '-', e.mode || '-', e.date || '-', e.shiftTime || '-', e.description || '-',
            e.status || '-', e.dueDate || '-', e.toolUsed || '-', e.utilizedHour || '-', e.remarks || '-'
          ]);

          if (stream === 'software development' || stream === 'software') {
            allSoftwareSheet.push(...allData);
          } else if (stream === 'mechanical') {
            allMechanicalSheet.push(...allData);
          }
        }
      });

      // Create sheets
      if (softwareSheet.length > 0) {
        const softwareWithResource = data.usersData.flatMap(user => {
          const stream = (user.userInfo.stream || '').toLowerCase().trim();
          if (stream !== 'software' && stream !== 'software development') return [];
          return user.entries
            .filter(e => e.date === today)
            .map(e => [
              user.userInfo.name || '-',
              e.project || '-', e.mode || '-', e.date || '-', e.shiftTime || '-', e.description || '-',
              e.status || '-', e.dueDate || '-', e.toolUsed || '-', e.utilizedHour || '-', e.remarks || '-'
            ]);
        });
        const sheet = XLSX.utils.aoa_to_sheet([fullHeader, ...softwareWithResource]);
        XLSX.utils.book_append_sheet(workbook, sheet, 'SWResource');
      }

      if (mechanicalSheet.length > 0) {
        const mechanicalWithResource = data.usersData.flatMap(user => {
          const stream = (user.userInfo.stream || '').toLowerCase().trim();
          if (stream !== 'mechanical') return [];
          return user.entries
            .filter(e => e.date === today)
            .map(e => [
              user.userInfo.name || '-',
              e.project || '-', e.mode || '-', e.date || '-', e.shiftTime || '-', e.description || '-',
              e.status || '-', e.dueDate || '-', e.toolUsed || '-', e.utilizedHour || '-', e.remarks || '-'
            ]);
        });
        const sheet = XLSX.utils.aoa_to_sheet([fullHeader, ...mechanicalWithResource]);
        XLSX.utils.book_append_sheet(workbook, sheet, 'MechResource');
      }

      if (allSoftwareSheet.length > 0) {
        const allSoftwareWithResource = data.usersData.flatMap(user => {
          const stream = (user.userInfo.stream || '').toLowerCase().trim();
          if (stream !== 'software' && stream !== 'software development') return [];
          return user.entries.map(e => [
            user.userInfo.name || '-',
            e.project || '-', e.mode || '-', e.date || '-', e.shiftTime || '-', e.description || '-',
            e.status || '-', e.dueDate || '-', e.toolUsed || '-', e.utilizedHour || '-', e.remarks || '-'
          ]);
        });
        const sheet = XLSX.utils.aoa_to_sheet([fullHeader, ...allSoftwareWithResource]);
        XLSX.utils.book_append_sheet(workbook, sheet, 'ALL_SWResource');
      }

      if (allMechanicalSheet.length > 0) {
        const allMechanicalWithResource = data.usersData.flatMap(user => {
          const stream = (user.userInfo.stream || '').toLowerCase().trim();
          if (stream !== 'mechanical') return [];
          return user.entries.map(e => [
            user.userInfo.name || '-',
            e.project || '-', e.mode || '-', e.date || '-', e.shiftTime || '-', e.description || '-',
            e.status || '-', e.dueDate || '-', e.toolUsed || '-', e.utilizedHour || '-', e.remarks || '-'
          ]);
        });
        const sheet = XLSX.utils.aoa_to_sheet([fullHeader, ...allMechanicalWithResource]);
        XLSX.utils.book_append_sheet(workbook, sheet, 'ALL_MechResource');
      }

      const filename = `AllUser_DailySheet_${today}.xlsx`;
      XLSX.writeFile(workbook, filename);
      window.dailySheetDownloading = false;
    })
    .catch(err => {
      console.error('Daily Pivot Error:', err);
      window.dailySheetDownloading = false;
    });
}

/***Search functionality  */
// document.getElementById('userSearchInput').addEventListener('input', function () {
//   const searchValue = this.value.toLowerCase();
//   const userCards = document.querySelectorAll('.user-card');

//   userCards.forEach(card => {
//     const nameText = card.querySelector('.user-header')?.textContent.toLowerCase() || "";
//     card.style.display = nameText.includes(searchValue) ? '' : 'none';
//   });
// });

document.getElementById('userSearchInput').addEventListener('input', function () {
  const searchValue = this.value.toLowerCase();
  const userCards = document.querySelectorAll('.user-card');
  let userFound = false; // Flag to track if any user is found

  userCards.forEach(card => {
    const nameText = card.querySelector('.user-header')?.textContent.toLowerCase() || "";
    if (nameText.includes(searchValue)) {
      card.style.display = ''; // Show user card
      userFound = true;
    } else {
      card.style.display = 'none'; // Hide user card
    }
  });

  // Show error message if no user is found
  const errorMessage = document.getElementById('noUserFoundMessage');
  if (!userFound) {
    errorMessage.style.display = 'block'; // Show error message
  } else {
    errorMessage.style.display = 'none'; // Hide error message if user found
  }
});

function updateDashboardCards() {
  fetch('http://172.16.101.127:3000/api/all-user-data')
    .then(res => res.json())
    .then(data => {
      const users = data.usersData;
      document.getElementById('totalUsers').textContent = users.length;

      const allEntries = users.flatMap(user => user.entries);
      cachedEntries = allEntries;

      const activeProjectsSet = new Set();
      let blockedCount = 0;
      let delayedCount = 0;

      allEntries.forEach(entry => {
        if (entry.project) activeProjectsSet.add(entry.project);
        const status = entry.status ? entry.status.toLowerCase() : "";

        if (status.includes('blocked')) blockedCount++;
        if (status.includes('delayed')) delayedCount++;

      });

      document.getElementById('activeProjects').textContent = activeProjectsSet.size;
      document.getElementById('blockedTasks').textContent = blockedCount;
      document.getElementById('delayedTasks').textContent = delayedCount;

      // Optional: Total utilized hours (you can display or use this as needed)
      document.querySelectorAll('.card').forEach(card => {
        const heading = card.querySelector('h3');
        if (heading.textContent.includes("Blocked")) {
          card.style.cursor = 'pointer';
          card.onclick = () => showTaskDetails('blocked');
        } else if (heading.textContent.includes("Delayed")) {
          card.style.cursor = 'pointer';
          card.onclick = () => showTaskDetails('delayed');
        }
      });

    })
    .catch(err => {
      console.error('Dashboard data fetch error:', err);
    });
}


fetch('http://172.16.101.127:3000/api/all-user-data')
  .then(res => res.json())
  .then(data => {

    const projectHoursSoftware = {};
    const projectHoursMechanical = {};

    data.usersData.forEach(user => {
      const stream = user.userInfo.stream;
      const userName = user.userInfo.name || 'Unknown User';

      user.entries.forEach(entry => {
        const project = entry.project || 'Unknown';
        const hours = parseFloat(entry.utilizedHour) || 0;

        if (stream === 'Software Development') {
          if (!projectHoursSoftware[project]) {
            projectHoursSoftware[project] = {
              hours: 0,
              users: []
            };
          }
          projectHoursSoftware[project].hours += hours;
          if (!projectHoursSoftware[project].users.includes(userName)) {
            projectHoursSoftware[project].users.push(userName);
          }
        } else if (stream === 'Mechanical') {
          if (!projectHoursMechanical[project]) {
            projectHoursMechanical[project] = {
              hours: 0,
              users: []
            };
          }
          projectHoursMechanical[project].hours += hours;
          if (!projectHoursMechanical[project].users.includes(userName)) {
            projectHoursMechanical[project].users.push(userName);
          }
        }
      });
    });

    // === Software Chart ===
    const softwareProjects = Object.keys(projectHoursSoftware);
    const softwareHours = softwareProjects.map(p => projectHoursSoftware[p].hours);
    const softwareUsers = softwareProjects.map(p => projectHoursSoftware[p].users.join(', '));

    const ctxSoftware = document.getElementById('softwareBarChart').getContext('2d');
    new Chart(ctxSoftware, {
      type: 'bar',
      data: {
        labels: softwareProjects,
        datasets: [{
          label: 'Total Utilized Hours (Software Development)',
          data: softwareHours,
          backgroundColor: 'rgba(0, 89, 255, 0.7)',
          borderColor: 'rgb(0, 89, 255)',
          borderWidth: 1,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Utilized Hours per Project - Software Development',
            font: {
              size: 24,  // Increase the font size of the title
              weight: 'bold', // Optional: make the title bold
              family: 'Arial, sans-serif' // Optional: specify a font family
            },
            padding: {
              bottom: 20  // Optional: add space below the title
            }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex;
                return `Hours: ${softwareHours[index]}\nUsers: ${softwareUsers[index]}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Hours' },
            ticks: { stepSize: 1 }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 20
            }
          }
        }
      }
    });

    // === Mechanical Chart ===
    const mechanicalProjects = Object.keys(projectHoursMechanical);
    const mechanicalHours = mechanicalProjects.map(p => projectHoursMechanical[p].hours);
    const mechanicalUsers = mechanicalProjects.map(p => projectHoursMechanical[p].users.join(', '));

    const ctxMechanical = document.getElementById('mechanicalBarChart').getContext('2d');
    new Chart(ctxMechanical, {
      type: 'bar',
      data: {
        labels: mechanicalProjects,
        datasets: [{
          label: 'Total Utilized Hours (Mechanical)',
          data: mechanicalHours,
          backgroundColor: 'rgba(247, 156, 21, 0.7)',
          borderColor: 'rgba(247, 156, 21, 1)',
          borderWidth: 1,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Utilized Hours per Project - Mechanical',
            font: {
              size: 24,  // Increase the font size of the title
              weight: 'bold', // Optional: make the title bold
              family: 'Arial, sans-serif' // Optional: specify a font family
            },
            padding: {
              bottom: 20  // Optional: add space below the title
            }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex;
                return `Hours: ${mechanicalHours[index]}\nUsers: ${mechanicalUsers[index]}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Hours' },
            ticks: { stepSize: 1 }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 20
            }
          }
        }
      }
    });

  })
  .catch(err => console.error('Error fetching data:', err));


fetch('http://172.16.101.127:3000/api/all-user-data')
  .then(res => res.json())
  .then(data => {
    let blockedCountSoftware = 0;
    let completedCountSoftware = 0;

    let blockedCountMechanical = 0;
    let completedCountMechanical = 0;

    // Loop through all user data
    data.usersData.forEach(user => {
      const stream = user.userInfo.stream;

      user.entries.forEach(entry => {
        if (entry.status === 'Blocked') {
          if (stream === 'Software Development') {
            blockedCountSoftware++;
          } else if (stream === 'Mechanical') {
            blockedCountMechanical++;
          }
        } else if (entry.status === 'Completed') {
          if (stream === 'Software Development') {
            completedCountSoftware++;
          } else if (stream === 'Mechanical') {
            completedCountMechanical++;
          }
        }
      });
    });

    // ======= SOFTWARE DEVELOPMENT CHART =======
    const softwareLabels = ['Blocked', 'Completed'];
    const softwareCounts = [blockedCountSoftware, completedCountSoftware];
    const ctxSoftware = document.getElementById('statusHorizontalBarChart').getContext('2d');
    
    new Chart(ctxSoftware, {
      type: 'bar',
      data: {
        labels: softwareLabels,
        datasets: [{
          label: 'Software Development Tasks',
          data: softwareCounts,
          backgroundColor: ['rgba(255, 0, 0, 0.7)', 'rgba(27, 139, 87, 0.7)'],
          borderColor: ['rgba(255, 0, 0, 1)', 'rgba(27, 139, 87, 1)'],
          borderWidth: 1,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Software Development - Task Status',
            font: {
              size: 24,  // Increased font size for the title
              weight: 'bold', // Optional: Make the title bold
              family: 'Arial, sans-serif' // Optional: Specify font family
            },
            padding: {
              bottom: 20  // Optional: Add space below the title
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Tasks'
            },
            ticks: {
              stepSize: 1,
              callback: function (value) {
                if (Number.isInteger(value)) return value;
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Status'
            }
          }
        }
      }
    });
    
    // ======= MECHANICAL CHART =======
    const mechanicalLabels = ['Blocked', 'Completed'];
const mechanicalCounts = [blockedCountMechanical, completedCountMechanical];
const ctxMechanical = document.getElementById('mechanicalStatusHorizontalBarChart').getContext('2d');

new Chart(ctxMechanical, {
  type: 'bar',
  data: {
    labels: mechanicalLabels,
    datasets: [{
      label: 'Mechanical Tasks',
      data: mechanicalCounts,
      backgroundColor: ['rgba(255, 0, 0, 0.7)', 'rgba(27, 139, 87, 0.7)'],
      borderColor: ['rgba(255, 0, 0, 1)', 'rgba(27, 139, 87, 1)'],
      borderWidth: 1,
      borderRadius: 6
    }]
  },
  options: {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: 'Mechanical - Task Status',
        font: {
          size: 24,  // Increased font size for the title
          weight: 'bold', // Optional: Make the title bold
          family: 'Arial, sans-serif' // Optional: Specify font family
        },
        padding: {
          bottom: 20  // Optional: Add space below the title
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks'
        },
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (Number.isInteger(value)) return value;
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Status'
        }
      }
    }
  }
});
  })
  .catch(err => console.error('Error fetching data:', err));

let cachedEntries = [];
let currentlyOpenFilter = null;

function showTaskDetails(filterType) {
  const section = document.getElementById("taskDetailsSection");
  const title = document.getElementById("taskDetailsTitle");
  const body = document.getElementById("taskDetailsBody");

  // 👇 If the same section is clicked again, toggle it off
  if (currentlyOpenFilter === filterType && section.style.display === "block") {
    section.style.display = "none";
    currentlyOpenFilter = null;
    return;
  }

  currentlyOpenFilter = filterType;

  const filtered = cachedEntries.filter(entry =>
    entry.status && entry.status.toLowerCase().includes(filterType)
  );

  body.innerHTML = "";

  if (filtered.length === 0) {
    // ❌ No matching tasks found
    alert(`No ${filterType} tasks found for this user.`);
    section.style.display = "none"; // Optionally hide the section
    currentlyOpenFilter = null;
    return;
  }

  // ✅ Populate table if matches found
  filtered.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.project || 'N/A'}</td>
      <td>${entry.description || 'N/A'}</td>
      <td>${entry.status}</td>
      <td>${entry.utilizedHour || '0'}</td>
    `;
    body.appendChild(row);
  });

  title.textContent = `Showing ${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Tasks`;
  section.style.display = "block";
}


