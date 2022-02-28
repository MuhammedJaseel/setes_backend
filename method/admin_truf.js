var ObjectId = require("mongodb").ObjectId;
const { getTable, getTables } = require("../module/database");
const { postTable, putTable, deleteTable } = require("../module/database");
const fs = require("fs");

exports.adminGetTruf = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.truf_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  getTable("trufs", { _id })
    .then((data) => {
      if (data === null) res.status(404).send({ msg: "No Data" });
      else {
        return data;
      }
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminGetTrufs = (req, res) => {
  getTables("trufs", { sort: { _id: -1 }, limit: 50 })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPostTruf = async (req, res) => {
  var body = JSON.parse(req.body.body);
  body.created = Date();
  body.updated = Date();
  body.status = "r";
  body.raiting = 50;
  body.id = body.id.toUpperCase();

  await getTable("trufs", { id: body.id })
    .then((data) => {
      if (data !== null) {
        res.status(304).send({ msg: "Id Allready Exist" });
        return;
      }
    })
    .catch((err) => {
      res.status(502).send({ msg: "Database Error" });
      return;
    });

  postTable("trufs", body)
    .then((data) => {
      res.send({ msg: "Succesfully Inserted" });
      if (req.files != null) {
        var _id = data.insertedId;
        var img = [];
        var dir = `./public_asset/trufs/${_id}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        if (req.files.img1 != null) {
          var image = req.files.img1;
          const types = image.name.split(".");
          const type = image.name.split(".")[types.length - 1];
          var path = `public_asset/trufs/${_id}/img1.${type}`;
          fs.writeFile(path, image.data, function (err) {
            if (err) throw err;
            else {
              img.push(`img1.${type}`);
              putTable("trufs", { _id }, { $set: { img } });
            }
          });
        }
        if (req.files.img2 != null) {
          var image = req.files.img2;
          const types = image.name.split(".");
          const type = image.name.split(".")[types.length - 1];
          var path = `public_asset/trufs/${_id}/img2.${type}`;
          fs.writeFile(path, image.data, function (err) {
            if (err) throw err;
            else {
              img.push(`img2.${type}`);
              putTable("trufs", { _id }, { $set: { img } });
            }
          });
        }
        if (req.files.img3 != null) {
          var image = req.files.img3;
          const types = image.name.split(".");
          const type = image.name.split(".")[types.length - 1];
          var path = `public_asset/trufs/${_id}/img3.${type}`;
          fs.writeFile(path, image.data, function (err) {
            if (err) throw err;
            else {
              img.push(`img3.${type}`);
              putTable("trufs", { _id }, { $set: { img } });
            }
          });
        }
      } else putTable("trufs", { _id }, { $set: { img: [] } });
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminPutTruf = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.truf_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  var body = JSON.parse(req.body.body);
  body.updated = Date();
  putTable("trufs", { _id }, { $set: body })
    .then(() => {
      res.send({ msg: "Succesfully Updated" });
      if (req.files != null) {
        var img = [];
        var dir = `./public_asset/trufs/${_id}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        if (req.files.img1 != null) {
          var image = req.files.img1;
          const types = image.name.split(".");
          const type = image.name.split(".")[types.length - 1];
          var path = `public_asset/trufs/${_id}/img1.${type}`;
          console.log(path);
          fs.writeFile(path, image.data, function (err) {
            if (err) throw err;
            else {
              img.push(`img1.${type}`);
              putTable("trufs", { _id }, { $set: { img } });
            }
          });
        }
        if (req.files.img2 != null) {
          var image = req.files.img2;
          const types = image.name.split(".");
          const type = image.name.split(".")[types.length - 1];
          var path = `public_asset/trufs/${_id}/img2.${type}`;
          fs.writeFile(path, image.data, function (err) {
            if (err) throw err;
            else {
              img.push(`img2.${type}`);
              putTable("trufs", { _id }, { $set: { img } });
            }
          });
        }
        if (req.files.img3 != null) {
          var image = req.files.img3;
          const types = image.name.split(".");
          const type = image.name.split(".")[types.length - 1];
          var path = `public_asset/trufs/${_id}/img3.${type}`;
          fs.writeFile(path, image.data, function (err) {
            if (err) throw err;
            else {
              img.push(`img3.${type}`);
              putTable("trufs", { _id }, { $set: { img } });
            }
          });
        }
      }
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};

exports.adminDeleteTruf = function (req, res) {
  var _id;
  try {
    _id = ObjectId(req.query.truf_id);
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  deleteTable("trufs", { _id })
    .then((data) => {
      res.send({ msg: "Succesfully Deleted" });
      try {
        fs.rmdir("public_asset/trufs/" + req.query.truf_id, {
          recursive: true,
        });
      } catch (error) {}
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
