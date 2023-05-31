import React, { useState } from "react";
import axios from "axios";
import OcrResults from "./OcrResults";
import "./styles.css";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [ocrResults, setOcrResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setOcrResults(null); // Reset OCR results
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true); // Set loading state

    try {
      const { data } = await axios.post(
        "http://localhost:5000/upload-and-process-ocr",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      console.log("OCR result:", data);
      setOcrResults(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setOcrResults(null); // Reset OCR results in case of an error
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <div className="uploader-container">
      <div className="uploader-header">Testmaker upload mask</div>
      {loading ? (
        <div className="uploader-loading">Loading...</div>
      ) : (
        <>
          <progress className="uploader-progress" value={progress} max="100" />
          <br />
          <input
            className="uploader-input"
            type="file"
            onChange={handleChange}
          />
          <button className="uploader-button" onClick={handleUpload}>
            Upload and Process
          </button>
          <br />
          <br />
          <OcrResults results={ocrResults} filename={file ? file.name : null} />
        </>
      )}
    </div>
  );
};

export default FileUploader;
