import {
  CopyObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import csv from "csv-parser";
import { finished } from "stream/promises";
import { formatJSONResponse, getConfig } from "../utils";

export const importFileParserHandler = async (event) => {
  console.log("*** Event: ", event);
  const { region, assetFromFolderName, assetToFolderName } = getConfig();
  const s3Client = new S3Client({ region });

  try {
    await Promise.all(
      event.Records.map(async (record) => {
        console.log("*** Starting parse: ", record.s3.object.key);
        console.log("### Record: ", record);

        const bucketName = record.s3.bucket.name;
        const key = decodeURIComponent(
          record.s3.object.key.replace(/\+/g, " ")
        );

        const getCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        });

        console.log("*** Getting file: ", key, " from: ", bucketName);

        const result = await s3Client.send(getCommand);

        console.log("*** Start parsing recieved file: ", result);

        const parsedCSV = [];
        await finished(
          result.Body.pipe(csv())
            .on("data", (row) => {
              parsedCSV.push(row);
            })
            .on("error", (error) => {
              throw error;
            })
            .on("end", () => console.log("Parsing CSV completed", parsedCSV))
        );

        const copyToPath = key.replace(assetFromFolderName, assetToFolderName);
        console.log("### copyToPath: ", copyToPath);

        await s3Client.send(
          new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `${bucketName}/${key}`,
            Key: copyToPath,
          })
        );
        console.log("### Copying is finished");

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          })
        );
        console.log("### Deleting is finished");
      })
    );

    return formatJSONResponse({ message: "Parsing is done" });
  } catch (error) {
    const body = {
      message: error.message || "Something went wrong",
    };

    return formatJSONResponse(body, 500);
  } finally {
    s3Client.destroy();
  }
};
