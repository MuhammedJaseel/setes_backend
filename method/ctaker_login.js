const { getTable } = require("../module/database");

exports.ctakerLogin = (req, res) => {
  var key = Math.random().toString();
  getTable("ctakers", req.body)
    .then((ctaker) => {
      if (ctaker === null) res.status(401).send({ msg: "Wrong credential" });
      else {
        delete ctaker.password;
        putTable("ctakers", { _id: ctaker._id }, { $set: { key } })
          .then(() => {
            ctaker.key = key;
            res.send(ctaker);
          })
          .catch((e) => res.status(502).send({ msg: "Database Error" }));
      }
    })
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
