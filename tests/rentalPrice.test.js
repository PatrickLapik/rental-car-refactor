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
  test("should increase price 50% when 25 years old or younger driver has selected Racer car class with season high with", () => {
    const age = 20;
    const price = 100;
    const season = "High";
    const carClass = "Racer";

    expect(rental.applyPriceModifiers(price, { age, season, carClass })).toBe(
      150,
    );
  });
});

//function applyPriceModifiers(
//  price,
//  { carClass, age, season, days, licenceYearsHeld },
//) {
//  if (carClass === "Racer" && age <= 25 && season === "High") {
//    price *= 1.5;
//  }
//
//  if (licenceYearsHeld < 2) {
//    price *= 1.3;
//  }
//
//  if (season === "High") {
//    price *= 1.15;
//  }
//
//  if (licenceYearsHeld < 3 && season === "High") {
//    price += 15;
//  }
//
//  if (days > 10 && season === "Low") {
//    price *= 0.9;
//  }
//
//  return price;
//}
