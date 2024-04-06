import { getProductByIdHandler } from "../handlers/getProductById";

describe("getProductByIdHandler", () => {
  it("Should return response", async () => {
    expect(await getProductByIdHandler({ pathParameters: "1" })).toBeTruthy();
  });
});
