import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const JSONSearchEngine = () => {
  const onDrop = useCallback((acceptedFiles) => {
    const data = new FormData();
    acceptedFiles.forEach((file) => {
      data.append("files", file);
    });

    axios
      .post("http://localhost:5000/upload", data)

      .then((response) => {
        console.log("Files uploaded successfully.");
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default JSONSearchEngine;
