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

describe("Testing the trip/create uuCmd...", () => {
  test("HDS", async () => {
    await TestHelper.login(Profiles.LOCATION_EXECUTIVES);

    const locationDtoIn = {
      name: "Hotel Best Front Maritim",
      address: "Passeig de Garcia Fària, 69, 08019 Barcelona, Spain",
      country: "Spain",
      phone: "+34 933 03 44 40",
      link: "https://www.booking.com/hotel/es/front-maritim.uk.html",
      image: getImageStream(),
    };

    const locationDtoOut = await TestHelper.executePostCommand(Commands.LOCATION_CREATE, locationDtoIn);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: locationDtoOut.id,
      text: "You will not forget this unblievable trip...",
    };

    const dtoOut = await TestHelper.executePostCommand(Commands.TRIP_CREATE, dtoIn);

    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.name).toEqual(dtoIn.name);
    expect(dtoOut.date).toEqual(dtoIn.date);
    expect(dtoOut.price).toEqual(dtoIn.price);
    expect(dtoOut.freePlaces).toEqual(dtoIn.freePlaces);
    expect(dtoOut.locationId).toEqual(dtoIn.locationId);
    expect(dtoOut.text).toEqual(dtoIn.text);
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("Unsupported keys", async () => {
    expect.assertions(5);

    await TestHelper.login(Profiles.LOCATION_EXECUTIVES);

    const locationDtoIn = {
      name: "Hotel Best Front Maritim",
      address: "Passeig de Garcia Fària, 69, 08019 Barcelona, Spain",
      country: "Spain",
      phone: "+34 933 03 44 40",
      link: "https://www.booking.com/hotel/es/front-maritim.uk.html",
      image: getImageStream(),
    };

    const locationDtoOut = await TestHelper.executePostCommand(Commands.LOCATION_CREATE, locationDtoIn);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: locationDtoOut.id,
      text: "You will not forget this unblievable trip...",
      wrongKey: "This key is unsupported",
    };

    const dtoOut = await TestHelper.executePostCommand(Commands.TRIP_CREATE, dtoIn);

    expect(dtoOut.status).toEqual(200);

    const warning = dtoOut.uuAppErrorMap["uu-travel-agency/trip/create/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList[0]).toEqual("$.wrongKey");
  });

  test("Invalid dtoIn", async () => {
    expect.assertions(2);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = {
      name: "Incredible Spain",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_CREATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/create/invalidDtoIn");
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
    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: "111111111111111111111111",
      text: "You will not forget this unblievable trip...",
      wrongKey: "This key is unsupported",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_CREATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/create/travelAgencyNotInCorrectState");
      expect(e.message).toEqual("UuObject travelAgency is not in correct state.");
      expect(e.paramMap.state).toEqual("closed");
    }
  });

  test("Invalid date", async () => {
    expect.assertions(2);

    await TestHelper.login(Profiles.LOCATION_EXECUTIVES);

    const locationDtoIn = {
      name: "Hotel Best Front Maritim",
      address: "Passeig de Garcia Fària, 69, 08019 Barcelona, Spain",
      country: "Spain",
      phone: "+34 933 03 44 40",
      link: "https://www.booking.com/hotel/es/front-maritim.uk.html",
      image: getImageStream(),
    };

    const locationDtoOut = await TestHelper.executePostCommand(Commands.LOCATION_CREATE, locationDtoIn);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const invalidDate = new Date().toISOString().slice(0, 10);

    const dtoIn = {
      name: "Incredible Spain",
      date: invalidDate,
      price: 500,
      freePlaces: 10,
      locationId: locationDtoOut.id,
      text: "You will not forget this unblievable trip...",
      wrongKey: "This key is unsupported",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_CREATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/create/invalidDate");
      expect(e.message).toEqual("Invalid date - it cannot be less then creationDate.");
    }
  });

  test("Location does not exist", async () => {
    expect.assertions(2);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const nonexistentLocationId = "111111111111111111111111";

    const dtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: nonexistentLocationId,
      text: "You will not forget this unblievable trip...",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_CREATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/create/locationDoesNotExist");
      expect(e.message).toEqual("Provided location does not exist.");
    }
  });

  test("Create failed", async () => {
    await TestHelper.login(Profiles.LOCATION_EXECUTIVES);

    const locationDtoIn = {
      name: "Hotel Best Front Maritim",
      address: "Passeig de Garcia Fària, 69, 08019 Barcelona, Spain",
      country: "Spain",
      phone: "+34 933 03 44 40",
      link: "https://www.booking.com/hotel/es/front-maritim.uk.html",
      image: getImageStream(),
    };

    const locationDtoOut = await TestHelper.executePostCommand(Commands.LOCATION_CREATE, locationDtoIn);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: locationDtoOut.id,
      text: "You will not forget this unblievable trip...",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_CREATE, { ...dtoIn, awid: "awid" });
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/create/tripDaoCreateFailed");
      expect(e.message).toEqual("Create trip by trip DAO create failed.");
    }
  });
});
