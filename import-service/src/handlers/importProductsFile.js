import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { formatJSONResponse, getConfig } from "../utils";

export const importProductsFileHandler = async (event) => {
  const { region, assetFromFolderName, bucketName } = getConfig();
  const s3Client = new S3Client({ region });

  try {
    const fileName = event.queryStringParameters?.fileName;

    if (!fileName) {
      return formatJSONResponse({ message: "File name is required" }, 400);
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `${assetFromFolderName}/${fileName}`,
      ContentType: "text/csv",
    });
    const signedURL = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    return formatJSONResponse({ signedURL });
  } catch (error) {
    const body = {
      message: error.message || "Something went wrong",
    };

    return formatJSONResponse(body, 500);
  } finally {
    s3Client.destroy();
  }
};
