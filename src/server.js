import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            console.log("❌ No file received");
            return res.status(400).json({ message: "Please upload a file" });
        }

        console.log("✅ File received:", req.file.originalname);

        const formData = new FormData();
        formData.append("file", req.file.buffer, { filename: req.file.originalname });

        const fastapiUrl = "http://127.0.0.1:8000/predict-file";
        const response = await axios.post(fastapiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log("✅ Response from FastAPI:", response.data);
        return res.json(response.data); // <--- Ensures response is always sent
    } catch (error) {
        console.error("❌ Error processing image:", error);
        return res.status(500).json({ message: "Error processing image" });
    }
});

app.listen(port, () => {
    console.log(`✅ Express server running on port ${port}`);
});
