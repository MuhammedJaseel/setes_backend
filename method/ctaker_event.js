const { ObjectId } = require("mongodb");
const { putTable, getTable } = require("../module/database");

exports.ctakerAddEvent = async (req, res) => {
  var body = req.body;
  var _id;
  try {
    _id = ObjectId(body.match_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  delete body.match_id;
  await getTable("bookings", { _id })
    .then(async (booking) => {
      if (booking !== null) {
        var events = booking.events;
        var item = booking[body.item];
        events.push(body);
        item[body.who.team] = item[body.who.team] + 1;
        var updateBody = {};
        updateBody[body.item] = item;
        updateBody.events = events;
        putTable("bookings", { _id }, { $set: updateBody })
          .then(() => {
            res.send({ msg: "Succesfully updated" });
            try {
              _id = ObjectId(body.who._id);
              getTable("users", { _id }).then((user) => {
                updateBody = {};
                updateBody[body.item] = (user[body.item] ?? 0) + 1;
                putTable("users", { _id }, { $set: updateBody });
              });
            } catch (error) {}
          })
          .catch((e) => {
            res.status(502).send({ msg: "Error: Getting booking table" });
          });
      } else res.status(502).send({ msg: "Error: Not a valid id" });
    })
    .catch(() => res.status(502).send({ msg: "Error: Getting booking table" }));
};
