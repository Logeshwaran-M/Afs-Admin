import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const uploadImageToS3 = async (file) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;

    const params = {
      Bucket: "afsstickering",
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    // Upload instance create
    const upload = new Upload({
      client: s3,
      params: params,
    });

    // Upload start
    await upload.done();

    return `https://afsstickering.s3.ap-south-1.amazonaws.com/${fileName}`;

  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw error;
  }
};