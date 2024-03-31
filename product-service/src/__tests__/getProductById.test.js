import { getProductById } from "../getProductById";

describe("getProductById", () => {
  it("Should return response", async () => {
    expect(await getProductById()).toBeTruthy();
  });
});
