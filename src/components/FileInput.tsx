import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileInput: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [, forceUpdate] = useState({}); // Empty object to force re-render

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setImage(null);
    }
  };

  const handleClick = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Prediction Result:", response.data);

      if (response.data && response.data.prediction) {
        setResult(response.data.prediction);
        forceUpdate({}); // Ensure UI updates after setting result
      } else {
        console.error("❌ No prediction received from API.");
        setResult("Error processing image.");
      }

      setImage(URL.createObjectURL(file));
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      setResult("Error processing image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("✅ UI updated, result:", result);
  }, [result]); // Debugging: Ensure UI updates when `result` changes
  

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <div className="flex flex-col items-center gap-4 bg-white p-6 w-96 rounded-xl shadow-2xl border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-700">Upload an Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border border-gray-400 p-2 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all text-black"
        />
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>

        {image ? (
          <img
            src={image}
            alt="Uploaded Preview"
            className="w-60 h-80 object-cover rounded-lg shadow-lg border border-gray-300"
          />
        ) : (
          <div className="w-60 h-80 flex items-center justify-center bg-gray-200 rounded-lg border border-dashed border-gray-400 text-gray-500">
            No image uploaded
          </div>
        )}

        <p className="text-gray-600 text-sm">Supported formats: JPG, PNG, GIF</p>
        {result !== null ? (
          <p className="text-lg font-semibold text-green-600">🦠 Prediction: {result}</p>
        ) : (
          <p className="text-gray-500 text-sm">Awaiting result...</p>
        )}
      </div>
    </div>
  );
};

export default FileInput;
