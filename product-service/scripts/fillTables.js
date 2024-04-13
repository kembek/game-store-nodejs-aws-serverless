const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "eu-west-1" });
const MOCK_PRODUCTS = [
  {
    description: "Short Mortal Combat X Description",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 24,
    title: "Mortal Combat X",
  },
  {
    description: "Short GrandTour Description",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "GrandTour",
  },
  {
    description: "Short GTA V Description",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "GTA V",
  },
  {
    description: "Short CS:GO Description",
    id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    price: 15,
    title: "CS:GO",
  },
  {
    description: "Short Rust Description",
    id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    price: 23,
    title: "Rust",
  },
  {
    description: "Short Product Description7",
    id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    price: 15,
    title: "ProductName",
  },
];

const BatchOfProducts = {
  RequestItems: {
    products: MOCK_PRODUCTS.map((item) => {
      const { description, id, price, title } = item;

      return {
        PutRequest: {
          Item: {
            ID: {
              S: id,
            },
            Title: {
              S: title,
            },
            Description: {
              S: description,
            },
            Price: {
              N: price.toString(),
            },
          },
        },
      };
    }),
  },
};

const BatchOfStocks = {
  RequestItems: {
    stocks: MOCK_PRODUCTS.map((item, idx) => {
      const { id } = item;

      return {
        PutRequest: {
          Item: {
            Product_ID: {
              S: id,
            },
            Count: { N: (idx + 1).toString() },
          },
        },
      };
    }),
  },
};

function logSuccessfullyFulfillingTable(tableName) {
  console.log(`SUCCESS: ${tableName} table is fulfilled`);
}

async function main() {
  try {
    await client.send(new BatchWriteItemCommand(BatchOfProducts));
    logSuccessfullyFulfillingTable("products");
    await client.send(new BatchWriteItemCommand(BatchOfStocks));
    logSuccessfullyFulfillingTable("stocks");
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    client.destroy();
  }
}

main();
