var ObjectId = require("mongodb").ObjectId;
const { getTable, getTables, putTable } = require("../module/database");

exports.mobileGetSlot = function (req, res) {
  // prams = { slot_id , date}
  var _id;
  var date = req.query.date;
  var error = null;
  try {
    _id = ObjectId(req.query.slot_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("slots", { _id })
    .then((data) => {
      getTable("bookings", { date, slot_id: _id.toString() })
        .then(async (booking) => {
          if (booking == null) {
            data.authers = [];
            res.send(data);
          } else {
            var authers = [];
            var authers_guest = [];
            try {
              for (let i = 0; i < booking.authers.length; i++) {
                if (booking.authers[i].type === "users")
                  authers.push(ObjectId(booking.authers[i]._id));
                else authers_guest.push(ObjectId(booking.authers[i]._id));
              }
            } catch (error) {
              res.status(502).send({ msg: "Database Error" });
              return;
            }

            await getTables("users", {
              filter: { _id: { $in: authers } },
              project: { id: 1, name: 1, img: 1 },
            })
              .then((users) => (data.authers = users))
              .catch((err) => (error = "Some of the booked user not found"));
            await getTables("users_guest", {
              filter: { _id: { $in: authers_guest } },
              project: { id: 1, name: 1, img: 1 },
            })
              .then((users) => (data.authers = data.authers.concat(users)))
              .catch((err) => (error = "Some of the booked user not found"));

            if (error === null) {
              data.booking = booking;
              res.send(data);
            } else res.status(502).send({ msg: error });
          }
        })
        .catch((err) => res.status(502).send({ msg: "Database Error" }));
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
