const { TestHelper } = require("uu_appg01_server-test");
const { Commands, Profiles } = require("../common");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGALL" });
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the load uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login(Profiles.TRIP_EXECUTIVES, false, false);

    let dtoIn = {};
    let result = await TestHelper.executeGetCommand(Commands.TRAVEL_AGENCY_LOAD, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
