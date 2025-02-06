const carTypes = ["Compact", "Electric", "Cabrio", "Racer"];
const minLicenceYears = 1;

function price({
  pickUp,
  dropOff,
  pickUpDate,
  dropOffDate,
  carType,
  age,
  licenceIssueDate,
}) {
  const carClass = getCarClass(carType);
  const days = getDays(pickUpDate, dropOffDate);
  const season = getSeason(pickUpDate, dropOffDate);
  const licenceYearsHeld = getLicenceYearsHeld(licenceIssueDate);

  const isElegibleMessage = isDriverElegible({
    age,
    carClass,
    licenceYearsHeld,
  });

  if (isElegibleMessage !== true) {
    return isElegibleMessage;
  }

  let rentalPrice = age * days;

  rentalPrice = applyPriceModifiers(rentalPrice, {
    carClass,
    days,
    season,
    age,
    licenceYearsHeld,
  });

  return "$" + rentalPrice.toFixed(2);
}

function isDriverElegible({ age, carClass, licenceYearsHeld }) {
  if (age < 18) {
    return "Driver too young - cannot quote the price";
  }

  if (licenceYearsHeld <= minLicenceYears) {
    return "Driver has not held the licence long enough";
  }

  if (age <= 21 && carClass !== "Compact") {
    return "Drivers 21 y/o or less can only rent Compact vehicles";
  }

  return true;
}

function applyPriceModifiers(
  price,
  { carClass, age, season, days, licenceYearsHeld },
) {
  if (carClass === "Racer" && age <= 25 && season === "High") {
    price *= 1.5;
  }

  if (licenceYearsHeld < 2) {
    price *= 1.3;
  }

  if (season === "High") {
    price *= 1.15;
  }

  if (licenceYearsHeld < 3 && season === "High") {
    price += 15;
  }

  if (days > 10 && season === "Low") {
    price *= 0.9;
  }

  return price;
}

function getLicenceYearsHeld(licenceIssueDate) {
  const millisecondsInYear = 24 * 60 * 60 * 1000 * 365.5;

  const issueDate = new Date(licenceIssueDate);
  const currentDate = new Date();

  const yearsHeld = (currentDate - issueDate) / millisecondsInYear;

  return yearsHeld;
}

function getCarClass(carType) {
  if (carTypes.includes(carType)) {
    return carType;
  }

  return "Unknown Car Type";
}

function getDays(pickUpDate, dropOffDate) {
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  const firstDate = new Date(pickUpDate);
  const secondDate = new Date(dropOffDate);

  const differenceInMilliseconds = Math.abs(firstDate - secondDate);

  return Math.ceil(differenceInMilliseconds / millisecondsInADay);
}

function getSeason(pickUpDate, dropOffDate) {
  const seasonStartMonth = 3; // April, months are zero-based
  const seasonEndMonth = 9; // October

  const pickUpMonth = new Date(pickUpDate).getMonth();
  const dropOffMonth = new Date(dropOffDate).getMonth();

  const isHighSeason =
    (pickUpMonth >= seasonStartMonth && pickUpMonth <= seasonEndMonth) ||
    (dropOffMonth >= seasonStartMonth && dropOffMonth <= seasonEndMonth) ||
    (pickUpMonth < seasonStartMonth && dropOffMonth > seasonEndMonth);

  return isHighSeason ? "High" : "Low";
}

exports.price = price;
