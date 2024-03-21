const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "1mb" }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: ["OPTIONS", "POST", "GET", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorisation"], // Allow these headers
  })
);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder to a default directory
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname+".jpg");
  },
});

const upload = multer({ storage: storage });

// Endpoint to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  // Check if the user has specified a custom location
  const { customLocation } = req.body;
 
  let destinationFolder = "uploads/"; // Default destination folder

  if (customLocation) {
    destinationFolder = path.join(__dirname, customLocation);
    console.log(destinationFolder);
    // Create the directory if it doesn't exist
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }
  }

  // Move the uploaded file to the specified destination folder
  const destinationPath = path.join(destinationFolder, file.originalname);
  fs.renameSync(file.path, destinationPath);

  res.send("File uploaded successfully");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
