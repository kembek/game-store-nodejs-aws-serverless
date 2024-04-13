import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";

const DEFAULT_REGION = "eu-west-1";

class DynamoDBService {
  constructor(region = DEFAULT_REGION) {
    this.dynamoDBClient = new DynamoDBClient({
      region,
    });
  }

  async scan(input) {
    return await this.dynamoDBClient.send(new ScanCommand(input));
  }

  async get(input) {
    return await this.dynamoDBClient.send(new GetItemCommand(input));
  }

  async create(input) {
    return await this.dynamoDBClient.send(new PutItemCommand(input));
  }

  async createWithTransaction(input) {
    return await this.dynamoDBClient.send(new TransactWriteItemsCommand(input));
  }

  destroy() {
    this.dynamoDBClient.destroy();
  }
}

export default DynamoDBService;
