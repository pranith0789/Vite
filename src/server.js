// import express from "express";
// import multer from "multer";
// import axios from "axios";
// import cors from "cors";
// import dotenv from "dotenv";
// import FormData from "form-data";
// import crypto from "crypto";
// import { create } from "ipfs-http-client"; // Import IPFS client

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Configure Multer for file handling
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use(cors({ origin: "*" }));
// app.use(express.json());

// // Function to generate SHA-256 hash
// const generateHash = (buffer) => {
//     return crypto.createHash("sha256").update(buffer).digest("hex");
// };

// // Connect to IPFS (using Infura)
// const ipfs = create({
//     host: "ipfs.infura.io",
//     port: 5001,
//     protocol: "https",
// });

// app.post("/upload", upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) {
//             console.log("❌ No file received");
//             return res.status(400).json({ message: "Please upload a file" });
//         }

//         console.log("✅ File received:", req.file.originalname);

//         // Generate SHA-256 hash
//         const hash = generateHash(req.file.buffer);
//         console.log("🔑 File Hash:", hash);

//         // Upload image to IPFS
//         const ipfsResult = await ipfs.add(req.file.buffer);
//         console.log("🌍 IPFS CID:", ipfsResult.path);

//         const formData = new FormData();
//         formData.append("file", req.file.buffer, { filename: req.file.originalname });

//         const fastapiUrl = "http://127.0.0.1:8000/predict-file";
//         const response = await axios.post(fastapiUrl, formData, {
//             headers: { ...formData.getHeaders() },
//         });

//         console.log("✅ Response from FastAPI:", response.data);

//         return res.json({
//             ...response.data,
//             hash: hash, // SHA-256 Hash
//             cid: ipfsResult.path, // IPFS CID
//             ipfs_url: `https://ipfs.io/ipfs/${ipfsResult.path}`, // Public Gateway
//         });

//     } catch (error) {
//         console.error("❌ Error processing image:", error);
//         return res.status(500).json({ message: "Error processing image" });
//     }
// });

// app.listen(port, () => {
//     console.log(`✅ Express server running on port ${port}`);
// });
// import express from "express";
// import multer from "multer";
// import axios from "axios";
// import cors from "cors";
// import dotenv from "dotenv";
// import FormData from "form-data";
// import crypto from "crypto";
// import { create } from "ipfs-http-client";

// dotenv.config();
// console.log("INFURA_PROJECT_ID:", process.env.INFURA_PROJECT_ID);
// console.log("INFURA_PROJECT_SECRET:", process.env.INFURA_PROJECT_SECRET);
// const app = express();
// const port = process.env.PORT || 5000;

// // Configure Multer for file handling
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use(cors({ origin: "*" }));
// app.use(express.json());

// // Function to generate SHA-256 hash
// const generateHash = (buffer) => {
//     return crypto.createHash("sha256").update(buffer).digest("hex");
// };

// // Connect to IPFS (using Infura)
// const projectId = process.env.INFURA_PROJECT_ID;
// const projectSecret = process.env.INFURA_PROJECT_SECRET;
// const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// const ipfs = create({
//     host: "ipfs.infura.io",
//     port: 5001,
//     protocol: "https",
//     headers: { authorization: auth },
// });

// app.post("/upload", upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) {
//             console.log("❌ No file received");
//             return res.status(400).json({ message: "Please upload a file" });
//         }

//         console.log("✅ File received:", req.file.originalname);

//         // Generate SHA-256 hash
//         const hash = generateHash(req.file.buffer);
//         console.log("🔑 File Hash:", hash);

//         // Upload image to IPFS
//         const ipfsResult = await ipfs.add(req.file.buffer);
//         console.log("🌍 IPFS CID:", ipfsResult.path);

//         const formData = new FormData();
//         formData.append("file", req.file.buffer, { filename: req.file.originalname });

//         const fastapiUrl = "http://127.0.0.1:8000/predict-file";
//         const response = await axios.post(fastapiUrl, formData, {
//             headers: { ...formData.getHeaders() },
//         });

//         console.log("✅ Response from FastAPI:", response.data);

//         return res.json({
//             ...response.data,
//             hash: hash, // SHA-256 Hash
//             cid: ipfsResult.path, // IPFS CID
//             ipfs_url: `https://ipfs.io/ipfs/${ipfsResult.path}`, // Public Gateway
//         });
//     } catch (error) {
//         console.error("❌ Error processing image:", error);
//         return res.status(500).json({ message: "Error processing image" });
//     }
// });

// app.listen(port, () => {
//     console.log(`✅ Express server running on port ${port}`);
// });

import express from "express";
import multer from "multer";
import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors({ origin: "*" }));
app.use(express.json());

// Function to generate SHA-256 hash
const generateHash = (buffer) => {
    return crypto.createHash("sha256").update(buffer).digest("hex");
};

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            console.log("❌ No file received");
            return res.status(400).json({ message: "Please upload a file" });
        }

        console.log("✅ File received:", req.file.originalname);

        // Generate SHA-256 hash
        const hash = generateHash(req.file.buffer);
        console.log("🔑 File Hash:", hash);

        return res.json({
            filename: req.file.originalname,
            hash: hash, // SHA-256 Hash
        });

    } catch (error) {
        console.error("❌ Error processing image:", error);
        return res.status(500).json({ message: "Error processing image" });
    }
});

app.listen(port, () => {
    console.log(`✅ Express server running on port ${port}`);
});

