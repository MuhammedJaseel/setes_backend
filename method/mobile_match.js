const { ObjectId } = require("mongodb");
const { getTables, getTable, postTable } = require("../module/database");
const { putTable, deleteTable } = require("../module/database");

exports.mobileGetMatch = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("bookings", {})
    .then((data) => {
      if (data === null) res.status(404).send({ msg: "No Data" });
      else return data;
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.mobileGetMatchs = (req, res) => {
  getTables("ctakers", { sort: { _id: -1 }, limit: 50 })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.mobilePostMatch = (req, res) => {
  var body = req.body;
  body.status = "Active";
  body.created = Date();
  body.updated = Date();
  postTable("ctakers", body)
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.mobilePutMatch = (req, res) => {
  var _id;
  var body = req.body;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  body.updated = Date();
  putTable("ctakers", { _id }, { $set: body })
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.mobileDeleteMatch = (req, res) => {
  var _id;
  var body = req.body;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  body.updated = new Date();
  deleteTable("ctakers", { _id })
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
