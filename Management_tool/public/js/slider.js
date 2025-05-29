// Toggle between Login / Signup / Admin forms
function toggleForm(formType) {
    const loginBox = document.getElementById("loginBox");
    const signupBox = document.getElementById("signupBox");
    const adminBox = document.getElementById("adminBox");

    loginBox.style.display = "none";
    signupBox.style.display = "none";
    adminBox.style.display = "none";

    if (formType === "signup") {
        signupBox.style.display = "block";
    } else if (formType === "adminBox") {
        adminBox.style.display = "block";
    } else {
        loginBox.style.display = "block";
    }
}

// User Signup Handler
document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let name = document.getElementById("signupName").value.trim();
    let employeeId = document.getElementById("signupEmployeeId").value.trim();
    let stream = document.getElementById("signupStream").value;

    if (!name || !employeeId || !stream) {
        document.getElementById("signupErrorMessage").textContent = "Please fill all fields.";
        return;
    }

    let response = await fetch('http://172.16.101.127:3000/signup', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, employeeId, stream })
    });

    let result = await response.json();

    if (response.ok) {
        alert(result.message);
        toggleForm('login');
    } else {
        document.getElementById("signupErrorMessage").textContent = result.error;
    }
});

// User Login Handler
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let loginName = document.getElementById("loginName").value.trim();
    let loginEmployeeId = document.getElementById("loginEmployeeId").value.trim();
    let errorMessage = document.getElementById("loginErrorMessage");

    if (!loginName || !loginEmployeeId) {
        errorMessage.textContent = "❌ Please fill all fields.";
        return;
    }

    let loginButton = document.querySelector("#loginForm button");
    loginButton.textContent = "Logging in...";
    loginButton.disabled = true;

    try {
        let response = await fetch("http://172.16.101.127:3000/login", {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: loginName, employeeId: loginEmployeeId })
        });

        let result = await response.json();

        if (response.ok) {
            localStorage.setItem("loggedInUser", JSON.stringify({ name: loginName, employeeId: loginEmployeeId }));
            window.location.href = "data.html";
        } else {
            errorMessage.textContent = `❌ ${result.error}`;
        }
    } catch (error) {
        errorMessage.textContent = "❌ Network error. Please try again.";
    } finally {
        loginButton.textContent = "Login";
        loginButton.disabled = false;
    }
});

// Admin Login Handler

document.getElementById("adminForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let adminName = document.getElementById("adminName").value.trim().toLowerCase();
    let adminpass = document.getElementById("adminpass").value.trim();

    const errorDiv = document.getElementById("errorMessage");

    // ✅ Local hardcoded credentials check
    if (adminName === "sanket kaushik" && adminpass === "Root@345") {
        localStorage.setItem("loggedInAdmin", JSON.stringify({ name: adminName, adminpass: adminpass }));
        window.location.href = "/Admin/admin_dashboard.html";
    } else {
        // ❌ Invalid credentials
        if (errorDiv) {
            errorDiv.textContent = "Invalid username or password.";
            errorDiv.style.color = "red";
            errorDiv.style.marginTop = "10px";
        } else {
            alert("Invalid username or password.");
        }
    }



    // Optional: fallback for future backend-admin login
    let response = await fetch("http://172.16.101.127/admin-login", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: adminName, adminpass: adminpass })
    });

    let result = await response.json();

    if (response.ok) {
        localStorage.setItem("loggedInAdmin", JSON.stringify({ name: adminName, adminpass: adminpass }));
        window.location.href = "/Admin/admin_dashboard.html";


    } else {
        alert(`❌ ${result.error}`);
    }
});




/*admin password*/

  const toggleAdminPassword = document.getElementById("toggleAdminPassword");
  const adminpassInput = document.getElementById("adminpass");

  toggleAdminPassword.addEventListener("click", () => {
    const isPassword = adminpassInput.type === "password";
    adminpassInput.type = isPassword ? "text" : "password";
    toggleAdminPassword.classList.toggle("fa-eye");
    toggleAdminPassword.classList.toggle("fa-eye-slash");
  });


