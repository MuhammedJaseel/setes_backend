const { getTable } = require("../module/database");

exports.ctakerLogin = (req, res) => {
  getTable("ctakers", req.body)
    .then((ctaker) => {
      if (ctaker === null) res.status(401).send({ msg: "Wrong credential" });
      else {
        delete ctaker.password;
        res.send(ctaker);
      }
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
