import { ImageAnnotatorClient } from "@google-cloud/vision";

// Path to your service account key file
const keyFilename = process.env.REACT_APP_GOOGLE_APPLICATION_CREDENTIALS;

// Your Google Cloud Project ID
const projectId = process.env.REACT_APP_PROJECT_ID;

// Your Google Cloud Storage Bucket name
const bucketName = process.env.REACT_APP_BUCKET_NAME;

// Location of the Vision API service
const locationId = process.env.REACT_APP_LOCATION;

// Instantiates a client
const client = new ImageAnnotatorClient({ projectId, keyFilename });

// The full path to your input file
const inputUri = `gs://${bucketName}/input-file.pdf`;

// The full path to your output file
const outputUri = `gs://${bucketName}/output-file.json`;

const inputConfig = {
  mimeType: "application/pdf",
  gcsSource: { uri: inputUri },
};

const outputConfig = {
  gcsDestination: { uri: outputUri },
};

const features = [{ type: "DOCUMENT_TEXT_DETECTION" }];

const request = {
  requests: [
    {
      inputConfig,
      features,
      outputConfig,
    },
  ],
};

export const processImage = async () => {
  const [operation] = await client.asyncBatchAnnotateFiles(request);
  const [filesResponse] = await operation.promise();
  const outputUri = filesResponse.responses[0].outputConfig.gcsDestination.uri;
  console.log("Json saved to: " + outputUri);
  return outputUri;
};
