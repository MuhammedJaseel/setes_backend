var ObjectId = require("mongodb").ObjectId;
const { getTable, putTable } = require("../module/database");
const fs = require("fs");

// SECTION:STARTS => TOPIC: its all related to user profile////////////////////////////////////////
exports.mobileGetPropfile = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  const table = req.headers.type == "users_guest" ? "users_guest" : "users";
  getTable(table, { _id })
    .then((user) => {
      if (user === null) res.status(400).send({ msg: "User Not Found" });
      else res.send(user);
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

exports.mobilePutProfile = async (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Error: OBJECTID ERR" });
    return;
  }
  const table = req.headers.type == "users_guest" ? "users_guest" : "users";
  putTable(table, { _id }, { $set: req.body })
    .then((user) => res.send({ msg: "Succesfully Updated" }))
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

exports.mobileUpdtaeProfilePic = async (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Error: OBJECTID ERR" });
    return;
  }
  const table = req.headers.type == "users_guest" ? "users_guest" : "users";
  const dir = `./public_asset/members/${_id}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (req.files.img != null) {
    const image = req.files.img;
    const types = image.name.split(".");
    const type = image.name.split(".")[types.length - 1];
    const path = `public_asset/members/${_id}/max.${type}`;
    fs.writeFile(path, image.data, (err) => {
      if (err) res.status(502).send({ msg: "Error: IMAGE ERR" });
      else
        putTable(table, { _id }, { $set: { img: `max.${type}` } })
          .then(() => res.send({ msg: "Succesfully Updated" }))
          .catch(() => res.status(502).send({ msg: "Database Error" }));
    });
  }
};
// SECTION:ENDS => Ending Profile section//////////////////////////////////////////////////////////

exports.mobileGetNoti = async (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  const table = req.headers.type == "users_guest" ? "users_guest" : "users";
  getTable(table, { _id })
    .then((user) => {
      if (user === null) res.status(502).send({ msg: "Database Error" });
      else res.send(user.noti ?? []);
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

exports.mobileGetBookings = async (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Error: OBJECTID ERR" });
    return;
  }
  const table = req.headers.type == "users_guest" ? "users_guest" : "users";
  getTable(table, { _id })
    .then(async (user) => {
      var bookings = user.bookings ?? [];
      var my_bookings = [];
      for (let i = 0; i < bookings.length && i < 50; i++) {
        var booking_id;
        try {
          booking_id = ObjectId(bookings[i]);
        } catch (e) {
          res.status(502).send({ msg: "Error: OBJECTID ERR:BOOKINGID" });
          return;
        }
        await getTable("bookings", booking_id)
          .then((booking) => my_bookings.push({ booking }))
          .catch((e) => {
            res.status(502).send({ msg: "Database Error 3" });
            return;
          });
        var slot_id;
        try {
          slot_id = ObjectId(my_bookings[i].booking.slot_id);
        } catch (e) {
          res.status(502).send({ msg: "Error: OBJECTID ERR:SLOTID" });
          return;
        }
        await getTable("slots", { _id: slot_id })
          .then((slot) => (my_bookings[i]["slot"] = slot))
          .catch(() => {
            res.status(502).send({ msg: "Database Error 5" });
            return;
          });
        var truf_id;

        try {
          truf_id = ObjectId(my_bookings[i].slot.truf__id);
        } catch (e) {
          res.status(502).send({ msg: "Error: OBJECTID ERR:TRUFID" });
          return;
        }
        await getTable("trufs", { _id: truf_id })
          .then((truf) => (my_bookings[i]["truf"] = truf))
          .catch(() => {
            res.status(502).send({ msg: "Database Error 7" });
            return;
          });
      }
      res.send(my_bookings);
    })
    .catch((e) =>
      res.status(502).send({ msg: "Database Error 8", desc: e.toString() })
    );
};
