import { getAllProductsHandler } from "../getAllProducts";

describe("getAllProductsHandler", () => {
  it("Should return response", async () => {
    expect(await getAllProductsHandler()).toBeTruthy();
  });
});
