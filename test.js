const fs = require("fs");

let passed = true;

console.log("========== STUDENT REGISTRATION FORM TEST ==========\n");

// TC-01 : index.html
if (fs.existsSync("index.html")) {
    console.log("TC-01 : index.html exists : PASS");
} else {
    console.log("TC-01 : index.html exists : FAIL");
    passed = false;
}

// TC-02 : style.css
if (fs.existsSync("style.css")) {
    console.log("TC-02 : style.css exists : PASS");
} else {
    console.log("TC-02 : style.css exists : FAIL");
    passed = false;
}

// TC-03 : script.js
if (fs.existsSync("script.js")) {
    console.log("TC-03 : script.js exists : PASS");
} else {
    console.log("TC-03 : script.js exists : FAIL");
    passed = false;
}
// TC-04 : students.json
if (fs.existsSync("data/students.json")) {
    console.log("TC-04 : students.json exists : PASS");
} else {
    console.log("TC-04 : students.json exists : FAIL");
    passed = false;
}

if (passed) {

    const students = JSON.parse(
        fs.readFileSync("data/students.json", "utf8")
    );

    const student = students[0];

    // TC-05 : Student Name
    if (
        student.studentName &&
        student.studentName.trim() !== ""
    ) {
        console.log("TC-05 : Student Name : PASS");
    } else {
        console.log("TC-05 : Student Name : FAIL");
        passed = false;
    }

    // TC-06 : Email
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(student.email)) {
        console.log("TC-06 : Email Validation : PASS");
    } else {
        console.log("TC-06 : Email Validation : FAIL");
        passed = false;
    }
    // TC-07 : Mobile
    if (/^[0-9]{10}$/.test(student.mobile)) {
        console.log("TC-07 : Mobile Validation : PASS");
    } else {
        console.log("TC-07 : Mobile Validation : FAIL");
        passed = false;
    }
    // TC-08 : Branch
    if (
        student.branch &&
        student.branch.trim() !== ""
    ) {
        console.log("TC-08 : Branch Validation : PASS");
    } else {
        console.log("TC-08 : Branch Validation : FAIL");
        passed = false;
    }
    // TC-09 : Gender
    const genderList = [
        "Male",
        "Female",
        "Other"
    ];

    if (genderList.includes(student.gender)) {
        console.log("TC-09 : Gender Validation : PASS");
    } else {
        console.log("TC-09 : Gender Validation : FAIL");
        passed = false;
    }
    //TC-10:Registration successful
    if(passed) {
        console.log("TC-10 : Registration Successful : PASS");
        console.log("\nBuild SUCCESS");
        process.exit(0);
    }
    else{
        console.log("TC-10 : Registration Successful : FAIL");
        console.log("\nBuild FAILED");
        process.exit(1);
    }
    if (passed) {
    console.log("\nAll Test Cases Passed.");
    process.exit(0);
    } else {
    console.log("\nSome Test Cases Failed.");
    process.exit(1);
   }
}

console.log("\n======================================");

if (passed) {
    console.log("FINAL RESULT : ALL TEST CASES PASSED ✅");
} else {
    console.log("FINAL RESULT : SOME TEST CASES FAILED ❌");
}