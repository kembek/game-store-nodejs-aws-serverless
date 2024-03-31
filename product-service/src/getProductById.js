import { availableProducts } from "./mock/data";
import { formatJSONResponse } from "./utils";

export const getProductByIdHandler = async (event) => {
  const { productId } = event.pathParameters || {};

  try {
    const foundProduct = availableProducts.find(
      (product) => product.id.toLowerCase() === productId.toLowerCase()
    );

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
  }
};
