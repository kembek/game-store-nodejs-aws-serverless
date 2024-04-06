import { formatJSONResponse } from "../utils";
import { availableProducts } from "../mock/data";

export const getAllProductsHandler = async () => {
  try {
    return formatJSONResponse(availableProducts);
  } catch (error) {
    const body = {
      message: error.message || "Something went wrong",
    };

    return formatJSONResponse(body, 500);
  }
};
