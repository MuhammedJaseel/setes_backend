const { putTable, countTable } = require("../module/database");
var ObjectId = require("mongodb").ObjectId;

exports.mobileRegister = async (req, res) => {
  var key = Math.random().toString();
  var _id, body;
  currCount = (await countTable("users", { registerd: true })) + 1;
  try {
    _id = ObjectId(req.query.user_id);
    body = {
      guest: false,
      name: req.body.name,
      email: req.body.email,
      email_verifide: false,
      id: currCount.toString(25),
      registerd: true,
      prime: false,
      img: null,
      key,
      credit: 0,
      wallet: 0,
      bookings: [],
      lat: "9090",
      log: "78787",
      blocked: false,
      created: new Date(),
      updated: new Date(),
    };
  } catch (error) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }
  putTable("users", { _id }, { $set: body })
    .then((data) => {
      body._id = _id;
      res.send(body);
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
