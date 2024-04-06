import { getAllProductsHandler } from "../handlers/getAllProducts";

describe("getAllProductsHandler", () => {
  it("Should return response", async () => {
    expect(await getAllProductsHandler()).toBeTruthy();
  });
});
