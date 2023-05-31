import React, { useState } from "react";
import FileSaver from "file-saver";

const OcrResults = ({ results, filename }) => {
  const [checkedStates, setCheckedStates] = useState(
    new Array(results.length).fill(false)
  );

  const handleCheckChange = (index) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = !newCheckedStates[index];
    setCheckedStates(newCheckedStates);
  };

  const handleSaveSelectedResults = () => {
    const selectedResults = results
      .filter((_, index) => checkedStates[index])
      .map((result, index) => ({
        text: result.replaceAll("\n", " "),
        filename: filename,
        page: index + 1,
      }));

    const blob = new Blob([JSON.stringify(selectedResults, null, 2)], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "selected_results.json");
  };

  if (!results || results.length === 0) {
    return <div>No results available</div>;
  }

  return (
    <div>
      <h2>OCR Results:</h2>
      {results.map((result, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={checkedStates[index]}
            onChange={() => handleCheckChange(index)}
          />
          <h3>Result {index + 1}</h3>
          <p>{result.replaceAll("\n", " ")}</p>
        </div>
      ))}
      <button onClick={handleSaveSelectedResults}>Save Selected Results</button>
    </div>
  );
};

export default OcrResults;
