var ObjectId = require("mongodb").ObjectId;
const { getTable, getTables } = require("../module/database");

exports.mobileGetPublicProfile = (req, res) => {
  var _id;
  try {
    _id = ObjectId(req.query.user_id);
  } catch (e) {
    res.status(502).send({ msg: "Database Error" });
    return;
  }

  getTables("users", {
    filter: { _id },
    project: {
      img: 1,
      phone: 1,
      email: 1,
      blood_group: 1,
      bootsize: 1,
      district: 1,
      fav_position: 1,
      home_truf: 1,
      prime: 1,
      sex: 1,
      strong_foot: 1,
      t_shirt_size: 1,
      zone: 1,
      goals: 1,
      ycs: 1,
    },
  })
    .then((user) => {
      if (user.length > 0) res.send(user[0]);
      else res.status(400).send({ msg: "User Not Found" });
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
