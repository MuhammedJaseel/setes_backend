const { getTables, getTable } = require("../module/database");
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
    await getTables("slots", { filter: { truf__id: trufs[i]._id.toString() } })
      .then(async (slots) => {
        for (let j = 0; j < slots.length; j++) {
          var slot_id = slots[j]._id.toString();
          await getTables("bookings", { filter: { slot_id, date } })
            .then((data_1) => {
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
