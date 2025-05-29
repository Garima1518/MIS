

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the logged-in user data from localStorage
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
      console.error("No user is logged in.");
      return;
  }

  // Display the logged-in user's name or 'Guest' if no user is logged in
  const displayNameElement = document.getElementById("displayName");
  if (displayNameElement) {
      displayNameElement.textContent = loggedInUser.name || "Guest";
  }

  // Automatically set today's date on all date inputs
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll("input[type='date']").forEach(input => {
      input.value = today;
  });

  // Set the main date input (top section)
  const dateInput = document.getElementById("date");
  if (dateInput) {
      dateInput.value = today;
      dateInput.readOnly = true;
     
  }

  // Initialize Select2 for the first tool-select
  const firstToolSelect = document.querySelector(".tool-select");
  if (firstToolSelect) {
      $(firstToolSelect).select2({
          width: '100%',
          tags: true
      });
  }
document.querySelectorAll("input[type='date']").forEach(input => {
   
    input.addEventListener("keydown", function (e) {
        e.preventDefault(); // Block ALL keyboard typing: letters, numbers, spacebar etc
    });

    input.addEventListener("paste", function (e) {
        e.preventDefault(); // Block pasting any text
    });
});

  // Dynamic project change listener for all rows (auto-suggestions)
  document.getElementById("reportTable")?.addEventListener("change", async function (e) {
      if (e.target && e.target.id === "project") {
          const project = e.target.value;
          const row = e.target.closest("tr");
          const descriptionInput = row.querySelector("input[placeholder='Description']");

          if (!project || !descriptionInput) return;

          const { employeeId } = loggedInUser;

          try {
              const response = await fetch(`http://172.16.101.127:3000/descriptions/${employeeId}/${encodeURIComponent(project)}`);
              const contentType = response.headers.get("content-type");
              if (!contentType || !contentType.includes("application/json")) {
                  throw new Error("Invalid JSON response");
              }
              const result = await response.json();

              let datalistId = "desc-suggestions-" + Math.random().toString(36).substring(2, 10);
              const datalist = document.createElement("datalist");
              datalist.id = datalistId;
              document.body.appendChild(datalist);

              if (result.success) {
                  result.descriptions.forEach(desc => {
                      const option = document.createElement("option");
                      option.value = desc;
                      datalist.appendChild(option);
                  });
              }

              descriptionInput.setAttribute("list", datalistId);
          } catch (err) {
              console.error("Error fetching suggestions:", err);
          }
      }
  });

  // Hook for live total hour monitoring
  document.addEventListener("input", function (e) {
      if (e.target.classList.contains("utilized-hours")) {
          updateSubmitButtonStatus();
      }
  });

  updateSubmitButtonStatus(); // Initial check
});

function calculateTotalHours() {
  let totalHours = 0;
  document.querySelectorAll('.utilized-hours').forEach(input => {
      let hours = parseFloat(input.value) || 0;
      totalHours += hours;
  });
  return totalHours;
}

function updateSubmitButtonStatus() {
  const total = calculateTotalHours();
  const submitBtn = document.querySelector("button[type='submit']");

  if (submitBtn) {
      if (total >= 8) {
          submitBtn.disabled = true;
          submitBtn.innerText = "8 Hours Reached";
          submitBtn.style.backgroundColor = "#ccc";
      } else {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit";
          submitBtn.style.backgroundColor = "";
      }
  }
}

function addRow() {
  const table = document.querySelector("table");
  const rows = table.querySelectorAll("tr");
  const firstDataRow = rows[1];

  const originalSelect = firstDataRow.querySelector('.tool-select');
  if ($(originalSelect).hasClass('select2-hidden-accessible')) {
      $(originalSelect).select2('destroy');
  }

  const newRow = firstDataRow.cloneNode(true);

  $(originalSelect).select2({ width: '100%', tags: true });

  newRow.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.tagName.toLowerCase() === "select") {
          el.selectedIndex = 0;
          el.removeAttribute('data-select2-id');
          $(el).find('option').removeAttr('data-select2-id');
      } else {
          el.value = "";
      }
  });

  const today = new Date().toISOString().split('T')[0];
  newRow.querySelectorAll("input[type='date']").forEach(input => {
      input.value = today;
  });

  table.appendChild(newRow);
  $(newRow).find('.tool-select').val(null).select2({ width: '100%', tags: true });

  updateSubmitButtonStatus(); // Re-check after adding a row
}

function removeLastRow() {
  const table = document.querySelector("table");
  const rows = table.querySelectorAll("tr");
  if (rows.length > 2) {
      table.removeChild(rows[rows.length - 1]);
      updateSubmitButtonStatus(); // Re-check after removing a row
  } else {
      alert("At least one row must remain.");
  }
}

function toggleChatbot() {
  const chatbot = document.getElementById("chatbotContainer");
  chatbot.style.display = chatbot.style.display === "none" ? "block" : "none";
}

async function submitReport() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser || !loggedInUser.name || !loggedInUser.employeeId) {
      alert("User not logged in.");
      return;
  }

  let { name, employeeId } = loggedInUser;
  let collectionName = `${name.replace(/\s+/g, '_')}_${employeeId}`;

  let rows = document.querySelectorAll("#reportTable tr:not(:first-child)");
  let newEntries = [];
  let newUtilizedHours = 0;
  let selectedDate = null;

  for (let row of rows) {
      let cells = row.querySelectorAll("td");
      let date = cells[2].querySelector("input")?.value || "N/A";
      let utilizedHour = parseFloat(cells[10].querySelector("input")?.value) || 0;

      if (isNaN(utilizedHour) || utilizedHour <= 0) {
          alert("At least 1 hour needs to be entered for each project.");
          return;
      }
      if (date === "N/A") {
          alert("Please enter a valid date.");
          return;
      }
      if (!selectedDate) selectedDate = date;
      if (date !== selectedDate) {
          alert("You can only submit data for one date at a time.");
          return;
      }

      newUtilizedHours += utilizedHour;

      newEntries.push({
          project: cells[0].querySelector("select")?.value || "N/A",
          mode: cells[1].querySelector("select")?.value || "N/A",
          date: date,
          shiftTime: cells[3].querySelector("select")?.value || "N/A",
          description: cells[4].querySelector("input")?.value || "N/A",
          code: cells[5].querySelector("select")?.value || "N/A",
          status: cells[6].querySelector("select")?.value || "N/A",
          dueDate: cells[7].querySelector("input")?.value || "N/A",
          toolUsed: Array.from(cells[8].querySelector("select")?.selectedOptions || []).map(opt => opt.value).join(', ') || "N/A",
          ji: cells[9].querySelector("select")?.value || "N/A",
          utilizedHour: utilizedHour,
          remarks: cells[11].querySelector("textarea")?.value || "N/A"
      });
  }

  try {
      let response = await fetch(`http://172.16.101.127:3000/daily-sheet/${collectionName}`);
      let existingData = await response.json();

      let loggedHours = existingData
          .filter(row => row.date === selectedDate)
          .reduce((sum, row) => sum + (parseFloat(row.utilizedHour) || 0), 0);

      let totalHours = loggedHours + newUtilizedHours;

      if (totalHours > 8) {
          alert(`Total utilized hours exceed 8 hours. You have already logged ${loggedHours} hours today.`);
          return;
      }

      let saveResponse = await fetch('http://172.16.101.127:3000/save-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collectionName, data: newEntries })
      });

      let result = await saveResponse.json();

      if (saveResponse.ok) {
          alert("Report submitted successfully!");
      } else {
          alert("Error: " + result.error);
      }
  } catch (error) {
      alert("Server error: Unable to submit report.");
      console.error(error);
  }
}


