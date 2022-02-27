var ObjectId = require("mongodb").ObjectId;
const { getTables, postTable } = require("../module/database");
const { putTable, deleteTable } = require("../module/database");

exports.adminGetadmins = function (req, res) {
  getTables("admins", { project: { password: 0 } })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPostadmin = function (req, res) {
  getTables("admins", { project: { password: 0 } })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
  var body = req.body;
  body.status = "Active";
  body.created = Date();
  body.updated = Date();
  postTable("admins", body)
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPutadmin = function (req, res) {
  var _id;
  var body = req.body;
  try {
    _id = ObjectId(req.query.admin_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  body.updated = Date();
  putTable("admins", { _id }, { $set: body })
    .then((data) => res.send({ msg: "Succesfully Updated" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminDeleteadmin = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.admin_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  console.log(_id);
  deleteTable("admins", { _id })
    .then((data) => res.send({ msg: "Succesfully Deleted" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
