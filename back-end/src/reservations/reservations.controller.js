/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const crypto = require("crypto");

function isValidDate(dateString) {
  const dateArr = dateString.split("-");
  const boolCheck =
    dateArr.length === 3 &&
    dateArr[0].length === 4 &&
    dateArr[1].length === 2 &&
    dateArr[2].length === 2;
  return boolCheck ? true : false;
}
async function reservationExists(req, res, next) {
  
  const reservation_id = res.locals.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({ status: 404, message: `Reservation not found: ${reservation_id}` });
  }
}

async function read(req, res) {
  const data = res.locals.reservation;

  res.status(200).json({ data });
}

async function update(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.update(reservation_id, req.body.data.status);
  res.status(200).json({ data });
}

async function validateStatus(req, res, next) {
  const status = req.body.data.status;
  const { reservation_id } = req.params;
  const checkReservation = await service.read(reservation_id);
  if (checkReservation.status === "finished") {
    next({ status: 400, message: `A finished reservation cannot be updated.` });
  }
  if (status !== "seated" && status !== "booked" && status !== "finished" && status !== "cancelled") {
    return next({ status: 400, message: `Invalid status: ${status}` });
  }
  next();
}

async function updateReservation(req, res, next) {
  const data = await service.updateReservation(req.body.data);
  res.status(200).json({ data });
}
async function reservationWeekdayValidation(req, res, next) {
  const date = new Date(req.body.data.reservation_date);
  const isTuesday = date.getUTCDay();
  if (isTuesday === 2) {
    return next({
      status: 400,
      message:
        "reservation_date cannot be Tuesday when the restaurant is closed",
    });
  }
  let now = new Date();
  let reservationDateTime = new Date(
    `${req.body.data.reservation_date}T${req.body.data.reservation_time}`
  );
  if (reservationDateTime < now) {
    return next({
      status: 400,
      message: "reservation_date must be in the future",
    });
  }
  return next();
}

async function reservationTimeValidation(req, res, next) {
  const time = req.body.data.reservation_time;
  if ("10:30" > time || time > "21:30") {
    return next({
      status: 400,
      message: "reservation_time cannot be before 10:30AM or after 9:30PM",
    });
  }

  return next();
}

function isValidTime(timeString) {
  const timeArr = timeString.split(":");
  const boolCheck =
    timeArr.length === 2 && timeArr[0].length === 2 && timeArr[1].length === 2;
  return boolCheck ? true : false;
}
async function list(req, res) {
  const date = req.query.date;
  const data = await service.list(date);
  res.json({
    data,
  });
}

async function hasProps(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = {},
  } = req.body;
  if (!first_name || first_name === "") {
    next({
      status: 400,
      message: "Reservation must include a valid first_name",
    });
  }
  if (!last_name || last_name === "") {
    next({
      status: 400,
      message: "Reservation must include a valid last_name",
    });
  }
  if (!mobile_number || mobile_number === "") {
    next({ status: 400, message: "Reservation must include a mobile_number" });
  }
  if (
    !reservation_date ||
    reservation_date === "" ||
    !isValidDate(reservation_date)
  ) {
    next({
      status: 400,
      message: "Reservation must include a valid reservation_date",
    });
  }
  if (
    !reservation_time ||
    reservation_time === "" ||
    !isValidTime(reservation_time)
  ) {
    next({
      status: 400,
      message: "Reservation must include a valid reservation_time",
    });
  }
  if (!people || people === 0 || !(typeof people === typeof 1)) {
    next({
      status: 400,
      message: "Reservation must include one or more people",
    });
  }
  return next();
}
function hasReservationId(req, res, next) {
  const reservation_id =
    req.params.reservation_id || req.body?.data?.reservation_id;
  if (reservation_id) {
    res.locals.reservation_id = reservation_id;
    next();
  } else {
    next({
      status: 400,
      message: `missing reservation_id`,
    });
  }
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  data.people = Number(data.people);
  res.status(201).json({ data });
}
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProps,
    reservationWeekdayValidation,
    reservationTimeValidation,
    asyncErrorBoundary(create),
  ],
  reservationExists: [hasReservationId, reservationExists],
  read: [hasReservationId, reservationExists, asyncErrorBoundary(read)],
  update: [
    hasReservationId,
    reservationExists,
    validateStatus,
    asyncErrorBoundary(update),
  ],
  updateReservation: [
    hasProps,
    reservationWeekdayValidation,
    reservationTimeValidation,
    hasReservationId,
    reservationExists,
    asyncErrorBoundary(updateReservation),
  ],
};
