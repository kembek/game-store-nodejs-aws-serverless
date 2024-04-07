import { formatJSONResponse } from "../utils";
import { ProductService } from "../services";

export const getAllProductsHandler = async () => {
  console.log("*** getAllProductsHandler");
  const productService = new ProductService();

  try {
    const availableProducts = await productService.getAllProducts();

    return formatJSONResponse(availableProducts);
  } catch (error) {
    const body = {
      message: error.message || "Something went wrong",
    };

    return formatJSONResponse(body, 500);
  } finally {
    productService.destroy();
  }
};
