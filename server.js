const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const STUDENT_JSON_PATH = path.join(__dirname, "student.json");
const DATA_STUDENT_JSON_PATH = path.join(__dirname, "data", "students.json");

function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function saveStudentData(studentList) {
    const jsonContent = JSON.stringify(studentList, null, 4);
    
    // Save to student.json
    fs.writeFileSync(STUDENT_JSON_PATH, jsonContent, "utf8");
    
    // Save to data/students.json
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_STUDENT_JSON_PATH, jsonContent, "utf8");
}

const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
    setCorsHeaders(res);

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    console.log(`${req.method} ${req.url}`);

    // GET /api/students
    if (req.method === "GET" && req.url === "/api/students") {
        try {
            if (fs.existsSync(STUDENT_JSON_PATH)) {
                const data = fs.readFileSync(STUDENT_JSON_PATH, "utf8");
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(data);
                return;
            }
        } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: e.message }));
            return;
        }
    }

    // POST /api/students
    if (req.method === "POST" && req.url === "/api/students") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const payload = JSON.parse(body);
                let students = [];

                if (Array.isArray(payload)) {
                    students = payload;
                } else {
                    if (fs.existsSync(STUDENT_JSON_PATH)) {
                        students = JSON.parse(fs.readFileSync(STUDENT_JSON_PATH, "utf8"));
                    }
                    students.unshift(payload);
                }
                
                saveStudentData(students);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, message: "Saved to student.json", count: students.length }));
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Serve static files
    let requestedUrl = req.url === "/" ? "/home.html" : req.url;
    let filePath = path.join(__dirname, requestedUrl);
    
    if (!fs.existsSync(filePath) && req.url === "/") {
        filePath = path.join(__dirname, "index.html");
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === "ENOENT") {
                res.writeHead(404);
                res.end("404 File Not Found");
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf8");
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
