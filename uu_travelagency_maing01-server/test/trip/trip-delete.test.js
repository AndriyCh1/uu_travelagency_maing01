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

describe("Testing the trip/delete uuCmd...", () => {
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
      name: "Name A",
      date: getTomorrowDate(),
      price: 100,
      freePlaces: 1,
      locationId: locationCreateDtoOut.id,
      text: "Text A",
    };

    const tripCreateDtoOut = await TestHelper.executePostCommand(Commands.TRIP_CREATE, tripCreateDtoIn);
    await TestHelper.executePostCommand(Commands.TRIP_UPDATE_STATE, {
      id: tripCreateDtoOut.id,
      state: "closed",
    });

    const dtoIn = { id: tripCreateDtoOut.id };
    const dtoOut = await TestHelper.executePostCommand(Commands.TRIP_DELETE, dtoIn);

    expect(dtoOut.status).toEqual(200);
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

    const createDtoIn = {
      name: "Incredible Spain",
      date: getTomorrowDate(),
      price: 500,
      freePlaces: 10,
      locationId: locationDtoOut.id,
      text: "You will not forget this unblievable trip...",
    };

    const createDtoOut = await TestHelper.executePostCommand(Commands.TRIP_CREATE, createDtoIn);
    await TestHelper.executePostCommand(Commands.TRIP_UPDATE_STATE, { id: createDtoOut.id, state: "closed" });

    const dtoIn = { id: createDtoOut.id, wrongKey: "This key is unsupported" };
    const dtoOut = await TestHelper.executePostCommand(Commands.TRIP_DELETE, dtoIn);

    expect(createDtoOut.status).toEqual(200);

    const warning = dtoOut.uuAppErrorMap["uu-travel-agency/trip/delete/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList[0]).toEqual("$.wrongKey");
  });

  test("Invalid dtoIn", async () => {
    expect.assertions(2);

    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = {};

    try {
      await TestHelper.executePostCommand(Commands.TRIP_DELETE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/delete/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("Instance is not in correct state, closed", async () => {
    expect.assertions(3);
    await TestHelper.teardown();
    await TestHelper.setup();
    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });

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

    const tripCreateDtoOut = await TestHelper.executePostCommand(Commands.TRIP_CREATE, tripCreateDtoIn);

    await TestHelper.teardown();
    await TestHelper.setup();
    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "closed" });
    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = { id: tripCreateDtoOut.id };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_DELETE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/delete/travelAgencyNotInCorrectState");
      expect(e.message).toEqual("UuObject travelAgency is not in correct state.");
      expect(e.paramMap.state).toEqual("closed");
    }
  });

  test("User not authorized", async () => {
    expect.assertions(2);

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

    await TestHelper.login(Profiles.READERS);

    const tripCreateDtoIn = {
      name: "Name A",
      date: getTomorrowDate(),
      price: 100,
      freePlaces: 1,
      locationId: locationCreateDtoOut.id,
      text: "Text A",
    };

    const tripCreateDtoOut = await TestHelper.executePostCommand(Commands.TRIP_CREATE, tripCreateDtoIn);
    await TestHelper.executePostCommand(Commands.TRIP_UPDATE_STATE, { id: tripCreateDtoOut.id, state: "closed" });

    const dtoIn = { id: tripCreateDtoOut.id };

    await TestHelper.login(Profiles.READERS);

    try {
      await TestHelper.executePostCommand(Commands.TRIP_UPDATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/delete/userNotAuthorized");
      expect(e.message).toEqual("User not authorized.");
    }
  });

  test("Trip does not exist ", async () => {
    expect.assertions(2);
    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = { id: "111111111111111111111111" };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_DELETE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/delete/tripDoesNotExist");
      expect(e.message).toEqual("Trip does not exist.");
    }
  });

  test("Deleting unavailiable", async () => {
    expect.assertions(2);

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
      name: "Name A",
      date: getTomorrowDate(),
      price: 100,
      freePlaces: 1,
      locationId: locationCreateDtoOut.id,
      text: "Text A",
    };

    const tripCreateDtoOut = await TestHelper.executePostCommand(Commands.TRIP_CREATE, tripCreateDtoIn);

    const dtoIn = { id: tripCreateDtoOut.id };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_DELETE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/delete/deletingUnavailable");
      expect(e.message).toEqual("The trip is not in closed state.");
    }
  });
});
