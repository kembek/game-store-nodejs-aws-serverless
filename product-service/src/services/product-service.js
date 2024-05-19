import { v4 as uuidv4 } from "uuid";
import DynamoDBService from "./dynamodb-service";

const PRODUCT_TABLE_NAME = "products";
const STOCK_TABLE_NAME = "stocks";

const formatItem = (item) =>
  Object.entries(item).reduce((acc, attribute) => {
    const [key, rawValue] = attribute;
    let value = null;

    if (rawValue?.N) {
      value = parseInt(rawValue.N);
    } else if (rawValue.S) {
      value = rawValue.S;
    }

    acc[key.toLowerCase()] = value;
    return acc;
  }, {});

const formatResponseItems = (items) => items.map((item) => formatItem(item));

class ProductService extends DynamoDBService {
  async getAllProducts() {
    const productsResponse = await this.scan({
      TableName: PRODUCT_TABLE_NAME,
      Select: "ALL_ATTRIBUTES",
    });
    const stocksResponse = await this.scan({
      TableName: STOCK_TABLE_NAME,
      Select: "ALL_ATTRIBUTES",
    });

    const products = formatResponseItems(productsResponse.Items);
    const stocks = formatResponseItems(stocksResponse.Items);

    return products.map((product) => {
      const foundStock = stocks.find(
        (stock) => stock.product_id === product.id
      );

      return this.joinProductByStockCount(product, foundStock);
    });
  }

  async getProductById(id) {
    const productResponse = await this.get({
      TableName: PRODUCT_TABLE_NAME,
      Key: {
        ID: {
          S: id,
        },
      },
    });
    const stockResponse = await this.get({
      TableName: STOCK_TABLE_NAME,
      Key: {
        Product_ID: {
          S: id,
        },
      },
    });
    const product = formatItem(productResponse.Item);
    const stock = formatItem(stockResponse.Item);

    return this.joinProductByStockCount(product, stock);
  }

  async createProduct(productParams) {
    const id = uuidv4();
    const { title, description, price, count } = productParams;

    const productInput = {
      TableName: PRODUCT_TABLE_NAME,
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
          N: `${price}`,
        },
      },
    };
    const countInput = {
      TableName: STOCK_TABLE_NAME,
      Item: {
        Product_ID: {
          S: id,
        },
        Count: {
          N: `${count}`,
        },
      },
    };

    await this.createWithTransaction({
      TransactItems: [{ Put: productInput }, { Put: countInput }],
    });

    return {
      ...productParams,
      id,
      price: +price,
      count: +count,
    };
  }

  joinProductByStockCount(product, stock) {
    return {
      ...product,
      count: stock?.count,
    };
  }
}

export default ProductService;
