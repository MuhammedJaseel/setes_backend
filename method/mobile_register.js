const { putTable, countTable } = require("../module/database");
const { sendSocketMsg } = require("../module/web_socket");
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
      blocked: false,
      created: new Date(),
      updated: new Date(),
    };
  } catch (error) {
    res.status(502).send({ msg: "Error : (Not a valid id)" });
    return;
  }
  putTable("users", { _id }, { $set: body })
    .then(() => {
      body._id = _id;
      res.send(body);
      sendSocketMsg("admins", "noti|users", true, "");
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
