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
// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Set the destination folder to a default directory
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname + ".jpg");
//   },
// });

// const upload = multer({ storage: storage });

// // Endpoint to handle file uploads
// app.post("/upload", upload.single("file"), (req, res) => {
//   const file = req.file;

//   // Check if the user has specified a custom location
//   const { customLocation } = req.body;
//   console.log("location", req.body);
//   let destinationFolder = "uploads/"; // Default destination folder

//   if (customLocation) {
//     // Check if the custom location is an absolute path
//     if (path.isAbsolute(customLocation)) {
//       destinationFolder = customLocation;
//     } else {
//       // If it's a relative path, resolve it relative to the current working directory
//       destinationFolder = path.resolve(process.cwd(), customLocation);
//     }

//     // Create the directory if it doesn't exist
//     if (!fs.existsSync(destinationFolder)) {
//       fs.mkdirSync(destinationFolder, { recursive: true });
//     }
//   }


//   // Move the uploaded file to the specified destination folder
//   const destinationPath = path.join(destinationFolder, file.originalname + ".jpg");
//   fs.renameSync(file.path, destinationPath);

//   res.send("File uploaded successfully");
// });


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + ".jpg");
    }
  })
});

app.post("/upload", upload.single("file"), (req, res) => {
  const folderName = req.body.folderName;
  let destinationFolder = "uploads/";
  // If the user provided a folder name
  if (folderName) {
    // Resolve the folder path relative to the current working directory
    const folderPath = path.resolve(process.cwd(), "uploads", folderName);

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      // If the folder doesn't exist, create it
      fs.mkdirSync(folderPath, { recursive: true });
    }

    destinationFolder = folderPath;
  }


  // Move the uploaded file to the specified destination folder
  const file = req.file;
  const destinationPath = path.join(destinationFolder, file.originalname + ".jpg");

  fs.renameSync(file.path, destinationPath);

  res.send("File uploaded successfully");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
