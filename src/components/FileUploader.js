import React, { useState } from "react";
import axios from "axios";
import OcrResults from "./OcrResults";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [ocrResults, setOcrResults] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

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
  };

  return (
    <div>
      <div>HELLO FROM UPLOADER</div>
      <progress value={progress} max="100" />
      <br />
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload and Process</button>
      <br />
      <br />
      <OcrResults results={ocrResults} filename={file.name} />
    </div>
  );
};

export default FileUploader;
