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

describe("Testing the trip/update uuCmd...", () => {
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

    const dtoIn = {
      id: tripCreateDtoOut.id,
      date: getTomorrowDate(),
      name: "Name B",
      price: 500,
      text: "Text B",
    };

    const dtoOut = await TestHelper.executePostCommand(Commands.TRIP_UPDATE, dtoIn);

    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.name).toEqual(dtoIn.name);
    expect(dtoOut.price).toEqual(dtoIn.price);
    expect(dtoOut.text).toEqual(dtoIn.text);
    expect(dtoOut.uuAppErrorMap).toEqual({});
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
      id: "64247c342c17b62df05c2504",
      date: getTomorrowDate(),
      name: "Name A",
      price: 500,
      text: "Text A",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_UPDATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/update/travelAgencyNotInCorrectState");
      expect(e.message).toEqual("UuObject travelAgency is not in correct state.");
      expect(e.paramMap.state).toEqual("closed");
    }
  });

  test("Trip does not exist ", async () => {
    expect.assertions(2);
    await TestHelper.login(Profiles.TRIP_EXECUTIVES);

    const dtoIn = {
      id: "64247c342c17b62df05c2504",
      date: getTomorrowDate(),
      name: "Name A",
      price: 500,
      text: "Text A",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_UPDATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/update/tripDoesnotExist");
      expect(e.message).toEqual("Trip does not exist.");
    }
  });

  test("Location does not exist", async () => {
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

    const nonexistentLocationId = "111111111111111111111111";

    const dtoIn = {
      id: tripCreateDtoOut.id,
      name: "Name B",
      date: getTomorrowDate(),
      price: 500,
      locationId: nonexistentLocationId,
      text: "Text B",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_UPDATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/update/locationDoesNotExist");
      expect(e.message).toEqual("Provided location does not exist.");
    }
  });

  test("Invalid date", async () => {
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

    const invalidDate = new Date().toISOString().slice(0, 10);

    const dtoIn = {
      id: tripCreateDtoOut.id,
      name: "Incredible Spain",
      date: invalidDate,
      price: 500,
      freePlaces: 10,
      locationId: locationCreateDtoOut.id,
      text: "You will not forget this unblievable trip...",
      wrongKey: "This key is unsupported",
    };

    try {
      await TestHelper.executePostCommand(Commands.TRIP_UPDATE, dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/update/invalidDate");
      expect(e.message).toEqual("Invalid date - it cannot be less then creationDate.");
    }
  });
  test("Update failed", async () => {
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
      await TestHelper.executePostCommand(Commands.TRIP_UPDATE, { ...dtoIn, awid: "awid" });
    } catch (e) {
      expect(e.code).toEqual("uu-travel-agency/trip/update/tripDaoUpdateFailed");
      expect(e.message).toEqual("Update trip by trip Dao update failed.");
    }
  });
});
