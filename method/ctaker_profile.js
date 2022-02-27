const { ObjectId } = require("mongodb");
const { getTable } = require("../module/database");

exports.ctakerGetProfile = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("ctakers", { _id })
    .then((ctaker) => {
      if (ctaker === null) res.status(401).send({ msg: "User Not Found" });
      else {
        delete ctaker.password;
        res.send(ctaker);
      }
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
