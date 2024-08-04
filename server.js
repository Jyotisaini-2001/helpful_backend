
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { spawn } = require("child_process");
// require("dotenv").config();
// const multer = require("multer");
// const path = require("path");
// const crypto = require("crypto");

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//   });

// // Define a schema with explicit collection name
// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   workEmail: String,
//   jobTitle: String,
//   companyName: String,
//   channels: {
//     liveChat: Boolean,
//     phone: Boolean,
//     email: Boolean,
//   },
//   numberOfAgents: Number,
//   monthlyTicketVolume: Number,
//   urls: [String], // Add this line to store URLs
// });

// // Explicitly specify the collection name
// const User = mongoose.model("UserData", userSchema, "userDetails");

// app.post('/api/scrape', async (req, res) => {
//   const { url, companyName } = req.body;

//   if (!url || !companyName) {
//     return res.status(400).json({ error: "URL and companyName are required" });
//   }

//   const pythonProcess = spawn('python', ['../scripts/scraper.py', url]);

//   pythonProcess.stdout.on('data', async (data) => {
//     const links = JSON.parse(data.toString().replace(/'/g, '"')); // Parse output to JSON

//     try {
//       // Find or create a user document by companyName and update the urls field
//       await User.findOneAndUpdate(
//         { companyName },
//         { $push: { urls: { $each: links } } },
//         { new: true, upsert: true }
//       );
//       res.status(200).json({ message: "URLs saved successfully", links });
//     } catch (error) {
//       console.error("Error saving URLs:", error);
//       res.status(500).json({ error: "Failed to save URLs" });
//     }
//   });

//   pythonProcess.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//     res.status(500).json({ error: "Failed to scrape URLs" });
//   });

//   pythonProcess.on('close', (code) => {
//     if (code !== 0) {
//       res.status(500).json({ error: "Python script failed" });
//     }
//   });
// });

// // User routes
// app.post("/api/users", async (req, res) => {
//   const newUser = new User(req.body);
//   try {
//     await newUser.save();
//     res.status(200).send("User saved successfully");
//   } catch (err) {
//     console.error("Error saving user:", err);
//     res.status(500).send("Error saving user");
//   }
// });

// // Define the Agent Schema
// const agentSchema = new mongoose.Schema({
//   agentName: String,
//   agentStyle: String,
//   agentBehaviorGood: [String], // Array of file paths or URLs
//   agentBehaviorBad: [String], // Array of file paths or URLs
//   agentAvatar: String, // File path or URL
//   instructionsForAgent: String,
// });

// const Agent = mongoose.model("Agent", agentSchema, "agents");

// // Configure multer for file uploads with extensions
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(8).toString("hex");
//     const ext = path.extname(file.originalname);
//     cb(null, uniqueSuffix + ext);
//   }
// });

// const upload = multer({ storage });

// app.post(
//   "/api/agents",
//   upload.fields([
//     { name: "agentBehaviorGood", maxCount: 1 },
//     { name: "agentBehaviorBad", maxCount: 1 },
//     { name: "agentAvatar", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { agentName, agentStyle, instructionsForAgent } = req.body;

//       // Handle file uploads
//       const agentBehaviorGood = req.files["agentBehaviorGood"]
//         ? req.files["agentBehaviorGood"][0].path.replace(/\\/g, "/")
//         : null;
//       const agentBehaviorBad = req.files["agentBehaviorBad"]
//         ? req.files["agentBehaviorBad"][0].path.replace(/\\/g, "/")
//         : null;
//       const agentAvatar = req.files["agentAvatar"]
//         ? req.files["agentAvatar"][0].path.replace(/\\/g, "/")
//         : null;

//       // Create or update agent record
//       const agent = await Agent.findOneAndUpdate(
//         { agentName },
//         {
//           agentName,
//           agentStyle,
//           agentBehaviorGood: agentBehaviorGood ? [agentBehaviorGood] : [],
//           agentBehaviorBad: agentBehaviorBad ? [agentBehaviorBad] : [],
//           agentAvatar,
//           instructionsForAgent,
//         },
//         { new: true, upsert: true }
//       );

//       res
//         .status(200)
//         .json({ message: "Agent information saved successfully", agent });
//     } catch (error) {
//       console.error("Error saving agent information:", error);
//       res.status(500).json({ error: "Failed to save agent information" });
//     }
//   }
// );

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Define a schema with explicit collection name
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  workEmail: String,
  jobTitle: String,
  companyName: String,
  channels: {
    liveChat: Boolean,
    phone: Boolean,
    email: Boolean,
  },
  numberOfAgents: Number,
  monthlyTicketVolume: Number,
  urls: [String], // Add this line to store URLs
   files: [
    {
      originalName: String,
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now },
    }
  ],
});

// Explicitly specify the collection name
const User = mongoose.model("UserData", userSchema, "userDetails");

app.post('/api/scrape', async (req, res) => {
  const { url, companyName } = req.body;

  if (!url || !companyName) {
    return res.status(400).json({ error: "URL and companyName are required" });
  }

  const pythonProcess = spawn('python', ['./scripts/scraper.py', url]);

  pythonProcess.stdout.on('data', async (data) => {
    const links = JSON.parse(data.toString().replace(/'/g, '"')); // Parse output to JSON

    try {
      // Find or create a user document by companyName and update the urls field
      await User.findOneAndUpdate(
        { companyName },
        { $push: { urls: { $each: links } } },
        { new: true, upsert: true }
      );
      res.status(200).json({ message: "URLs saved successfully", links });
    } catch (error) {
      console.error("Error saving URLs:", error);
      res.status(500).json({ error: "Failed to save URLs" });
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).json({ error: "Failed to scrape URLs" });
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      res.status(500).json({ error: "Python script failed" });
    }
  });
});

// User routes
app.post("/api/users", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(200).send("User saved successfully");
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).send("Error saving user");
  }
});

// Define the Agent Schema
const agentSchema = new mongoose.Schema({
  agentName: String,
  agentStyle: String,
  agentBehaviorGood: [String], // Array of file paths or URLs
  agentBehaviorBad: [String], // Array of file paths or URLs
  agentAvatar: String, // File path or URL
  instructionsForAgent: String,
});

const Agent = mongoose.model("Agent", agentSchema, "agents");

// Configure multer for file uploads with extensions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

app.post(
  "/api/agents",
  upload.fields([
    { name: "agentBehaviorGood", maxCount: 1 },
    { name: "agentBehaviorBad", maxCount: 1 },
    { name: "agentAvatar", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { agentName, agentStyle, instructionsForAgent } = req.body;

      // Handle file uploads
      const agentBehaviorGood = req.files["agentBehaviorGood"]
        ? req.files["agentBehaviorGood"][0].path.replace(/\\/g, "/")
        : null;
      const agentBehaviorBad = req.files["agentBehaviorBad"]
        ? req.files["agentBehaviorBad"][0].path.replace(/\\/g, "/")
        : null;
      const agentAvatar = req.files["agentAvatar"]
        ? req.files["agentAvatar"][0].path.replace(/\\/g, "/")
        : null;

      // Create or update agent record
      const agent = await Agent.findOneAndUpdate(
        { agentName },
        {
          agentName,
          agentStyle,
          agentBehaviorGood: agentBehaviorGood ? [agentBehaviorGood] : [],
          agentBehaviorBad: agentBehaviorBad ? [agentBehaviorBad] : [],
          agentAvatar,
          instructionsForAgent,
        },
        { new: true, upsert: true }
      );

      res
        .status(200)
        .json({ message: "Agent information saved successfully", agent });
    } catch (error) {
      console.error("Error saving agent information:", error);
      res.status(500).json({ error: "Failed to save agent information" });
    }
  }
);

// Add the new file upload route
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { companyName } = req.body; // Assuming you need to associate the file with a user by companyName

  if (!companyName) {
    return res.status(400).json({ message: "Company name is required" });
  }

  const fileData = {
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path.replace(/\\/g, "/"), // Normalize path
    mimetype: req.file.mimetype,
    size: req.file.size,
  };

  try {
    // Find or create a user document by companyName and update the files field
    await User.findOneAndUpdate(
      { companyName },
      { $push: { files: fileData } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "File uploaded and saved successfully",
      file: fileData,
    });
  } catch (error) {
    console.error("Error saving file information:", error);
    res.status(500).json({ error: "Failed to save file information" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
