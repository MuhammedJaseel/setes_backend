const { getTables } = require("../module/database");

exports.adminLogin = (req, res) => {
  console.log(req.body);
  getTables("admins", {
    filter: { user_name: req.body.user_name, password: req.body.password },
    project: { password: 0 },
  })
    .then((data) => {
      if (data.length == 0) res.status(400).send({ msg: "Wrong Input" });
      else res.send(data[0]);
    })
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
