const { getTable, getFtable } = require("../module/database");
const { postTable, putTable } = require("../module/database");
var ObjectId = require("mongodb").ObjectId;

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
        if (body.type === "s") res.send({ msg: "Succesfully verified" });
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
                const msg = "You are already booked to the current slot";
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
  // body={ slot_id, date, type, user_id , ac_type}
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
  if (body.ac_type !== bank) {
    console.log(body);
    var msg = "Wallet and Credit booking is not avalible for this.";
    res.status(502).send({ msg });
    return;
  }
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
              var msg = "You are already booked to the current slot";
              res.status(400).send({ msg });
              return 0;
            }
          }
          authers.push(body.user_id);
          putTable("bookings", { _id: data._id }, { $set: { authers } })
            .then(() => {
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
            .catch(() => res.status(502).send({ msg: "Database Error 5" }));
        } else res.status(400).send({ msg: "Slot is Allready Booked" });
      }
    })
    .catch(() => {
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
