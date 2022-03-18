const { postTable, putTable, getTable } = require("../module/database");
const { adminAddNoti } = require("./admin_noti");
const { ctakerAddNoti } = require("./ctaker_noti");
var ObjectId = require("mongodb").ObjectId;

exports.mobileVerifyBooking = async (req, res) => {
  // body={ slot_id, date,  user_id }
  var body = req.body;
  var slot = {};
  var booking_user = {};
  var error = false;
  var slot_id;
  var user_id;
  try {
    slot_id = ObjectId(body.slot_id);
    user_id = ObjectId(body.user_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error 1" });
    return;
  }

  await getTable("slots", { _id: slot_id })
    .then((data) => {
      if (data == null) {
        res.status(400).send({ msg: "Slot not found" });
        error = true;
      } else slot = data;
    })
    .catch(() => res.status(502).send({ msg: "Database Error 2" }));

  if (error) return;

  await getTable(req.headers.type ?? "users", { _id: user_id })
    .then((user) => {
      if (user != null) booking_user = user;
      else {
        res.status(502).send({ msg: "User not fount" });
        error = true;
      }
    })
    .catch(() => {
      res.status(502).send({ msg: "Errro on getting user details" });
      error = true;
    });

  if (error) return;

  await getTable("bookings", { slot_id: body.slot_id, date: body.date })
    .then((data) => {
      if (data === null)
        res.send({
          wallet: booking_user.wallet,
          credit: booking_user.credit,
          payment_api: "rzp_test_Y7JuSZ90XUqdEG",
        });
      else {
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
        res.send({
          wallet: booking_user.wallet,
          credit: booking_user.credit,
          payment_api: "rzp_test_Y7JuSZ90XUqdEG",
        });
      }
    })
    .catch(() => {
      res.status(502).send({ msg: "Database Error 6" });
      return;
    });
};

exports.mobileBookTruf = async (req, res) => {
  // body={ slot_id, date,  user_id , ac_type}
  var body = req.body;
  var booking = {
    slot_id: body.slot_id,
    date: body.date,
    type: "s",
    authers: body.user_id,
    created: new Date(),
    updated: [],
    status: "Booked",
  };

  var _id;
  var slot = {};
  var booking_user = {};
  var error = false;

  try {
    _id = ObjectId(body.slot_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error 1" });
    return;
  }

  await getTable("slots", { _id })
    .then((data) => {
      if (data == null) {
        res.status(400).send({ msg: "Slot not found" });
        error = true;
      } else slot = data;
    })
    .catch(() => res.status(502).send({ msg: "Database Error 2" }));

  if (error) return;

  if (body.ac_type !== "bank") {
    try {
      _id = ObjectId(body.user_id);
    } catch (error) {
      res.status(502).send({ msg: "Database Error 1" });
      return;
    }
    await getTable(req.headers.type ?? "users", { _id })
      .then((user) => {
        booking_user = user;
        if (user[body.ac_type] < slot.price) {
          var msg = "Sorry you don't have enough credit or wallet amount.";
          res.status(502).send({ msg });
          error = true;
        }
      })
      .catch(() => {
        var msg = "Error on getting user datas.";
        res.status(502).send({ msg });
        error = true;
      });
  }

  if (error) return;

  await getTable("bookings", { slot_id: body.slot_id, date: body.date })
    .then((data) => {
      if (data === null) {
        booking.authers = [
          { _id: body.user_id, type: req.headers.type ?? "users" },
        ];
        booking.ctaker = slot.ctaker;
        postTable("bookings", booking)
          .then((booked) => {
            res.send({ msg: "Succesfully Booked" });
            setUserBookingHistory(
              booking_user,
              booked.insertedId,
              body.ac_type,
              slot.price
            );
            var desc = `New Booking to truf ${slot.truf_name} (${slot.truf_id})`;
            adminAddNoti("New Booking", desc, "Setes Booking");
            desc = `New Booking to truf ${slot.truf_name} (${slot.truf_id})`;
            if (body.type === "s")
              ctakerAddNoti(slot.ctaker, "New match added", desc, "New Match");
          })
          .catch(() => res.status(502).send({ msg: "Database Error 3" }));
      } else {
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
        authers.push({ _id: body.user_id, type: req.headers.type ?? "users" });
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
            setUserBookingHistory(
              booking_user,
              data._id,
              body.ac_type,
              slot.price
            );
            var desc = `New Booking to truf ${slot.truf_name} (${slot.truf_id})`;
            adminAddNoti("New Booking", desc, "Setes Booking");
            desc = `New Booking to truf ${slot.truf_name} (${slot.truf_id})`;
            ctakerAddNoti(
              slot.ctaker,
              "One more player is added",
              desc,
              "New Player"
            );
          })
          .catch(() => res.status(502).send({ msg: "Database Error 5" }));
      }
    })
    .catch(() => {
      res.status(502).send({ msg: "Database Error 6" });
      return;
    });
};

function setUserBookingHistory(user, booking_id, ac_type, price) {
  var bookings = user.bookings ?? [];
  bookings.unshift(booking_id);
  var update_set = { bookings };
  if (ac_type != "bank") {
    if (ac_type == "wallet") update_set.wallet = user.wallet - price;
    if (ac_type == "credit") update_set.credit = user.credit - price;
  }
  putTable("users", { _id: user._id }, { $set: update_set })
    .then((user) => {})
    .catch((e) => console.log(e));
}
