import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { getConfig } from "../utils";
import { ProductService } from "../services";

export const catalogBatchProcessHandler = async (event) => {
  console.log(
    "*** catalogBatchProcessHandler: ",
    JSON.stringify(event, null, 2)
  );
  const { region, topicArn } = getConfig();
  const productService = new ProductService(region);
  const clientSns = new SNSClient({ region: region });
  console.log("*** Config: ", region, topicArn);

  try {
    await Promise.all(
      event.Records.map(async (record) => {
        if (!record?.body) {
          return;
        }

        const parsedProduct = JSON.parse(record.body);
        const newProduct = await productService.createProduct(parsedProduct);

        console.log("*** Added product: ", newProduct);
        await clientSns.send(
          new PublishCommand({
            TopicArn: topicArn,
            Subject: `Adding product ${parsedProduct.title}`,
            Message: JSON.stringify(newProduct, null, 2),
          })
        );
      })
    );

    await clientSns.send(
      new PublishCommand({
        TopicArn: topicArn,
        Subject: "Products have been uploaded",
        Message: "You should chec the list of products",
      })
    );
  } catch (error) {
    const message = error
      ? JSON.stringify(error, null, 2)
      : "Something went wrong";

    console.log("*** Error message: ", message);
  } finally {
    productService.destroy();
    clientSns.destroy();
  }
};
