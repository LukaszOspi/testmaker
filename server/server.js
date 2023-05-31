const express = require("express");
const vision = require("@google-cloud/vision").v1;
const { Storage } = require("@google-cloud/storage");
const multer = require("multer"); // for handling multipart/form-data, which is used for file upload
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

app.get("/buckets", async (req, res) => {
  try {
    const [buckets] = await storage.getBuckets();
    res.json(buckets.map((bucket) => bucket.name));
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const upload = multer({ dest: "uploads/" }); // multer configuration

// Add an endpoint that accepts file uploads
app.post("/upload", upload.array("files"), (req, res) => {
  // req.files is array of `files` files
  // req.body will contain the text fields, if there were any
  res.send("Files uploaded successfully.");
});

app.post("/upload-and-process-ocr", upload.single("file"), async (req, res) => {
  var bucketName = "testmaker-bucket";
  // req.file is the file that was uploaded
  const filePath = req.file.path;
  const destination = `pdfs/${req.file.originalname}`;

  // Upload the file to GCS
  await storage.bucket(bucketName).upload(filePath, { destination });

  // At this point the file should be in GCS, so you can process it with Cloud Vision
  const client = new vision.ImageAnnotatorClient();
  const gcsSourceUri = `gs://${bucketName}/${destination}`;
  const gcsDestinationUri = `gs://${bucketName}/${destination}_output/`;

  const inputConfig = {
    mimeType: "application/pdf",
    gcsSource: {
      uri: gcsSourceUri,
    },
  };
  const outputConfig = {
    gcsDestination: {
      uri: gcsDestinationUri,
    },
  };
  const features = [{ type: "DOCUMENT_TEXT_DETECTION" }];
  const request = {
    requests: [
      {
        inputConfig: inputConfig,
        features: features,
        outputConfig: outputConfig,
      },
    ],
  };

  const [operation] = await client.asyncBatchAnnotateFiles(request);
  const [filesResponse] = await operation.promise();
  const destinationUri =
    filesResponse.responses[0].outputConfig.gcsDestination.uri;

  // Get JSON file from Google Cloud Storage

  // ... Rest of your code here

  // Now, fetch the output JSON files from the Vision API.
  const prefix = `${destination}_output/`;
  const options = { prefix };

  const [files] = await storage.bucket(bucketName).getFiles(options);

  // This will store all texts extracted
  let allTexts = [];

  const promises = files.map((file) => {
    return new Promise((resolve, reject) => {
      file.download((err, contents) => {
        if (err) {
          console.error("Failed to download the file.", err);
          reject(err);
        } else {
          // Parsing the content and adding the fullTextAnnotation to the allTexts array
          const parsedContents = JSON.parse(contents);
          parsedContents.responses.forEach((response) => {
            if (response.fullTextAnnotation) {
              const fullTextAnnotation = response.fullTextAnnotation.text;
              allTexts.push(fullTextAnnotation);
            }
          });
          resolve();
        }
      });
    });
  });

  Promise.all(promises)
    .then(() => {
      // Now allTexts should have the extracted text from each page.
      res.json(allTexts);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
