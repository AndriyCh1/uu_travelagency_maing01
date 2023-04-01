const { TestHelper } = require("uu_appg01_server-test");
const { getImageStream, getTomorrowDate } = require("../common");
const { Commands, Profiles } = require("../common");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("Testing the trip/list uuCmd...", () => {
  test("HDS", async () => {
    await TestHelper.login(Profiles.LOCATION_EXECUTIVES);

    const locationCreateDtoIn = {
      name: "Hotel Best Front Maritim",
      address: "Passeig de Garcia Fària, 69, 08019 Barcelona, Spain",
      country: "Spain",
      phone: "+34 933 03 44 40",
      link: "https://www.booking.com/hotel/es/front-maritim.uk.html",
      image: getImageStream(),
    };

    const locationCreateDtoOut = await TestHelper.executePostCommand(Commands.LOCATION_CREATE, locationCreateDtoIn);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const tripCreateDtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: locationCreateDtoOut.id,
      text: "You will not forget this unblievable trip...",
    };

    await TestHelper.executePostCommand(Commands.TRIP_CREATE, { ...tripCreateDtoIn, name: "A" });
    await TestHelper.executePostCommand(Commands.TRIP_CREATE, { ...tripCreateDtoIn, name: "B" });
    await TestHelper.executePostCommand(Commands.TRIP_CREATE, { ...tripCreateDtoIn, name: "C" });

    const dtoOut = await TestHelper.executeGetCommand(Commands.TRIP_LIST, {});

    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.pageInfo.total).toEqual(3);
    expect(dtoOut.itemList[0].name).toEqual("A");
    expect(dtoOut.itemList[1].name).toEqual("B");
    expect(dtoOut.itemList[2].name).toEqual("C");
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("HDS, non-default values (sort by price, descending ordering)", async () => {
    await TestHelper.login(Profiles.LOCATION_EXECUTIVES);

    const locationCreateDtoIn = {
      name: "Hotel Best Front Maritim",
      address: "Passeig de Garcia Fària, 69, 08019 Barcelona, Spain",
      country: "Spain",
      phone: "+34 933 03 44 40",
      link: "https://www.booking.com/hotel/es/front-maritim.uk.html",
      image: getImageStream(),
    };

    const locationCreateDtoOut = await TestHelper.executePostCommand(Commands.LOCATION_CREATE, locationCreateDtoIn);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const tripCreateDtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: locationCreateDtoOut.id,
      text: "You will not forget this unblievable trip...",
    };

    await TestHelper.executePostCommand(Commands.TRIP_CREATE, { ...tripCreateDtoIn, name: "A", price: 100 });
    await TestHelper.executePostCommand(Commands.TRIP_CREATE, { ...tripCreateDtoIn, name: "B", price: 200 });
    await TestHelper.executePostCommand(Commands.TRIP_CREATE, { ...tripCreateDtoIn, name: "C", price: 300 });

    const dtoIn = { sortBy: "price", order: "desc" };
    const dtoOut = await TestHelper.executeGetCommand(Commands.TRIP_LIST, dtoIn);

    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.pageInfo.total).toEqual(3);
    expect(dtoOut.itemList[0].name).toEqual("C");
    expect(dtoOut.itemList[1].name).toEqual("B");
    expect(dtoOut.itemList[2].name).toEqual("A");
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("Unsupported keys", async () => {
    expect.assertions(5);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoOut = await TestHelper.executeGetCommand(Commands.TRIP_LIST, { wrongKey: "wrongKey" });

    expect(dtoOut.status).toEqual(200);

    const warning = dtoOut.uuAppErrorMap["uu-travel-agency/trip/list/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList[0]).toEqual("$.wrongKey");
  });

  test("Invalid dtoIn", async () => {
    expect.assertions(2);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = { order: "-" };

    try {
      await TestHelper.executeGetCommand(Commands.TRIP_LIST, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/list/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("Instance is not in correct state, closed", async () => {
    expect.assertions(3);
    await TestHelper.teardown();
    await TestHelper.setup();
    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "closed" });
    await TestHelper.login(Profiles.READERS);

    try {
      await TestHelper.executeGetCommand(Commands.TRIP_LIST, {});
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/list/travelAgencyNotInCorrectState");
      expect(e.message).toEqual("UuObject travelAgency is not in correct state.");
      expect(e.paramMap.state).toEqual("closed");
    }
  });
});
