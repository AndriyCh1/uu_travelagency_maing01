const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
  await TestHelper.login("Executives");
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("Trip create, uuCMD tests", () => {
  test("HDS", async () => {});

  test("Unsupported keys", async () => {});
});
