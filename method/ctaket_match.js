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

  var table = "bookings";
  if (req.query.status === "Started") table = "matchs_live";
  if (req.query.status === "Fulltime") table = "matchs_fulltime";
  if (req.query.status === "Cancelled") table = "matchs_cancellled";

  await getTable(table, { _id })
    .then(async (booking) => {
      if (booking === null) {
        error = "Item not found";
        return;
      } else {
        try {
          var project = {
            name: 1,
            id: 1,
            img: 1,
            phone: 1,
            email: 1,
            blood_group: 1,
            bootsize: 1,
            district: 1,
            fav_position: 1,
            home_truf: 1,
            prime: 1,
            sex: 1,
            strong_foot: 1,
            t_shirt_size: 1,
            zone: 1,
            goals: 1,
            ycs: 1,
          };
          var authers_guest = [];
          var authers = [];

          for (let a = 0; a < booking.authers.length; a++) {
            if (booking.authers[a].type === "users_guest")
              authers_guest.push(ObjectId(booking.authers[a]._id));
            else authers.push(ObjectId(booking.authers[a]._id));
          }

          await getTables("users_guest", {
            filter: { _id: { $in: authers_guest } },
            project,
          })
            .then((users) => {
              for (let i = 0; i < users.length; i++) users.guest = true;
              booking.authers = users;
            })
            .catch(() => (error = "Database Error1"));

          await getTables("users", {
            filter: { _id: { $in: authers } },
            project,
          })
            .then((users) => {
              for (let i = 0; i < users.length; i++) users.guest = false;
              booking.authers = booking.authers.concat(users);
            })
            .catch(() => (error = "Database Error2"));

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
      booking.status = req.query.status;
      if (error === null) res.send(booking);
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
  if (error !== null) res.status(404).send({ msg: error });
};

exports.ctakerGetAllMatchs = async (req, res) => {
  var ctaker = req.query.ctaker_id;
  var data = [];
  await getnolimitTables("bookings", { filter: { date, ctaker } })
    .then((bookings) => {
      if (bookings != null) {
        for (let i = 0; i < bookings.length; i++) bookings[i].status = "Booked";
        myRes.data = myRes.data.concat(bookings);
      }
    })
    .catch(() => (error = true));
  await getnolimitTables("matchs_live", { filter: { date, ctaker } })
    .then((bookings) => {
      if (bookings != null) {
        for (let i = 0; i < bookings.length; i++)
          bookings[i].status = "Started";
        myRes.data = myRes.data.concat(bookings);
      }
    })
    .catch(() => (error = true));
  await getnolimitTables("matchs_fulltime", { filter: { date, ctaker } })
    .then((bookings) => {
      if (bookings != null) {
        for (let i = 0; i < bookings.length; i++)
          bookings[i].status = "Fulltime";
        myRes.data = myRes.data.concat(bookings);
      }
    })
    .catch(() => (error = true));
  await getnolimitTables("matchs_cancelled", { filter: { date, ctaker } })
    .then((bookings) => {
      if (bookings != null) {
        for (let i = 0; i < bookings.length; i++)
          bookings[i].status = "Cancelled";
        myRes.data = myRes.data.concat(bookings);
      }
    })
    .catch(() => (error = true));
  for (let i = 0; i < data.length; i++) {
    try {
      var _id = ObjectId(data[i].slot_id);
      await getTable("slots", { _id })
        .then((slot) => (data[i].slot = slot))
        .catch(() => (error = true));
    } catch (error) {
      error = true;
    }
  }
  if (error) res.status(502).send({ msg: "Error: Database error" });
  else res.send(data);
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
    var myRes = { title: date, data: [] };
    await getnolimitTables("bookings", { filter: { date, ctaker } })
      .then((bookings) => {
        if (bookings != null) {
          for (let i = 0; i < bookings.length; i++)
            bookings[i].status = "Booked";
          myRes.data = myRes.data.concat(bookings);
        }
      })
      .catch((e) => (error = true));
    await getnolimitTables("matchs_live", { filter: { date, ctaker } })
      .then((bookings) => {
        if (bookings != null) {
          for (let i = 0; i < bookings.length; i++)
            bookings[i].status = "Started";
          myRes.data = myRes.data.concat(bookings);
        }
      })
      .catch((e) => (error = true));
    await getnolimitTables("matchs_fulltime", { filter: { date, ctaker } })
      .then((bookings) => {
        if (bookings != null) {
          for (let i = 0; i < bookings.length; i++)
            bookings[i].status = "Fulltime";
          myRes.data = myRes.data.concat(bookings);
        }
      })
      .catch((e) => (error = true));
    await getnolimitTables("matchs_cancelled", { filter: { date, ctaker } })
      .then((bookings) => {
        if (bookings != null) {
          for (let i = 0; i < bookings.length; i++)
            bookings[i].status = "Cancelled";
          myRes.data = myRes.data.concat(bookings);
        }
      })
      .catch((e) => (error = true));
    response.push(myRes);
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
    res.status(502).send({ msg: "Not a valid ID" });
    return;
  }

  var table = "bookings";
  if (body.status === "Fulltime") table = "matchs_live";
  if (body.status === "Update") {
    if (body.cur_status === "Started") table = "matchs_live";
    else table = "matchs_fulltime";
  }

  if (body.status === "Update") {
    delete body.status;
    delete body.cur_status;
    await putTable(table, { _id }, { $set: body })
      .then(() => res.send({ msg: "Succesfully Updated" }))
      .catch(() => res.status(502).send({ msg: "Database Error" }));
    return;
  }

  await getTable(table, { _id })
    .then((booking) => {
      if (booking == null) {
        res.status(502).send({ msg: "Thire is no match" });
        error = true;
      } else {
        if (body.status === "Started") {
          booking.starting_time = new Date();
          booking.events = [];
          booking.goals = { r: 0, b: 0 };
          booking.fouls = { r: 0, b: 0 };
          booking.rcs = { r: 0, b: 0 };
          booking.ycs = { r: 0, b: 0 };
          booking.shots = { r: 0, b: 0 };
          booking.possessions = { r: 0, b: 0 };
          booking.offsides = { r: 0, b: 0 };
          booking.corners = { r: 0, b: 0 };
          booking.teams = body.teams;
          postTable("matchs_live", booking)
            .then(() => deleteTable("bookings", { _id }))
            .catch(() => {
              res.status(502).send({ msg: "Error on posting to live" });
              error = true;
            });
        }
        if (body.status === "Cancelled") {
          booking.cancelled_time = new Date();
          postTable("matchs_cancelled", booking)
            .then(() => {
              deleteTable("bookings", { _id });
            })
            .catch(() => {
              res.status(502).send({ msg: "Database Error" });
              error = true;
            });
        }
        if (body.status === "Fulltime") {
          booking.ending_time = new Date();
          postTable("matchs_fulltime", booking)
            .then(() => {
              deleteTable("matchs_live", { _id });
            })
            .catch(() => {
              res.status(502).send({ msg: "Database Error" });
              error = true;
            });
        }
      }
    })
    .catch((e) => {
      res.status(502).send({ msg: "Database Error" });
      error = true;
    });
  if (error) return;
};
