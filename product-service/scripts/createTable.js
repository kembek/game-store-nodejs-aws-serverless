const {
  DynamoDBClient,
  CreateTableCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: "eu-west-1",
});

const ProductsTableDetails = {
  TableName: "products",
  TableClass: "STANDARD",
  AttributeDefinitions: [
    {
      AttributeName: "ID",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "ID",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};
const StocksTableDetails = {
  TableName: "stocks",
  TableClass: "STANDARD",
  AttributeDefinitions: [
    {
      AttributeName: "Product_ID",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "Product_ID",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

function logSuccessfullyCreatingTable(tableName) {
  console.log(`SUCCESS: ${tableName} table is created`);
}

async function main() {
  try {
    await client.send(new CreateTableCommand(ProductsTableDetails));
    logSuccessfullyCreatingTable(ProductsTableDetails.TableName);

    await client.send(new CreateTableCommand(StocksTableDetails));
    logSuccessfullyCreatingTable(StocksTableDetails.TableName);
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    client.destroy();
  }
}

main();
