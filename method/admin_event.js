var ObjectId = require("mongodb").ObjectId;
const { getTable, getTables, postTable } = require("../module/database");
const { putTable, deleteTable } = require("../module/database");
const fs = require("fs");

exports.adminGetEvent = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.event_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("events", { _id })
    .then((data) => {
      if (data === null) res.status(404).send({ msg: "No Data" });
      else return data;
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminGetEvents = function (req, res) {
  getTables("events", { sort: { _id: -1 }, limit: 50 })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPostEvent = function (req, res) {
  if (req.files == null) {
    res.status(400).send({ msg: "Image Not Found" });
    return 0;
  }
  if (req.files.img.mimetype.split("/")[0] != "image") {
    res
      .status(400)
      .send({ msg: "Oop's, the file you uploaded is not image/photo" });
    return 0;
  }
  if (req.files.img.size > 1000000) {
    res.status(400).send({ msg: "Image Size Large" });
    return 0;
  }
  var body = JSON.parse(req.body.body);
  body.created = Date();
  body.updated = Date();
  body.status = "r";
  postTable("events", body)
    .then((data) => {
      res.send({ msg: "Succesfully Inserted" });
      if (req.files != null) {
        console.log(data);
        var img = data.insertedId + "." + req.files.img.name.split(".")[1];
        var path = "public_asset/events/" + img;
        fs.writeFile(path, req.files.img.data, function (err) {
          if (err) throw err;
          else
            putTable("events", { _id: data.insertedId }, { $set: { img } })
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
        });
      }
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPutEvent = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.event_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  var body = JSON.parse(req.body.body);
  body.updated = Date();
  putTable("events", { _id }, { $set: body })
    .then((data) => {
      res.send({ msg: "Succesfully Updated" });
      if (req.files != null) {
        var img = _id + "." + req.files.img.name.split(".")[1];
        var path = "public_asset/events/" + img;
        fs.writeFile(path, req.files.img.data, function (err) {
          if (err) throw err;
          else putTable("events", { _id }, { $set: { img } });
        });
      }
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminDeleteEvent = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.event_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("events", { _id })
    .then((data) => {
      if (data === null) res.status(404).send({ msg: "No Data" });
      else
        deleteTable("events", { _id })
          .then(() => {
            res.send({ msg: "Succesfully Deleted" });
            try {
              fs.unlinkSync("public_asset/events/" + data.img);
            } catch (error) {
              throw error;
            }
          })
          .catch((err) => res.status(502).send({ msg: "Database Error" }));
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
