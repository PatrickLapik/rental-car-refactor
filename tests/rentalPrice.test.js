const rental = require("../src/rentalPrice");

describe("isDriverElegible", () => {
  test("Driver cant rent car under 18", () => {
    const age = 10;

    expect(rental.isDriverElegible({ age })).toBe(
      "Driver too young - cannot quote the price",
    );
  });

  test("Driver cant rent car with licence held for less than a year", () => {
    const age = 19;
    const licenceYearsHeld = 0.5;

    expect(rental.isDriverElegible({ age, licenceYearsHeld })).toBe(
      "Driver has not held the licence long enough",
    );
  });

  test("Driver cant rent any other car than Compact under 21 with licence held for at least a year", () => {
    const age = 20;
    const carClass = "Racer";
    const licenceYearsHeld = 1;

    expect(rental.isDriverElegible({ age, carClass, licenceYearsHeld })).toBe(
      "Drivers 21 y/o or less can only rent Compact vehicles",
    );
  });

  test("Driver can rent Compact car when over 18, with at least a year held on licence", () => {
    const age = 18;
    const carClass = "Compact";
    const licenceYearsHeld = 1;

    expect(rental.isDriverElegible({ age, carClass, licenceYearsHeld })).toBe(
      true,
    );
  });
});

describe("getCarClass", () => {
  test("should return unknown when given wrong type", () => {
    const carClass = "stupidCar";

    expect(rental.getCarClass(carClass)).toBe("Unknown Car Type");
  });

  test("should return the type when given a valid type", () => {
    const carClass = "Racer";

    expect(rental.getCarClass(carClass)).toBe("Racer");
  });
});

describe("getLicenceYearsHeld", () => {
  test("should return exactly 1 year when inputed 1 year back from time now", () => {
    let issueDate = new Date();
    issueDate = issueDate.setFullYear(issueDate.getFullYear() - 1);

    console.log(issueDate);

    expect(rental.getLicenceYearsHeld(issueDate)).toBe(1);
  });
});

describe("getDays", () => {
  test("should return 10 days between two dates that are 10 days apart", () => {
    const date1 = "2024-01-01";
    const date2 = "2024-01-11";

    expect(rental.getDays(date1, date2)).toBe(10);
  });
});

describe("getSeason", () => {
  test("should return High when both dates are within high season", () => {
    expect(rental.getSeason("2024-06-01", "2024-08-15")).toBe("High");
  });

  test("should return Low when both dates are within low season", () => {
    expect(rental.getSeason("2024-01-10", "2024-02-20")).toBe("Low");
  });

  test("should return High when pickup date is in low season but drop-off date is in high season", () => {
    expect(rental.getSeason("2024-02-28", "2024-04-05")).toBe("High");
  });

  test("should return High when pickup date is in high season but drop-off date is in low season", () => {
    expect(rental.getSeason("2024-09-30", "2024-11-01")).toBe("High");
  });

  test("should return High when pickup date is before high season and drop-off date is after high season", () => {
    expect(rental.getSeason("2024-02-28", "2024-11-01")).toBe("High");
  });
});

describe("applyPriceModifiers", () => {
  test("should increase price 72.5% when 25 years old or younger driver has selected Racer car class while high season is going on", () => {
    const age = 20;
    const licenceYearsHeld = 3;
    const price = 100;
    const season = "High";
    const carClass = "Racer";
    const days = 5;

    expect(
      rental.applyPriceModifiers(price, {
        age,
        season,
        carClass,
        licenceYearsHeld,
        days,
      }),
    ).toBe(172.5);
  });

  test("should increase price 30% when licence years held is less than 2", () => {
    const age = 30;
    const licenceYearsHeld = 1;
    const price = 100;
    const season = "Low";
    const carClass = "Cabrio";
    const days = 7;

    expect(
      rental.applyPriceModifiers(price, {
        age,
        season,
        carClass,
        licenceYearsHeld,
        days,
      }),
    ).toBe(130);
  });

  test("should increase price 15% during high season", () => {
    const age = 35;
    const licenceYearsHeld = 5;
    const price = 100;
    const season = "High";
    const carClass = "Cabrio";
    const days = 4;

    expect(
      rental.applyPriceModifiers(price, {
        age,
        season,
        carClass,
        licenceYearsHeld,
        days,
      }),
    ).toBe(115);
  });

  test("should increase price by 15 when licence years held is less than 3 and it's high season", () => {
    const age = 40;
    const licenceYearsHeld = 2;
    const price = 100;
    const season = "High";
    const carClass = "Cabrio";
    const days = 6;

    expect(
      rental.applyPriceModifiers(price, {
        age,
        season,
        carClass,
        licenceYearsHeld,
        days,
      }),
    ).toBe(130);
  });

  test("should apply a 10% discount when rental is more than 10 days in low season", () => {
    const age = 45;
    const licenceYearsHeld = 10;
    const price = 200;
    const season = "Low";
    const carClass = "Cabrio";
    const days = 11;

    expect(
      rental.applyPriceModifiers(price, {
        age,
        season,
        carClass,
        licenceYearsHeld,
        days,
      }),
    ).toBe(180);
  });

  test("should correctly combine multiple price modifications", () => {
    const age = 22;
    const licenceYearsHeld = 1;
    const price = 100;
    const season = "High";
    const carClass = "Racer";
    const days = 12;

    expect(
      rental.applyPriceModifiers(price, {
        age,
        season,
        carClass,
        licenceYearsHeld,
        days,
      }),
    ).toBe(239.25);
  });

  test("should not modify price when no conditions apply", () => {
    const age = 30;
    const licenceYearsHeld = 5;
    const price = 100;
    const season = "Low";
    const carClass = "Cabrio";
    const days = 5;

    expect(
      rental.applyPriceModifiers(price, {
        age,
        season,
        carClass,
        licenceYearsHeld,
        days,
      }),
    ).toBe(100);
  });
});

describe("price", () => {
  test("should return error message with a newly created licence", () => {
    const priceResult = rental.price({
      pickUp: "Location A",
      dropOff: "Location B",
      pickUpDate: "2025-07-01",
      dropOffDate: "2025-07-06",
      carType: "Sedan",
      age: 25,
      licenceIssueDate: "2024-07-01",
    });

    expect(priceResult).toBe("Driver has not held the licence long enough");
  });

  test("should return error if driver is too young", () => {
    const priceResult = rental.price({
      pickUp: "Location A",
      dropOff: "Location B",
      pickUpDate: "2025-07-01",
      dropOffDate: "2025-07-06",
      carType: "Sedan",
      age: 17,
      licenceIssueDate: "2024-07-01",
    });

    expect(priceResult).toBe("Driver too young - cannot quote the price");
  });

  test("should return error if driver hasn't held licence long enough", () => {
    const priceResult = rental.price({
      pickUp: "Location A",
      dropOff: "Location B",
      pickUpDate: "2025-07-01",
      dropOffDate: "2025-07-06",
      carType: "Sedan",
      age: 25,
      licenceIssueDate: "2024-07-01",
    });

    expect(priceResult).toBe("Driver has not held the licence long enough");
  });

  test("should return error if driver is under 21 and selects non-compact car", () => {
    const priceResult = rental.price({
      pickUp: "Location A",
      dropOff: "Location B",
      pickUpDate: "2025-07-01",
      dropOffDate: "2025-07-06",
      carType: "Sedan",
      age: 20,
      licenceIssueDate: "2022-07-01",
    });

    expect(priceResult).toBe(
      "Drivers 21 y/o or less can only rent Compact vehicles",
    );
  });

  test("should correctly apply price modifiers for high season and a young driver", () => {
    const priceResult = rental.price({
      pickUp: "Location A",
      dropOff: "Location B",
      pickUpDate: "2025-07-01",
      dropOffDate: "2025-07-06",
      carType: "Compact",
      age: 22,
      licenceIssueDate: "2021-07-01",
    });

    expect(priceResult).toBe("$126.50");
  });
});
