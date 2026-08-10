// ==========================================================================
// Student Registration Form Script - Persistent JSON & LocalStorage Sync
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const cardsContainer = document.getElementById("studentCardsContainer");
    const cardsCountLabel = document.getElementById("cardsCountLabel");
    const emptyState = document.getElementById("emptyState");

    const searchInput = document.getElementById("searchInput");
    const filterBranch = document.getElementById("filterBranch");
    const filterGender = document.getElementById("filterGender");

    const defaultStudents = [
        {
            id: 1,
            studentName: "Rohan Sharma",
            email: "rohan.sharma@example.com",
            mobile: "9876543210",
            branch: "Computer Science Engineering",
            gender: "Male"
        },
        {
            id: 2,
            studentName: "Priya Verma",
            email: "priya.verma@example.com",
            mobile: "9123456780",
            branch: "Information Technology",
            gender: "Female"
        },
        {
            id: 3,
            studentName: "Aman Gupta",
            email: "aman.gupta@example.com",
            mobile: "9988776655",
            branch: "Artificial Intelligence",
            gender: "Male"
        },
        {
            id: 4,
            studentName: "Sneha Singh",
            email: "sneha.singh@example.com",
            mobile: "9871234567",
            branch: "Electronics Engineering",
            gender: "Female"
        },
        {
            id: 5,
            studentName: "Rahul Meena",
            email: "rahul.meena@example.com",
            mobile: "9012345678",
            branch: "Mechanical Engineering",
            gender: "Male"
        }
    ];

    let studentsList = [];

    initData();

    async function initData() {
        // Priority 1: Check localStorage first so data is NEVER lost on page refresh
        const saved = localStorage.getItem("students_data");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    studentsList = parsed;
                    renderCards();
                    syncToBackendServer(studentsList);
                    return;
                }
            } catch (err) {
                console.error("Error parsing localStorage:", err);
            }
        }

        // Priority 2: Fetch student.json if localStorage is empty
        try {
            const response = await fetch("student.json");
            if (response.ok) {
                const fetched = await response.json();
                if (Array.isArray(fetched) && fetched.length > 0) {
                    studentsList = fetched;
                    saveToLocalStorage(studentsList);
                    renderCards();
                    return;
                }
            }
        } catch (e) {
            console.log("Reading student.json fallback:", e);
        }

        // Priority 3: Default fallback
        studentsList = defaultStudents;
        saveToLocalStorage(studentsList);
        syncToBackendServer(studentsList);
        renderCards();
    }

    function saveToLocalStorage(data) {
        localStorage.setItem("students_data", JSON.stringify(data));
    }

    async function syncToBackendServer(fullData) {
        // Smart URL resolution: if opened via Live Server or static file, direct POST to http://localhost:3000/api/students
        let targetUrl = "/api/students";
        if (window.location.protocol === "file:" || (window.location.port && window.location.port !== "3000")) {
            targetUrl = "http://localhost:3000/api/students";
        }

        try {
            await fetch(targetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fullData)
            });
        } catch (err) {
            // Local fallback handled by localStorage silently
        }
    }

    function getInitials(name) {
        if (!name) return "ST";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    function renderCards() {
        if (!cardsContainer) return;

        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const branchVal = filterBranch ? filterBranch.value : "ALL";
        const genderVal = filterGender ? filterGender.value : "ALL";

        const filtered = studentsList.filter(student => {
            const matchesQuery = 
                student.studentName.toLowerCase().includes(query) ||
                student.email.toLowerCase().includes(query) ||
                student.mobile.includes(query);
            
            const matchesBranch = (branchVal === "ALL") || (student.branch === branchVal);
            const matchesGender = (genderVal === "ALL") || (student.gender === genderVal);

            return matchesQuery && matchesBranch && matchesGender;
        });

        if (cardsCountLabel) cardsCountLabel.textContent = `${filtered.length} of ${studentsList.length} Cards`;

        cardsContainer.innerHTML = "";

        if (filtered.length === 0) {
            if (emptyState) emptyState.classList.remove("hidden");
            return;
        } else {
            if (emptyState) emptyState.classList.add("hidden");
        }

        filtered.forEach(student => {
            const card = document.createElement("div");
            card.className = "student-card"; // 10% rounded corner via CSS

            card.innerHTML = `
                <div>
                    <div class="card-top">
                        <div class="avatar-circle">${getInitials(student.studentName)}</div>
                        <div class="card-info">
                            <h3>${student.studentName}</h3>
                            <span class="id-tag">#STU-${String(student.id).padStart(3, '0')}</span>
                        </div>
                        <button class="btn-delete" title="Delete Student" onclick="deleteStudent(${student.id})">✕</button>
                    </div>

                    <div class="card-details" style="margin-top: 14px;">
                        <div class="detail-row">
                            <strong>Email:</strong> <span>${student.email}</span>
                        </div>
                        <div class="detail-row">
                            <strong>Mobile:</strong> <span>${student.mobile}</span>
                        </div>
                    </div>
                </div>

                <div class="card-tags">
                    <span class="tag tag-branch">${student.branch}</span>
                    <span class="tag tag-gender">${student.gender}</span>
                </div>
            `;

            cardsContainer.appendChild(card);
        });
    }

    window.deleteStudent = function (id) {
        studentsList = studentsList.filter(s => s.id !== id);
        saveToLocalStorage(studentsList);
        syncToBackendServer(studentsList);
        renderCards();
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.querySelector('input[type="text"]');
        const emailInput = document.querySelector('input[type="email"]');
        const mobileInput = document.querySelector('input[type="tel"]');
        const selects = document.querySelectorAll("select");

        const studentName = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const mobile = mobileInput ? mobileInput.value.trim() : "";
        const branch = selects[0] ? selects[0].value : "";
        const gender = selects[1] ? selects[1].value : "";

        // Validation
        if (studentName === "") {
            alert("Please enter the student name.");
            return;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
        if (!email.match(emailPattern)) {
            alert("Please enter a valid email address.");
            return;
        }

        const mobilePattern = /^[0-9]{10}$/;
        if (!mobile.match(mobilePattern)) {
            alert("Mobile number must contain exactly 10 digits.");
            return;
        }

        if (branch === "") {
            alert("Please select a branch.");
            return;
        }

        if (gender === "") {
            alert("Please select a gender.");
            return;
        }

        const maxId = studentsList.reduce((max, s) => s.id > max ? s.id : max, 0);
        const newStudent = {
            id: maxId + 1,
            studentName,
            email,
            mobile,
            branch,
            gender
        };

        studentsList.unshift(newStudent);
        saveToLocalStorage(studentsList);
        syncToBackendServer(studentsList);

        // Success alert
        alert(
            "Registration Successful!\n\n" +
            "Student Name: " + studentName +
            "\nEmail: " + email +
            "\nMobile: " + mobile +
            "\nBranch: " + branch +
            "\nGender: " + gender
        );

        form.reset();
        renderCards();
    });

    if (searchInput) searchInput.addEventListener("input", renderCards);
    if (filterBranch) filterBranch.addEventListener("change", renderCards);
    if (filterGender) filterGender.addEventListener("change", renderCards);
});