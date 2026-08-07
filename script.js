// Select the form
const form = document.querySelector("form");

// Add submit event
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    const studentName = document.querySelector('input[type="text"]').value.trim();
    const email = document.querySelector('input[type="email"]').value.trim();
    const mobile = document.querySelector('input[type="tel"]').value.trim();
    const branch = document.querySelectorAll("select")[0].value;
    const gender = document.querySelectorAll("select")[1].value;

    // Validation
    if (studentName === "") {
        alert("Please enter the student name.");
        return;
    }

    // Email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Mobile validation
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobile.match(mobilePattern)) {
        alert("Mobile number must contain exactly 10 digits.");
        return;
    }

    // Branch validation
    if (branch === "") {
        alert("Please select a branch.");
        return;
    }

    // Gender validation
    if (gender === "") {
        alert("Please select a gender.");
        return;
    }

    // Success message
    alert(
        "Registration Successful!\n\n" +
        "Student Name: " + studentName +
        "\nEmail: " + email +
        "\nMobile: " + mobile +
        "\nBranch: " + branch +
        "\nGender: " + gender
    );

    // Clear the form
    form.reset();
});