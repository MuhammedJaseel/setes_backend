var ObjectId = require("mongodb").ObjectId;
const { getTable, getTables, postTable } = require("../module/database");
const { putTable, deleteTable } = require("../module/database");

exports.adminGetslot = function (req, res) {
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

exports.adminGetslots = function (req, res) {
  const type = req.query.type;
  getTables("slots", { filter: { type } })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPostslot = function (req, res) {
  var body = req.body;
  body.status = "o";
  postTable("slots", body)
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPutslot = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.slot_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  putTable("slots", { _id }, { $set: body })
    .then((data) => res.send({ msg: "Succesfully Updated" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminDeleteslot = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.slot_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  deleteTable("slots", { _id })
    .then((data) => res.send({ msg: "Succesfully Deleted" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
