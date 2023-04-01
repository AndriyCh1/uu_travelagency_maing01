const { TestHelper } = require("uu_appg01_server-test");
const { Commands, Profiles } = require("../common");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login(Profiles.AWID_LICENSE_OWNER, false, false);

    let dtoIn = {
      uuAppProfileAuthorities: "urn:uu:GGALL",
    };

    let result = await TestHelper.executePostCommand(Commands.TRAVEL_AGENCY_INIT, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
