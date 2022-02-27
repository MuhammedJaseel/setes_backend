const { getTables } = require("../module/database");

exports.mobileScorebord = (req, res) => {
  var filter = {
    status: { $in: ["Fulltime", "Started"] },
  };
  getTables("bookings", { filter, limit: 15 })
    .then((bookings) => res.send(bookings))
    .catch(() => res.status(502).send({ msg: "Database Error" }));
};
