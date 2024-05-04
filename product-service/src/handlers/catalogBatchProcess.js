import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { getConfig } from "../utils";
import { ProductService } from "../services";

const config = getConfig();

export const catalogBatchProcessHandler = async (event) => {
  console.log("*** catalogBatchProcessHandler: ", event);
  const productService = new ProductService(config.region);
  const clientSns = new SNSClient({ region: config.region });

  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const parsedProduct = JSON.parse(record.body);
        const newProduct = await productService.createProduct(parsedProduct);
        const message = `Adding product: ${parsedProduct}`;

        console.log("*** Added product: ", newProduct);

        await clientSns.send(
          new PublishCommand({
            TopicArn: config.topicArn,
            Message: message,
            Subject: "Products have been uploaded",
          })
        );
      })
    );
  } catch (error) {
    const message = error.message || "Something went wrong";

    console.log("*** Error message: ", message);
  } finally {
    productService.destroy();
    clientSns.destroy();
  }
};
