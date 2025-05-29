// // Trigger on page load
// window.onload = function () {
//     requestNotificationPermission();
//     loadData();
// };

// // Toggle section visibility
// function toggleSection(sectionId) {
//     const section = document.getElementById(sectionId);
//     section.classList.toggle('hidden');
// }

// // Generate a unique ID for each query
// function generateUniqueId() {
//     return 'id-' + Math.random().toString(36).substr(2, 9);
// }

// // Load all queries from localStorage
// function loadData() {
//     const queries = JSON.parse(localStorage.getItem('queries')) || [];

//     const pendingContainer = document.getElementById('pending');
//     const previousTable = document.querySelector('#previousTable tbody');

//     // Clear existing content before reloading
//     pendingContainer.innerHTML = '';
//     previousTable.innerHTML = '';

//     queries.forEach(query => {
//         if (query.resolved) {
//             // Display in previous queries section
//             query.answers.forEach(answer => {
//                 const row = previousTable.insertRow();
//                 row.innerHTML = `
//                     <td>${query.poster}</td>
//                     <td>${query.title}</td>
//                     <td>${query.description}</td>
//                     <td>${answer.answerer}</td>
//                     <td>${answer.answerText}</td>
//                     <td>${query.resolvedOn}</td>
//                 `;
//             });
//         } else {
//             // Display in pending queries section
//             const queryBox = createQueryBox(query);
//             pendingContainer.appendChild(queryBox);
//         }
//     });
// }

// // Save all queries back to localStorage
// function saveData(queries) {
//     localStorage.setItem('queries', JSON.stringify(queries));
// }

// // Post a new query
// function postQuery() {
//     const poster = document.getElementById('queryPoster').value;
//     const title = document.getElementById('queryTitle').value;
//     const description = document.getElementById('queryDescription').value;

//     if (!poster || !title || !description) {
//         showAlert('Please fill in all fields.', 'error');
//         return;
//     }

//     const queries = JSON.parse(localStorage.getItem('queries')) || [];

//     const newQuery = {
//         id: generateUniqueId(),
//         poster,
//         title,
//         description,
//         answers: [],
//         resolved: false,
//         resolvedOn: null
//     };

//     queries.push(newQuery);
//     saveData(queries);

//     // Display the new query in UI
//     const queryBox = createQueryBox(newQuery);
//     document.getElementById('pending').appendChild(queryBox);

//     // Clear form fields
//     document.getElementById('queryPoster').value = '';
//     document.getElementById('queryTitle').value = '';
//     document.getElementById('queryDescription').value = '';

//     showAlert("New query posted!", "success");
// }

// // Create a query box (HTML) to display pending queries
// function createQueryBox(query) {
//     const queryBox = document.createElement('div');
//     queryBox.classList.add('query-box');
//     queryBox.dataset.id = query.id;

//     queryBox.innerHTML = `
//         <h4>${query.title}</h4>
//         <p>${query.description}</p>
//         <p><strong>Posted By:</strong> ${query.poster}</p>

//         <div class="answers"></div>

//         <div class="answer-section">
//             <input type="text" placeholder="Your Name" class="answerer-name" required>
//             <textarea placeholder="Answer this query..." class="answer-textarea" required></textarea>
//             <button onclick="submitAnswer('${query.id}', this)">Post Answer</button>
//         </div>

//         <button onclick="resolveQuery('${query.id}')">Mark as Resolved</button>
//     `;

//     // Add answers if any exist
//     const answersContainer = queryBox.querySelector('.answers');
//     query.answers.forEach(answer => {
//         const answerDiv = document.createElement('div');
//         answerDiv.classList.add('answer');
//         answerDiv.innerHTML = `<strong>${answer.answerer}:</strong> ${answer.answerText}`;
//         answersContainer.appendChild(answerDiv);
//     });

//     return queryBox;
// }

// // Post an answer to a query
// function submitAnswer(queryId, button) {
//     const queries = JSON.parse(localStorage.getItem('queries')) || [];

//     const query = queries.find(q => q.id === queryId);

//     if (!query) {
//         showAlert("Query not found.", "error");
//         return;
//     }

//     const answererInput = button.parentElement.querySelector('.answerer-name');
//     const answerTextArea = button.parentElement.querySelector('.answer-textarea');

//     const answerer = answererInput.value.trim();
//     const answerText = answerTextArea.value.trim();

//     if (!answerer || !answerText) {
//         showAlert("Please enter your name and answer.", "error");
//         return;
//     }

//     query.answers.push({
//         answerer,
//         answerText
//     });

//     saveData(queries);
//     loadData(); // Refresh UI to show the answer

//     showAlert("Answer posted successfully!", "success");
// }

// // Resolve a query and move it to Previous Queries
// function resolveQuery(queryId) {
//     const queries = JSON.parse(localStorage.getItem('queries')) || [];

//     const queryIndex = queries.findIndex(q => q.id === queryId);
    
//     if (queryIndex === -1) {
//         showAlert("Query not found.", "error");
//         return;
//     }

//     const query = queries[queryIndex];

//     if (query.resolved) {
//         showAlert("This query is already resolved.", "info");
//         return;
//     }

//     query.resolved = true;
//     query.resolvedOn = new Date().toLocaleString();

//     saveData(queries);
//     loadData(); // Refresh UI

//     showAlert("Query marked as resolved!", "success");
// }

// // Show alert messages
// function showAlert(message, type) {
//     const alertBox = document.getElementById('alertBox');
//     alertBox.innerText = message;
//     alertBox.className = `alert-box ${type}`;
//     alertBox.style.display = 'block';

//     setTimeout(() => {
//         alertBox.style.display = 'none';
//     }, 3000);
// }

// // Request notification permission on page load
// function requestNotificationPermission() {
//     if ("Notification" in window) {
//         Notification.requestPermission().then(permission => {
//             if (permission === "granted") {
//                 console.log("Notifications enabled");
//             }
//         });
//     }
// }








// /**********Our Work************** */
// const scrollContainer = document.querySelector(".scroll-container");
// const scrollLeftBtn = document.getElementById("scrollLeft");
// const scrollRightBtn = document.getElementById("scrollRight");

// const cardWidth = document.querySelector(".project-card").offsetWidth + 20;  // Card width + gap
// let scrollPosition = 0;

// // Scroll Left
// scrollLeftBtn.addEventListener("click", () => {
//   scrollPosition -= cardWidth;
//   if (scrollPosition < 0) {
//     scrollPosition = 0;
//   }
//   scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
// });

// // Scroll Right
// scrollRightBtn.addEventListener("click", () => {
//   const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  
//   scrollPosition += cardWidth;
//   if (scrollPosition > maxScroll) {
//     scrollPosition = maxScroll;
//   }
//   scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
// });


