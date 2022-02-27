const { getTables, getTable, getFtable } = require("../module/database");
const { postTable, putTable } = require("../module/database");
var ObjectId = require("mongodb").ObjectId;

exports.mobileGettruf = function (req, res) {
  // prams = { truf_id }
  var _id;
  try {
    _id = ObjectId(req.query.truf_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("slots", { _id })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.mobileGetTrufs = async (req, res) => {
  // prams = { type, date }
  var trufs = [];
  var trufs_active = [];
  var type = req.query.type;
  var date = req.query.date;
  if (type !== "s" && type !== "t") {
    res.status(400).send({ msg: "Wrong Input" });
    return;
  }
  await getTables("trufs", { sort: { _id: -1 }, limit: 30 })
    .then((data) => (trufs = data))
    .catch((err) => {
      res.status(502).send({ msg: "Database Error1" });
      return;
    });
  if (trufs.length == 0) {
    res.status(502).send({ msg: "Database Error1" });
    return;
  }
  for (let i = 0; i < trufs.length; i++) {
    await getTables("slots", {
      filter: { truf__id: trufs[i]._id.toString(), type },
    })
      .then(async (slots) => {
        for (let j = 0; j < slots.length; j++) {
          var slot_id = slots[j]._id.toString();
          await getTables("bookings", { filter: { slot_id, date } })
            .then((data_1) => {
              if (slots[j].type === "s") {
                if (data_1.length > 0)
                  if (
                    data_1[0].authers.length ===
                    slots[j].ground.split("x")[0] * 2
                  )
                    slots[j].booked = true;
                  else {
                    slots[j].booked = false;
                    slots[j].booked_cound = data_1[0].authers.length;
                  }
                else if (data_1.length > 0) slots[j].booked = true;
                else slots[j].booked = false;
              } else if (data_1.length > 0) {
                if (data_1[0].authers.length > 0) slots[j].booked = true;
                else slots[j].booked = false;
              } else slots[j].booked = false;
            })
            .catch(() => {
              res.status(502).send({ msg: "Database Error" });
              return;
            });
        }
        trufs[i].slots = slots;
        if (slots.length !== 0) trufs_active.push(trufs[i]);
      })
      .catch((err) => {
        res.status(502).send({ msg: "Database Error" });
        return;
      });
  }
  res.send(trufs_active);
};

exports.mobileVerifyBooking = async (req, res) => {
  // body={ slot_id, date, type, user_id }
  var body = req.body;
  var _id;
  try {
    _id = ObjectId(body.slot_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error 1" });
    return;
  }
  var slot = {};
  var error = false;
  await getTable("slots", { _id })
    .then((data) => {
      if (data == null) {
        res.status(400).send({ msg: "Slot not found" });
        error = true;
      } else slot = data;
    })
    .catch(() => res.status(502).send({ msg: "Database Error 2" }));

  if (error) return;

  await getTable("bookings", { slot_id: body.slot_id, date: body.date })
    .then((data) => {
      if (data === null) {
        if (body.type === "s") res.send({ msg: "Succesfully verifyde" });
      } else {
        if (data.type !== body.type) {
          res.status(400).send({ msg: "Wrong Input" });
        } else {
          if (body.type === "s") {
            const authers = data.authers;
            if (
              slot.ground.split("x")[0] * 2 === authers.length ||
              data.status !== "Booked"
            ) {
              if (data.status !== "Booked")
                res.status(400).send({ msg: "Slot Is " + data.status });
              else res.status(400).send({ msg: "Slot Is Full" });
              return 0;
            }
            for (let k = 0; k < authers.length; k++) {
              if (authers[k] === body.user_id) {
                const msg = "You are allready booked to the uorrent slot";
                res.status(400).send({ msg });
                return 0;
              }
            }
            try {
              _id = ObjectId(body.user_id);
            } catch (error) {
              res.status(502).send({ msg: "Database Error on user Id" });
              return;
            }
            getTable("users", { _id })
              .then((user) => {
                if (user != null)
                  res.send({ wallet: user.wallet, credit: user.credit });
                else res.status(502).send({ msg: "User not fount" });
              })
              .catch(() => res.status(502).send({ msg: "Database Error 2" }));
          } else res.status(400).send({ msg: "Slot is Allready Booked" });
        }
      }
    })
    .catch(() => {
      res.status(502).send({ msg: "Database Error 6" });
      return;
    });
};

exports.mobileBookTruf = async (req, res) => {
  // body={ slot_id, date, type, user_id }
  var body = req.body;
  var booking = {
    slot_id: body.slot_id,
    date: body.date,
    type: body.type,
    authers: body.user_id,
    created: new Date(),
    updated: [],
    status: "Booked",
  };
  var _id;
  try {
    _id = ObjectId(body.slot_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error 1" });
    return;
  }
  var slot = {};
  var error = false;
  await getTable("slots", { _id })
    .then((data) => {
      if (data == null) {
        res.status(400).send({ msg: "Slot not found" });
        error = true;
      } else slot = data;
    })
    .catch(() => res.status(502).send({ msg: "Database Error 2" }));

  if (error) return;

  await getTable("bookings", { slot_id: body.slot_id, date: body.date })
    .then((data) => {
      if (data === null) {
        if (body.type === "s") {
          booking.authers = [body.user_id];
          booking.ctaker = slot.ctaker;
          postTable("bookings", booking)
            .then((booked) => {
              res.send({ msg: "Succesfully Booked" });
              setUserBookingHistory(body, booked.insertedId);
            })
            .catch(() => res.status(502).send({ msg: "Database Error 3" }));
        } else {
          postTable("bookings", booking)
            .then((booked) => {
              res.send({ msg: "Succesfully Booked" });
              setUserBookingHistory(body, booked.insertedId);
            })
            .catch(() => res.status(502).send({ msg: "Database Error 4" }));
        }
      } else {
        if (data.type !== body.type)
          res.status(400).send({ msg: "Wrong Input" });
        else if (body.type === "s") {
          const authers = data.authers;
          if (
            slot.ground.split("x")[0] * 2 === authers.length ||
            data.status !== "Booked"
          ) {
            if (data.status !== "Booked")
              res.status(400).send({ msg: "Slot Is " + data.status });
            else res.status(400).send({ msg: "Slot Is Full" });
            return 0;
          }
          for (let k = 0; k < authers.length; k++) {
            if (authers[k] === body.user_id) {
              res
                .status(400)
                .send({ msg: "You are allready booked to the uorrent slot" });
              return 0;
            }
          }
          authers.push(body.user_id);
          putTable("bookings", { _id: data._id }, { $set: { authers } })
            .then((booked) => {
              res.send({ msg: "Succesfully Booked" });
              if (slot.ground.split("x")[0] * 2 === authers.length - 1) {
                postTable("matchs", {
                  booking_id: data._id,
                  slot_id: body.slot_id,
                  date: body.date,
                  authers: body.user_id,
                  created: new Date(),
                  status: "Booked",
                  started: false,
                  ended: false,
                }).catch((e) => console.log(e));
              }
              setUserBookingHistory(body, data._id);
            })
            .catch((err) => res.status(502).send({ msg: "Database Error 5" }));
        } else res.status(400).send({ msg: "Slot is Allready Booked" });
      }
    })
    .catch((err) => {
      res.status(502).send({ msg: "Database Error 6" });
      return;
    });
};

function setUserBookingHistory(body, booking_id) {
  try {
    var _id = ObjectId(body.user_id);
    getFtable("users", { _id }, { project: { bookings: 1 } })
      .then((user) => {
        console.log(user);
        var bookings = user.bookings ?? [];
        bookings.unshift(booking_id);
        putTable("users", { _id }, { $set: { bookings } });
      })
      .catch((e) => console.log(e));
  } catch (error) {
    return;
  }
}
