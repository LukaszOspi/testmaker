const fs = require("fs");
const path = require("path");

function readJSONFiles(folderPath) {
  const files = fs.readdirSync(folderPath);

  const data = {};

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);

    const reference = {
      filename: file,
      filepath: filePath,
    };

    // Extract categories and words from jsonData and store them in data object
    // Example logic:
    const categories = jsonData.categories || [];
    const words = jsonData.words || [];

    categories.forEach((category) => {
      if (!data[category]) {
        data[category] = [];
      }
      data[category].push({ words, reference });
    });
  });

  return data;
}

// Usage example:
const folderPath = "/path/to/json/folder";
const jsonData = readJSONFiles(folderPath);
console.log(jsonData);
