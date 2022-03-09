const { ObjectId } = require("mongodb");
const { getTables } = require("./database");

exports.mobileAuth = function (req, res, next) {
  console.log(req.headers);
  var _id;
  try {
    _id = ObjectId(req.headers.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTables("users", { filter: { _id }, project: { key: 1 } })
    .then((user) => {
      if (user[0].key === req.headers.key) next();
      else res.status(401).send({ msg: "fUnauthorized" });
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

exports.adminAuth = function (req, res, next) {
  next();
};

exports.ctakerAuth = function (req, res, next) {
  next();
};
