// document.addEventListener("DOMContentLoaded", async function () {
//   let dailyTable = document.getElementById("dailyTable");
//   let addTaskButton = document.getElementById("addTaskButton");
//   let totalHoursDisplay = document.getElementById("totalHoursDisplay");

//   let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//   if (!loggedInUser) {
//       alert("Please log in first.");
//       return;
//   }

//   let employeeId = loggedInUser.employeeId;
//   let name = loggedInUser.name.replace(/\s+/g, '_');
//   let collectionName = `${name}_${employeeId}`;

//   let today = new Date().toISOString().split('T')[0];

//   try {
//       let response = await fetch(`http://172.16.101.127:3000/daily-sheet/${collectionName}`);
//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       let data = await response.json();
//       console.log("Fetched Daily Sheet Data:", data);

//       let todayData = data.filter(row => row.date === today);
//       let totalUtilizedHours = 0;

//       if (todayData.length === 0) {
//           let emptyRow = dailyTable.insertRow();
//           let cell = emptyRow.insertCell(0);
//           cell.colSpan = 10;
//           cell.innerText = "No data available for today.";
//           cell.style.textAlign = "center";
//       } else {
//           // ✅ Merge rows based on normalized key
//           let mergedRows = {};

//           todayData.forEach(row => {
//               const key = `${(row.project || "").trim().toLowerCase()}_${(row.code || "").trim().toLowerCase()}_${(row.description || "").trim().toLowerCase()}_${(row.ji || "").trim().toUpperCase()}`;

//               if (!mergedRows[key]) {
//                   mergedRows[key] = {
//                       ...row,
//                       utilizedHour: Number(row.utilizedHour) || 0
//                   };
//               } else {
//                   mergedRows[key].utilizedHour += Number(row.utilizedHour) || 0;
//               }
//           });

//           // ✅ Populate merged rows
//           Object.values(mergedRows).forEach(row => {
//               let utilizedHour = Number(row.utilizedHour) || 0;
//               totalUtilizedHours += utilizedHour;

//               let newRow = dailyTable.insertRow();
//               newRow.insertCell(0).innerText = row.project || "N/A";
//               newRow.insertCell(1).innerText = row.mode || "N/A";
//               newRow.insertCell(2).innerText = row.date || "N/A";
//               newRow.insertCell(3).innerText = row.shiftTime || "N/A";
//               newRow.insertCell(4).innerText = row.description || "N/A";
//               newRow.insertCell(5).innerText = row.status || "N/A";
//               newRow.insertCell(6).innerText = row.dueDate || "N/A";
//               newRow.insertCell(7).innerText = row.toolUsed || "N/A";
//               newRow.insertCell(8).innerText = utilizedHour;
//               newRow.insertCell(9).innerText = row.remarks || "N/A";
//           });
//       }

//       totalHoursDisplay.innerText = `Total Hours Used: ${totalUtilizedHours} / 8`;

//       if (totalUtilizedHours >= 8) {
//           addTaskButton.disabled = true;
//           alert("You have reached the 8-hour limit for today. No more tasks can be added.");
//       } else {
//           addTaskButton.disabled = false;
//       }

//   } catch (error) {
//       console.error("Failed to fetch MongoDB data:", error);
//       alert("Error loading daily sheet data.");
//   }

//   // ✅ Excel download button
//   document.getElementById("downloadExcelButton").addEventListener("click", function () {
//       let table = document.getElementById("dailyTable");
//       let ws = XLSX.utils.table_to_sheet(table);
//       let wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Daily Sheet");
//       XLSX.writeFile(wb, "Daily_Sheet.xlsx");
//   });
// });

const originalRowContents = {}; // 🧹 Store original row HTML during editing

document.addEventListener("DOMContentLoaded", async function () {
  let dailyTable = document.getElementById("dailyTable");
  let addTaskButton = document.getElementById("addTaskButton");
  let totalHoursDisplay = document.getElementById("totalHoursDisplay");

  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Please log in first.");
    return;
  }

  let employeeId = loggedInUser.employeeId;
  let name = loggedInUser.name.replace(/\s+/g, "_");
  let collectionName = `${name}_${employeeId}`;

  let today = new Date().toISOString().split("T")[0];

  try {
    let response = await fetch(`http://172.16.101.127:3000/daily-sheet/${collectionName}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    let data = await response.json();
    console.log("Fetched Daily Sheet Data:", data);

    let todayData = data.filter(row => row.date === today);
    let totalUtilizedHours = 0;

    if (todayData.length === 0) {
      let emptyRow = dailyTable.insertRow();
      let cell = emptyRow.insertCell(0);
      cell.colSpan = 10;
      cell.innerText = "No data available for today.";
      cell.style.textAlign = "center";
    } else {
        let mergedRows = {};
        let seenRowIds = new Set(); // 👈 ID tracker set
        
        todayData.forEach(row => {
          const key = `${(row.project || "").trim().toLowerCase()}_${(row.code || "").trim().toLowerCase()}_${(row.description || "").trim().toLowerCase()}_${(row.ji || "").trim().toUpperCase()}`;
        
          // 👉 If this _id already seen, skip it
          if (seenRowIds.has(row._id)) {
            return;
          }
        
          if (!mergedRows[key]) {
            mergedRows[key] = { ...row, utilizedHour: Number(row.utilizedHour) || 0 };
            seenRowIds.add(row._id); // ✅ Mark this _id as used
          } else {
            // Sirf tabhi add karo jab same key ke naye unique _id ka data aa raha ho
            mergedRows[key].utilizedHour += Number(row.utilizedHour) || 0;
            seenRowIds.add(row._id);
          }
        });
        

      Object.values(mergedRows).forEach((row) => {
        let utilizedHour = Number(row.utilizedHour) || 0;
        totalUtilizedHours += utilizedHour;

        let newRow = dailyTable.insertRow();
newRow.id = `row-${row._id}`;
newRow.setAttribute("data-ji", row.ji || "N/A");

        newRow.insertCell(0).innerText = row.project || "N/A";
        newRow.insertCell(1).innerText = row.mode || "N/A";
        newRow.insertCell(2).innerText = row.date || "N/A";
        newRow.insertCell(3).innerText = row.shiftTime || "N/A";
        newRow.insertCell(4).innerText = row.description || "N/A";
        newRow.insertCell(5).innerText = row.status || "N/A";
        newRow.insertCell(6).innerText = row.dueDate || "N/A";
        newRow.insertCell(7).innerText = row.toolUsed || "N/A";
        newRow.insertCell(8).innerText = utilizedHour;
        newRow.insertCell(9).innerText = row.remarks || "N/A";

        let actionCell = newRow.insertCell(10);
        actionCell.innerHTML = `
          <button onclick="editTask('${row._id}')">Edit</button>
          <button onclick="deleteTask('${row._id}')">Delete</button>
        `;
      });
    }

    totalHoursDisplay.innerText = `Total Hours Used: ${totalUtilizedHours} / 8`;

    if (totalUtilizedHours >= 8) {
      addTaskButton.disabled = true;
      alert("You have reached the 8-hour limit for today. No more tasks can be added.");
    } else {
      addTaskButton.disabled = false;
    }

  } catch (error) {
    console.error("Failed to fetch MongoDB data:", error);
    alert("Error loading daily sheet data.");
  }

  document.getElementById("downloadExcelButton").addEventListener("click", function () {
    let table = document.getElementById("dailyTable");
    let ws = XLSX.utils.table_to_sheet(table);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daily Sheet");
    XLSX.writeFile(wb, "Daily_Sheet.xlsx");
  });
});

// ✅ Project Dropdown function
function projectDropdown(oldProject = "") {
  return `
<select id="project">
  <optgroup label="Software Projects">
    <option value="DevOps and Tools" ${oldProject === "DevOps and Tools" ? "selected" : ""}>DevOps and Tools</option>
    <option value="UBSW Project" ${oldProject === "UBSW Project" ? "selected" : ""}>UBSW Project</option>
    <option value="DigiKey" ${oldProject === "DigiKey" ? "selected" : ""}>DigiKey</option>
    <option value="E- Mirror OB" ${oldProject === "E- Mirror OB" ? "selected" : ""}>E- Mirror OB</option>
    <option value="NFC" ${oldProject === "NFC" ? "selected" : ""}>NFC</option>
    <option value="E- Mirror QT GUI" ${oldProject === "E- Mirror QT GUI" ? "selected" : ""}>E- Mirror QT GUI</option>
    <option value="J34X_HC" ${oldProject === "J34X_HC" ? "selected" : ""}>J34X_HC</option>
    <option value="BSW" ${oldProject === "BSW" ? "selected" : ""}>BSW</option>
    <option value="J4U" ${oldProject === "J4U" ? "selected" : ""}>J4U</option>
    <option value="Mobile Access-eDoor" ${oldProject === "Mobile Access-eDoor" ? "selected" : ""}>Mobile Access-eDoor</option>
    <option value="AutoSAR- UA" ${oldProject === "AutoSAR- UA" ? "selected" : ""}>AutoSAR- UA</option>
    <option value="AutoSAR- MAE" ${oldProject === "AutoSAR- MAE" ? "selected" : ""}>AutoSAR- MAE</option>
    <option value="SW Competence-UA" ${oldProject === "SW Competence-UA" ? "selected" : ""}>SW Competence-UA</option>
    <option value="BMW-XNF" ${oldProject === "BMW-XNF" ? "selected" : ""}>BMW-XNF</option>
    <option value="E-mirror" ${oldProject === "E-mirror" ? "selected" : ""}>E-mirror</option>
    <option value="5K45_HC" ${oldProject === "5K45_HC" ? "selected" : ""}>5K45_HC</option>
    <option value="VK00-HC" ${oldProject === "VK00-HC" ? "selected" : ""}>VK00-HC</option>
    <option value="Audi e-Ring" ${oldProject === "Audi e-Ring" ? "selected" : ""}>Audi e-Ring</option>
    <option value="5K45_HC_REAR" ${oldProject === "5K45_HC_REAR" ? "selected" : ""}>5K45_HC_REAR</option>
    <option value="5K45_HC_Front" ${oldProject === "5K45_HC_Front" ? "selected" : ""}>5K45_HC_Front</option>
  </optgroup>

  <optgroup label="Mechanical Projects">
    <option value="CAE-Japan" ${oldProject === "CAE-Japan" ? "selected" : ""}>CAE-Japan</option>
    <option value="CAE" ${oldProject === "CAE" ? "selected" : ""}>CAE</option>
    <option value="Flush Handle Support to Italy" ${oldProject === "Flush Handle Support to Italy" ? "selected" : ""}>Flush Handle Support to Italy</option>
    <option value="Support To Erdweg" ${oldProject === "Support To Erdweg" ? "selected" : ""}>Support To Erdweg</option>
    <option value="DEP" ${oldProject === "DEP" ? "selected" : ""}>DEP</option>
    <option value="Audi E-Wing" ${oldProject === "Audi E-Wing" ? "selected" : ""}>Audi E-Wing</option>
    <option value="Mahindra Demo vehicle" ${oldProject === "Mahindra Demo vehicle" ? "selected" : ""}>Mahindra Demo vehicle</option>
    <option value="Power Rotative Door" ${oldProject === "Power Rotative Door" ? "selected" : ""}>Power Rotative Door</option>
    <option value="Handle Competence -UA" ${oldProject === "Handle Competence -UA" ? "selected" : ""}>Handle Competence -UA</option>
  <option value="C70 St Switch" ${oldProject === "C70 St Switch" ? "selected" : ""}>C70 St Switch</option>
<option value="MAZDA CX5 - Demo Car" ${oldProject === "MAZDA CX5 - Demo Car" ? "selected" : ""}>MAZDA CX5 - Demo Car</option>
<option value="ID5 - Demo Car" ${oldProject === "ID5 - Demo Car" ? "selected" : ""}>ID5 - Demo Car</option>
<option value="Motorized  E-wing" ${oldProject === "Motorized  E-wing" ? "selected" : ""}>Motorized  E-wing</option>
<option value="RSA 15-40" ${oldProject === "RSA 15-40" ? "selected" : ""}>RSA 15-40</option>
<option value="FCA 356" ${oldProject === "FCA 356" ? "selected" : ""}>FCA 356</option>
<option value="FRONT FLUSH" ${oldProject === "FRONT FLUSH" ? "selected" : ""}>FRONT FLUSH</option>
<option value="PSA E-FLUSH LP3" ${oldProject === "PSA E-FLUSH LP3" ? "selected" : ""}>PSA E-FLUSH LP3</option>
<option value="PSA-D34" ${oldProject === "PSA-D34" ? "selected" : ""}>PSA-D34</option>
<option value="PSA-D-CROSS REAR" ${oldProject === "PSA-D-CROSS REAR" ? "selected" : ""}>PSA-D-CROSS REAR</option>
<option value="BMW wing handle" ${oldProject === "BMW wing handle" ? "selected" : ""}>BMW wing handle</option>
<option value="RR 45" ${oldProject === "RR 45" ? "selected" : ""}>RR 45</option>
<option value="VW Handle" ${oldProject === "VW Handle" ? "selected" : ""}>VW Handle</option>
<option value="Scout Handle" ${oldProject === "Scout Handle" ? "selected" : ""}>Scout Handle</option>

    </optgroup>

  <optgroup label="Internal">
    <option value="Catia Training" ${oldProject === "Catia Training" ? "selected" : ""}>Catia Training</option>
    <option value="ISO/Quality Systems" ${oldProject === "ISO/Quality Systems" ? "selected" : ""}>ISO/Quality Systems</option>
   <option value="Marketing - Business Management/Integration" ${oldProject === "Marketing - Business Management/Integration" ? "selected" : ""}>Marketing - Business Management/Integration</option>
<option value="Functional Safety Related Activity" ${oldProject === "Functional Safety Related Activity" ? "selected" : ""}>Functional Safety Related Activity</option>
<option value="Cyber-Security Related Activity" ${oldProject === "Cyber-Security Related Activity" ? "selected" : ""}>Cyber-Security Related Activity</option>
<option value="IATF and ISO Certification" ${oldProject === "IATF and ISO Certification" ? "selected" : ""}>IATF and ISO Certification</option>
<option value="Management" ${oldProject === "Management" ? "selected" : ""}>Management</option>
<option value="Patent Search" ${oldProject === "Patent Search" ? "selected" : ""}>Patent Search</option>
<option value="Each System Management" ${oldProject === "Each System Management" ? "selected" : ""}>Each System Management</option>
<option value="Various Management/General Affairs" ${oldProject === "Various Management/General Affairs" ? "selected" : ""}>Various Management/General Affairs</option>
<option value="Common Engine" ${oldProject === "Common Engine" ? "selected" : ""}>Common Engine</option>
<option value="Software UA" ${oldProject === "Software UA" ? "selected" : ""}>Software UA</option>
<option value="Software MAE" ${oldProject === "Software MAE" ? "selected" : ""}>Software MAE</option>

  </optgroup>
</select>
  `;
}

function editTask(rowId) {
    const row = document.getElementById(`row-${rowId}`);
    const originalRowHTML = row.innerHTML;
    originalRowContents[rowId] = originalRowHTML;
  
    const oldProject = row.cells[0].innerText.trim();
    const oldMode = row.cells[1].innerText.trim();
    const oldDate = row.cells[2].innerText.trim();
    const oldShiftTime = row.cells[3].innerText.trim();
    const oldDescription = row.cells[4].innerText.trim();
    const oldStatus = row.cells[5].innerText.trim();
    const oldDueDate = row.cells[6].innerText.trim();
    const oldToolUsed = row.cells[7].innerText.trim();
    const oldUtilizedHour = row.cells[8].innerText.trim();
    const oldRemarks = row.cells[9].innerText.trim();
    const oldJI = row.getAttribute('data-ji') || "N/A";
  
    row.innerHTML = `
      <td>${projectDropdown(oldProject)}</td>
      <td>
        <select>
          <option value="WFO" ${oldMode === "WFO" ? "selected" : ""}>WFO</option>
          <option value="WFH" ${oldMode === "WFH" ? "selected" : ""}>WFH</option>
          <option value="Leave" ${oldMode === "Leave" ? "selected" : ""}>Leave</option>
          <option value="Company Holiday" ${oldMode === "Company Holiday" ? "selected" : ""}>Company Holiday</option>
        </select>
      </td>
      <td><input type="date" value="${oldDate}" readonly onkeydown="return false;" /></td>
      <td>
        <select>
          <option value="IST" ${oldShiftTime === "IST" ? "selected" : ""}>IST</option>
          <option value="CET" ${oldShiftTime === "CET" ? "selected" : ""}>CET</option>
          <option value="SPL" ${oldShiftTime === "SPL" ? "selected" : ""}>SPL</option>
        </select>
      </td>
      <td><input type="text" value="${oldDescription}" placeholder="Description" /></td>
      <td>
        <select>
          <option value="On Time" ${oldStatus === "On Time" ? "selected" : ""}>On Time</option>
          <option value="Completed" ${oldStatus === "Completed" ? "selected" : ""}>Completed</option>
          <option value="Delayed" ${oldStatus === "Delayed" ? "selected" : ""}>Delayed</option>
          <option value="Blocked" ${oldStatus === "Blocked" ? "selected" : ""}>Blocked</option>
        </select>
      </td>
      <td><input type="date" value="${oldDueDate}" /></td>
      <td><input type="text" value="${oldToolUsed}" placeholder="Tool Used" /></td>
      <td><input type="number" min="0.5" max="8" step="0.5" value="${oldUtilizedHour}" /></td>
      <td>
        <textarea placeholder="Remarks">${oldRemarks}</textarea>
        <input type="hidden" id="ji-hidden" value="${oldJI}" />
      </td>
      <td>
        <button onclick="saveTask('${rowId}')">Save</button>
        <button onclick="cancelEdit('${rowId}')">Cancel</button>
      </td>
    `;
  }
  
// 🗑️ Delete button
async function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let collectionName = `${loggedInUser.name.replace(/\s+/g, "_")}_${loggedInUser.employeeId}`;

    try {
      let response = await fetch(`http://172.16.101.127:3000/delete-task/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ collectionName })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      alert("Task deleted successfully!");
      location.reload();
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Error deleting task.");
    }
  }
}

async function saveTask(rowId) {
    const row = document.getElementById(`row-${rowId}`);
  
    const selects = row.querySelectorAll("select");
    const textarea = row.querySelector("textarea");
  
    const utilizedHourInput = row.querySelector('input[type="number"]');
    const dateInput = row.querySelector('input[type="date"]');
    const dueDateInput = row.querySelectorAll('input[type="date"]')[1];
    const descriptionInput = row.querySelector('input[placeholder="Description"]');
    const toolUsedInput = row.querySelector('input[placeholder="Tool Used"]');
  
    const newUtilizedHour = parseFloat(utilizedHourInput?.value || 0);
    const oldUtilizedHour = parseFloat(utilizedHourInput.getAttribute("value") || 0); // 👈 FIXED LINE
    
    const currentTotalDisplay = document.getElementById("totalHoursDisplay").innerText;
    const match = currentTotalDisplay.match(/([\d.]+)\s*\/\s*8/);
    const currentTotal = match ? parseFloat(match[1]) : 0;
    
    const finalTotal = currentTotal - oldUtilizedHour + newUtilizedHour;
    
    if (newUtilizedHour > oldUtilizedHour && finalTotal > 8) {
      alert(`Cannot save. Total utilized hour exceeds 8.\nCurrent: ${currentTotal}, trying to save: ${newUtilizedHour}`);
      return;
    }
    
  
    const updatedData = {
      project: selects[0]?.value || "",
      mode: selects[1]?.value || "",
      shiftTime: selects[2]?.value || "",
      status: selects[3]?.value || "",
      ji: row.querySelector("#ji-hidden")?.value || "N/A",
      date: dateInput?.value || "",
      description: descriptionInput?.value || "",
      dueDate: dueDateInput?.value || "",
      toolUsed: toolUsedInput?.value || "",
      utilizedHour: newUtilizedHour,
      remarks: textarea?.value || ""
    };
  
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let collectionName = `${loggedInUser.name.replace(/\s+/g, "_")}_${loggedInUser.employeeId}`;
  
    try {
      let response = await fetch(`http://172.16.101.127:3000/update-task`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: rowId,
          collectionName,
          ...updatedData
        })
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      alert("Task updated successfully!");
      location.reload();
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Error updating task.");
    }
  }
  
  
  
// ↩️ Cancel edit
function cancelEdit(rowId) {
  const row = document.getElementById(`row-${rowId}`);
  row.innerHTML = originalRowContents[rowId];
}
