var ObjectId = require("mongodb").ObjectId;
const { getTable, getTables, putTable } = require("../module/database");

exports.mobileGetSlot = function (req, res) {
  // prams = { slot_id , date}
  var _id;
  var date = req.query.date;
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
            try {
              for (let i = 0; i < booking.authers.length; i++)
                authers.push(ObjectId(booking.authers[i]._id));
            } catch (error) {
              res.status(502).send({ msg: "Database Error" });
              return;
            }
            await getTables(booking.authers[i].type, {
              filter: { _id: { $in: authers } },
              project: { id: 1, name: 1, img: 1 },
            })
              .then((users) => {
                data.booking = booking;
                data.authers = users;
                res.send(data);
              })
              .catch((err) => {
                console.log(err);
                res.status(502).send({ msg: "Database Error" });
                return;
              });
          }
        })
        .catch((err) => res.status(502).send({ msg: "Database Error" }));
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
