const { getTables } = require("../module/database");

exports.adminGetMemebers = function (req, res) {
  getTables("users", {
    sort: { _id: -1 },
    limit: 50,
    filter: { registerd: true },
  })
    .then((data) => res.send(data))
    .catch((err) => res.status(502).send({ msg: "Database Error" }));
};
