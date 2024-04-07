import { ProductService } from "../services";
import { formatJSONResponse } from "../utils";

export const getProductByIdHandler = async (event) => {
  const { productId } = event.pathParameters || {};
  const productService = new ProductService();

  try {
    const foundProduct = await productService.getProductById(productId);

    if (!foundProduct) {
      return formatJSONResponse(
        {
          message: "Product not found",
        },
        404
      );
    }

    return formatJSONResponse(foundProduct);
  } catch (error) {
    const body = {
      message: error.message || "Something went wrong",
    };

    return formatJSONResponse(body, 500);
  } finally {
    productService.destroy();
  }
};
