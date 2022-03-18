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
        .then(async (data_1) => {
          if (data_1 == null) {
            if (data.type === "t") res.send(data);
            else {
              data.authers = [];
              res.send(data);
            }
          } else {
            if (data.type === "t")
              res.status(410).send({ msg: "The truf is allredy booked." });
            else if (data_1.authers.length < data.ground.split("x")[0] * 2) {
              var authers = [];
              try {
                for (let i = 0; i < data_1.authers.length; i++)
                  authers.push(ObjectId(data_1.authers[i]._id));
              } catch (error) {
                res.status(502).send({ msg: "Database Error" });
                return;
              }
              await getTables(data_1.authers[i].type, {
                filter: { _id: { $in: authers } },
                project: { id: 1, name: 1, img: 1 },
              })
                .then((user) => {
                  data.booking = data_1;
                  data.authers = user;
                  res.send(data);
                })
                .catch((err) => {
                  res.status(502).send({ msg: "Database Error" });
                  return;
                });
            } else res.status(410).send({ msg: "The truf is allredy booked." });
          }
        })
        .catch((err) => res.status(502).send({ msg: "Database Error" }));
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
