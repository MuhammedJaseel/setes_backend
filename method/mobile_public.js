var ObjectId = require("mongodb").ObjectId;
const { getTable } = require("../module/database");

exports.mobileGetPublicProfile = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }

  getTable("users", { _id })
    .then((user) => {
      if (user === null) res.status(400).send({ msg: "User Not Found" });
      else res.send(user);
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
