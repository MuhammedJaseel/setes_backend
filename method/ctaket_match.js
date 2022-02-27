const { ObjectId } = require("mongodb");
const { getTable, postTable } = require("../module/database");
const { getnolimitTables, getTables } = require("../module/database");
const { putTable, deleteTable } = require("../module/database");
const { dateTomyFormat } = require("../module/simple");

exports.ctakerGetMatch = async (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.booking_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  var error = null;
  await getTable("bookings", { _id })
    .then(async (booking) => {
      if (booking === null) {
        error = "Item not found";
        return;
      } else {
        try {
          for (let a = 0; a < booking.authers.length; a++) {
            booking.authers[a] = ObjectId(booking.authers[a]);
          }
          await getTables("users", {
            filter: { _id: { $in: booking.authers } },
            project: { name: 1, id: 1, img: 1 },
          })
            .then((users) => (booking.authers = users))
            .catch(() => {
              error = "Database error on Slots";
              return;
            });
          var _id = ObjectId(booking.slot_id);
          await getTable("slots", { _id })
            .then((slot) => {
              if (slot === null) {
                error = "Slot not found";
                return;
              } else booking.slot = slot;
            })
            .catch(() => {
              error = "Database error on Slots";
              return;
            });
          _id = ObjectId(booking.slot.truf__id);
          console.log(_id);
          await getTable("trufs", { _id })
            .then((truf) => {
              if (truf === null) {
                error = "Truf not found";
                return;
              } else booking.truf = truf;
            })
            .catch(() => {
              error = "Database error on Trufs";
              return;
            });
        } catch (err) {
          error = "Database error on Bookings";
        }
      }
      if (error === null) res.send(booking);
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
  if (error !== null) res.status(404).send({ msg: error });
};

exports.ctakerGetAllMatchs = async (req, res) => {
  var ctaker = req.query.ctaker_id;
  await getnolimitTables("bookings", { filter: { ctaker } })
    .then(async (bookings) => {
      for (let i = 0; i < bookings.length; i++) {
        try {
          var _id = ObjectId(bookings[i].slot_id);
          await getTable("slots", { _id }).then(
            (slot) => (bookings[i].slot = slot)
          );
        } catch (error) {}
      }
      res.send(bookings);
    })
    .catch(() => res.status(502).send({ msg: "Error: Database error" }));
};

exports.ctakerGetMatchs = async (req, res) => {
  var ctaker = req.query.ctaker_id;
  var response = [];
  var complated = false;
  var error = false;
  var today = new Date();
  today.setDate(today.getDate() - 1);
  var date;
  while (!complated) {
    today.setDate(today.getDate() + 1);
    date = dateTomyFormat(today);
    await getnolimitTables("bookings", { filter: { date, ctaker } })
      .then((bookings) => response.push({ title: date, data: bookings ?? [] }))
      .catch((e) => (error = true));
    if (error) break;
    var length = 0;
    for (let i = 0; i < response.length; i++) length += response[i].data.length;
    if (length > 30 || response.length > 6) complated = true;
  }
  if (error) res.status(502).send({ msg: "Database Error" });
  else {
    for (let i = 0; i < response.length; i++)
      for (let j = 0; j < response[i].data.length; j++) {
        try {
          var _id = ObjectId(response[i].data[j].slot_id);
          await getTable("slots", { _id }).then(
            (slot) => (response[i].data[j].slot = slot)
          );
        } catch (error) {}
      }
    res.send(response);
  }
};

exports.ctakerPostMatch = (req, res) => {
  var body = req.body;
  body.status = "Active";
  body.created = Date();
  body.updated = Date();
  postTable("ctakers", body)
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.ctakerPutMatch = (req, res) => {
  var _id;
  var body = req.body;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  body.updated = Date();
  putTable("ctakers", { _id }, body)
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.ctakerDeleteMatch = (req, res) => {
  var _id;
  var body = req.body;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  body.updated = Date();
  deleteTable("ctakers", { _id })
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.ctakerPutslot = async (req, res) => {
  var body = req.body;
  var error = false;
  var _id;
  try {
    _id = ObjectId(req.query.booking_id);
  } catch (e) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }

  if (body.hasOwnProperty("events")) {
    await getTable("bookings", { _id })
      .then((data) => {
        body.events.created = new Date();
        if (data === null) body.events = [body.events];
        else {
          data.events.push(body.events);
          body.events = data.events;
        }
      })
      .catch(() => {
        res.status(502).send({ msg: "Database Error" });
        error = true;
      });
  }

  if (error) return;

  if (body.hasOwnProperty("status")) {
    if (body.status === "Started") {
      body.starting_time = new Date();
      body.events = [];
      body.goals = { r: 0, b: 0 };
      body.fouls = { r: 0, b: 0 };
      body.rcs = { r: 0, b: 0 };
      body.ycs = { r: 0, b: 0 };
      body.shots = { r: 0, b: 0 };
      body.possessions = { r: 0, b: 0 };
      body.offsides = { r: 0, b: 0 };
      body.corners = { r: 0, b: 0 };
    }
    if (body.status === "Fulltime") body.ending_time = new Date();
  }

  await putTable("bookings", { _id }, { $set: body })
    .then((data) => {
      if (data.modifiedCount === 0)
        res.status(502).send({ msg: "Database Error" });
      else res.send({ msg: "Succesfully Updated" });
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

// [
//   {
//     title: "Goals",
//     data: {
//       time: "10:10",
//       team: "b",
//       player: "Guest123",
//     },
//   },

//   {
//     title: "Fouls",
//     data: {
//       time: "10:10",
//       who: "Guest123",
//       whom: "Guest124",
//       team: "b",
//     },
//   },

//   {
//     title: "Yellow card",
//     data: {
//       time: "10:10",
//       team: "b",
//       player: "Guest123",
//     },
//   },
//   {
//     title: "Red card",
//     data: {
//       time: "10:10",
//       team: "b",
//       player: "Guest123",
//     },
//   },
// ];
