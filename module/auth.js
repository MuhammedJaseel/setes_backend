const { ObjectId } = require("mongodb");
const { getTables, putTable } = require("./database");

exports.mobileAuth = function (req, res, next) {
  var _id;
  try {
    _id = ObjectId(req.headers.user_id);
  } catch (e) {
    res.status(401).send({ msg: "Unauthorized :Errro ID Error" });
    return;
  }
  getTables("users", { filter: { _id }, project: { key: 1 } })
    .then((user) => {
      if (user.length == 0)
        res.status(401).send({ msg: "Unauthorized :Errro User not found" });
      else if (user[0].key === req.headers.key) {
        next();
        if (req.headers.gps != null)
          putTable("users", { _id }, { $set: { lase_gps: req.headers.gps } });
      } else res.status(401).send({ msg: "Unauthorized" });
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

exports.adminAuth = function (req, res, next) {
  var _id;
  try {
    _id = ObjectId(req.headers.user_id);
  } catch (e) {
    res.status(401).send({ msg: "Unauthorized :Errro ID Error" });
    return;
  }
  getTables("admins", { filter: { _id }, project: { key: 1 } })
    .then((admin) => {
      if (admin.length === 0)
        res.status(401).send({ msg: "Unauthorized :Errro User not found" });
      else {
        if (admin[0].key === req.headers.key) {
          next();
          if (req.headers.gps != null)
            putTable(
              "admins",
              { _id },
              { $set: { lase_gps: req.headers.gps } }
            );
        } else res.status(401).send({ msg: "Unauthorized" });
      }
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};

exports.ctakerAuth = function (req, res, next) {
  var _id;
  try {
    _id = ObjectId(req.headers.user_id);
  } catch (e) {
    res.status(401).send({ msg: "Unauthorized :Errro ID Error" });
    return;
  }
  getTables("ctakers", { filter: { _id }, project: { key: 1 } })
    .then((ctaker) => {
      if (ctaker.length === 0)
        res.status(401).send({ msg: "Unauthorized :Errro User not found" });
      else {
        if (ctaker[0].key === req.headers.key) {
          next();
          if (req.headers.gps != null)
            putTable(
              "ctakers",
              { _id },
              { $set: { lase_gps: req.headers.gps } }
            );
        } else res.status(401).send({ msg: "Unauthorized" });
      }
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
