const { ObjectId } = require("mongodb");
const { getTables, getTable, postTable } = require("../module/database");
const { putTable, deleteTable } = require("../module/database");

exports.adminGetCtaker = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("ctakers", { _id })
    .then((data) => {
      if (data === null) res.status(404).send({ msg: "No Data" });
      else return data;
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminGetCtakers = (req, res) => {
  getTables("ctakers", { sort: { _id: -1 }, limit: 50 })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPostCtaker = (req, res) => {
  var body = req.body;
  getTable("ctakers", { user_name: body.user_name })
    .then((data) => {
      if (data === null) {
        body.status = "Active";
        body.created = Date();
        body.updated = Date();
        postTable("ctakers", body)
          .then((data) => res.send({ msg: "Succesfully Added" }))
          .catch((err) => res.status(502).send({ msg: "Database Error" }));
      } else res.status(404).send({ msg: "Username allready exist" });
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPutCtaker = (req, res) => {
  var _id;
  var body = req.body;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  body.updated = Date();
  putTable("ctakers", { _id }, body)
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminDeleteCtaker = (req, res) => {
  var _id;
  var body = req.body;
  try {
    _id = ObjectId(req.query.ctaker_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  body.updated = Date();
  deleteTable("ctakers", { _id })
    .then((data) => res.send({ msg: "Succesfully Added" }))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
