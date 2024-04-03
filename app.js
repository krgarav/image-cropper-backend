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
// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

const documentsDirectory = path.join(app.getPath('documents'), 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(documentsDirectory)) {
  fs.mkdirSync(documentsDirectory, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, documentsDirectory);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

app.post("/upload", upload.single("file"), (req, res) => {
  const folderName = req.body.folderName;
  let destinationFolder = documentsDirectory;
  // If the user provided a folder name
  if (folderName) {
    // Resolve the folder path relative to the current working directory
    const folderPath = path.resolve(documentsDirectory, folderName);

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      // If the folder doesn't exist, create it
      fs.mkdirSync(folderPath, { recursive: true });
    }

    destinationFolder = folderPath;
  }


  // Move the uploaded file to the specified destination folder
  const file = req.file;
  const destinationPath = path.join(destinationFolder, file.originalname);

  fs.renameSync(file.path, destinationPath);

  res.send("File uploaded successfully");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
