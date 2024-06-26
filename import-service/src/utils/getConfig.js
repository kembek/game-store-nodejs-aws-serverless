export const getConfig = () => {
  const region = process.env.AWS_REGION || "";
  const assetFromFolderName = process.env.ASSET_FROM_FOLDER || "";
  const assetToFolderName = process.env.ASSET_TO_FOLDER || "";
  const bucketName = process.env.BUCKET_NAME;
  const sqsUrl = process.env.SQS_URL;

  return {
    region,
    assetFromFolderName,
    assetToFolderName,
    bucketName,
    sqsUrl,
  };
};
