import { Storage } from "@google-cloud/storage";

// Your Google Cloud Platform project ID
const projectId = process.env.REACT_APP_PROJECT_ID;

// The name of your bucket
const bucketName = process.env.REACT_APP_BUCKET_NAME;

// Path to your service account key file
const keyFilename = process.env.REACT_APP_GOOGLE_APPLICATION_CREDENTIALS;

// Instantiates a client
const storage = new Storage({ projectId, keyFilename });

export const downloadFile = async (filePath, destFileName) => {
  const options = {
    destination: destFileName,
  };

  // Downloads the file
  await storage.bucket(bucketName).file(filePath).download(options);

  console.log(`Downloaded file ${filePath} to ${destFileName}`);
};
