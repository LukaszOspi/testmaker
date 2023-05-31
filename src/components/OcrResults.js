import React, { useState } from "react";
import FileSaver from "file-saver";
import "./styles.css";

const OcrResults = ({ results, filename }) => {
  const [selectedResults, setSelectedResults] = useState([]);

  const handleResultClick = (index) => {
    const newSelectedResults = [...selectedResults];
    if (newSelectedResults.includes(index)) {
      newSelectedResults.splice(newSelectedResults.indexOf(index), 1);
    } else {
      newSelectedResults.push(index);
    }
    setSelectedResults(newSelectedResults);
  };

  const handleSaveSelectedResults = () => {
    const selectedResultObjects = selectedResults.map((index) => ({
      text: results[index].replaceAll("\n", " "),
      filename: filename,
      page: index + 1,
    }));

    const blob = new Blob([JSON.stringify(selectedResultObjects, null, 2)], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, `${filename}.json`);
  };

  if (!results || results.length === 0) {
    return <div className="ocr-results">No results available</div>;
  }

  return (
    <div className="ocr-results">
      <h2 className="ocr-results-title">OCR Results:</h2>
      {results.map((result, index) => (
        <div
          key={index}
          className={`ocr-result-item ${
            selectedResults.includes(index) ? "selected" : ""
          }`}
          onClick={() => handleResultClick(index)}
        >
          <h3 className="ocr-result-header">Page {index + 1}</h3>
          <p className="ocr-result-text">
            {result.replaceAll("\n", " ").replace(/\bKorrekturrand\b/g, "")}
          </p>
        </div>
      ))}
      <button
        className="ocr-results-save-button"
        onClick={handleSaveSelectedResults}
        disabled={selectedResults.length === 0}
      >
        Save Selected Results
      </button>
    </div>
  );
};

export default OcrResults;
