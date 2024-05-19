import { catalogBatchProcessHandler } from "../handlers/catalogBatchProcess";

const mockGetConfig = jest.fn();

jest.mock("../utils", () => ({
  getConfig: () => mockGetConfig,
}));

describe("catalogBatchProcessHandler", () => {
  beforeEach(() => {
    mockGetConfig.mockReturnValue({
      region: "region",
      topicArn: "topicArn",
    });
  });

  it("Should return response", async () => {
    expect(await catalogBatchProcessHandler({ Records: [] })).toBeUndefined();
  });
});
