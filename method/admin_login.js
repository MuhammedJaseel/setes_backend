const { getTables, putTable } = require("../module/database");

exports.adminLogin = (req, res) => {
  var key = Math.random().toString();
  getTables("admins", {
    filter: { user_name: req.body.user_name, password: req.body.password },
    project: { password: 0 },
  })
    .then((data) => {
      if (data.length == 0) res.status(400).send({ msg: "Wrong Input" });
      else {
        putTable("admins", { _id: data[0]._id }, { $set: { key } })
          .then(() => {
            data.key = key;
            res.send(data[0]);
          })
          .catch((e) => res.status(502).send({ msg: "Database Error" }));
      }
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
