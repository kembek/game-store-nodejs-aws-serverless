import joi from "joi";
import { formatJSONResponse } from "../utils";
import { ProductService } from "../services";

const schema = joi.object({
  title: joi.required().strict(),
  description: joi.required().strict(),
  price: joi.number().required().positive().strict(),
  count: joi.number().required().positive().strict(),
});

export const createProductHandler = async (event) => {
  console.log("*** createProductHandler: ", event);
  const productService = new ProductService();

  try {
    const { value, error } = schema.validate(JSON.parse(event.body));

    if (error) {
      return formatJSONResponse(
        {
          message: error.details.map((err) => err.message).join(", "),
        },
        400
      );
    }

    const product = await productService.createProduct(value);
    return formatJSONResponse({ product });
  } catch (error) {
    const body = {
      message: error.message || "Something went wrong",
    };

    return formatJSONResponse(body, 500);
  } finally {
    productService.destroy();
  }
};
